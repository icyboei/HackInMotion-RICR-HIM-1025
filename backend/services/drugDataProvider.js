/**
 * drugDataProvider.js — DrugDataProvider
 *
 * Abstraction layer for drug data APIs.
 * Primary sources: RxNorm (NIH) + OpenFDA
 * Both are FREE and require NO API key.
 *
 * This provider can be swapped for a commercial source without
 * changing the rest of the application.
 */

const https = require("https");

// ─── Helpers ────────────────────────────────────────────────────────────────

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 8000 }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error("Invalid JSON response from " + url));
        }
      });
    });
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out: " + url));
    });
  });
}

/** Simple Levenshtein distance for fuzzy matching */
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ─── Normalized Types ────────────────────────────────────────────────────────
/**
 * Medicine: { id, rxcui, genericName, brandName, activeIngredients, strength, dosageForm, source }
 * Interaction: { medicineA, medicineB, severity, mechanism, effects, symptoms, management, evidence, source }
 */

// ─── RxNorm ─────────────────────────────────────────────────────────────────

const RXNORM_BASE = "https://rxnav.nlm.nih.gov/REST";

/** Search RxNorm by name — returns candidate medicines */
async function searchRxNorm(query) {
  try {
    const encoded = encodeURIComponent(query.trim());
    // approximate match allows spelling variants
    const url = `${RXNORM_BASE}/approximateTerm.json?term=${encoded}&maxEntries=10&option=1`;
    const data = await fetchJSON(url);
    const candidates = data?.approximateGroup?.candidate || [];
    return candidates
      .filter((c) => c.rxcui && c.name)
      .map((c) => ({
        rxcui: c.rxcui,
        name: c.name,
        score: parseInt(c.score || "0", 10),
      }));
  } catch {
    return [];
  }
}

/** Get full drug details from RxNorm by RXCUI */
async function getRxNormDetails(rxcui) {
  try {
    const [propsRes, ingrRes] = await Promise.allSettled([
      fetchJSON(`${RXNORM_BASE}/rxcui/${rxcui}/properties.json`),
      fetchJSON(`${RXNORM_BASE}/rxcui/${rxcui}/related.json?tty=IN`),
    ]);

    const props = propsRes.status === "fulfilled"
      ? propsRes.value?.properties
      : null;
    const ingrConcepts = ingrRes.status === "fulfilled"
      ? ingrRes.value?.relatedGroup?.conceptGroup?.find((g) => g.tty === "IN")?.conceptProperties || []
      : [];

    return {
      rxcui,
      genericName: props?.name || "",
      synonym: props?.synonym || "",
      activeIngredients: ingrConcepts.map((c) => c.name).filter(Boolean),
    };
  } catch {
    return { rxcui, genericName: "", synonym: "", activeIngredients: [] };
  }
}

/** Get RxNorm interactions for a list of RXCUIs */
async function getRxNormInteractions(rxcuis) {
  if (!rxcuis || rxcuis.length < 2) return [];
  try {
    const joined = rxcuis.join("+");
    const url = `${RXNORM_BASE}/interaction/list.json?rxcuis=${joined}`;
    const data = await fetchJSON(url);
    const pairs = data?.fullInteractionTypeGroup || [];

    const results = [];
    for (const group of pairs) {
      for (const type of group.fullInteractionType || []) {
        const interactionPairs = type.interactionPair || [];
        for (const pair of interactionPairs) {
          const concepts = pair.interactionConcept || [];
          if (concepts.length < 2) continue;

          const medA = concepts[0]?.minConceptItem?.name || "";
          const medB = concepts[1]?.minConceptItem?.name || "";
          const description = pair.description || "";
          const severity = normalizeSeverity(pair.severity || "");

          results.push({
            medicineA: medA,
            medicineB: medB,
            severity,
            mechanism: description,
            effects: description,
            symptoms: extractSymptoms(description),
            management: extractManagement(description),
            evidence: "RxNorm Interaction API",
            source: "RxNorm (National Library of Medicine)",
            sourceUrl: "https://rxnav.nlm.nih.gov",
          });
        }
      }
    }
    return deduplicateInteractions(results);
  } catch (err) {
    console.error("RxNorm interaction error:", err.message);
    return [];
  }
}

// ─── OpenFDA ─────────────────────────────────────────────────────────────────

const OPENFDA_BASE = "https://api.fda.gov/drug";

/** Search OpenFDA drug labels */
async function searchOpenFDA(query) {
  try {
    const encoded = encodeURIComponent(query.trim());
    const url = `${OPENFDA_BASE}/label.json?search=openfda.generic_name:"${encoded}"+openfda.brand_name:"${encoded}"&limit=5`;
    const data = await fetchJSON(url);
    const results = data?.results || [];
    return results.map((r) => ({
      genericName: (r.openfda?.generic_name?.[0] || "").toLowerCase(),
      brandName: (r.openfda?.brand_name?.[0] || ""),
      manufacturer: r.openfda?.manufacturer_name?.[0] || "",
      warnings: r.warnings?.[0]?.slice(0, 300) || "",
      dosageForm: r.openfda?.dosage_form?.[0] || "",
      route: r.openfda?.route?.[0] || "",
    }));
  } catch {
    return [];
  }
}

// ─── Normalization Utilities ─────────────────────────────────────────────────

const SEVERITY_MAP = {
  "high": "severe",
  "severe": "severe",
  "critical": "critical",
  "moderate": "moderate",
  "medium": "moderate",
  "low": "mild",
  "mild": "mild",
  "minor": "mild",
  "n/a": "unknown",
};

function normalizeSeverity(raw) {
  const lower = (raw || "").toLowerCase().trim();
  return SEVERITY_MAP[lower] || "unknown";
}

function extractSymptoms(description) {
  const matches = description.match(/\b(bleeding|sedation|drowsiness|nausea|vomiting|hypotension|hypertension|arrhythmia|seizure|rash|swelling|dizziness|headache|confusion|tachycardia|bradycardia|liver|kidney|respiratory)\b/gi) || [];
  return [...new Set(matches.map((s) => s.toLowerCase()))];
}

function extractManagement(description) {
  if (!description) return "";
  // Look for known management keywords
  if (/avoid|do not use|contraindicated/i.test(description)) {
    return "Clinical sources suggest avoiding this combination. Consult your doctor or pharmacist before continuing.";
  }
  if (/monitor|watch|observe/i.test(description)) {
    return "Clinical monitoring may be recommended. Discuss with your healthcare professional.";
  }
  if (/adjust.*dose|dose.*adjust|reduce.*dose/i.test(description)) {
    return "Dose adjustment may be considered. Do not adjust doses without medical guidance.";
  }
  return "Consult your doctor or pharmacist for appropriate management of this interaction.";
}

function deduplicateInteractions(interactions) {
  const seen = new Set();
  return interactions.filter((i) => {
    const key = [i.medicineA, i.medicineB].sort().join("__");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Public API: DrugDataProvider ────────────────────────────────────────────

const DrugDataProvider = {
  /**
   * Search medicines by name (supports fuzzy/misspelling).
   * Returns array of normalized Medicine objects.
   */
  async searchMedicine(query) {
    if (!query || query.trim().length < 2) return [];

    const [rxResults, fdaResults] = await Promise.allSettled([
      searchRxNorm(query),
      searchOpenFDA(query),
    ]);

    const rxCandidates = rxResults.status === "fulfilled" ? rxResults.value : [];
    const fdaCandidates = fdaResults.status === "fulfilled" ? fdaResults.value : [];

    // Build normalized medicine list from RxNorm (primary)
    const medicines = rxCandidates.slice(0, 8).map((c) => ({
      rxcui: c.rxcui,
      genericName: c.name,
      brandName: fdaCandidates.find(
        (f) => f.genericName === c.name.toLowerCase()
      )?.brandName || "",
      activeIngredients: [],
      strength: "",
      dosageForm: fdaCandidates.find(
        (f) => f.genericName === c.name.toLowerCase()
      )?.dosageForm || "",
      source: "RxNorm",
      score: c.score,
    }));

    // Sort by relevance score
    medicines.sort((a, b) => b.score - a.score);
    return medicines;
  },

  /**
   * Get full medicine details by RXCUI.
   */
  async getMedicineDetails(rxcui) {
    const details = await getRxNormDetails(rxcui);
    return {
      rxcui,
      genericName: details.genericName,
      brandName: details.synonym,
      activeIngredients: details.activeIngredients,
      source: "RxNorm",
    };
  },

  /**
   * Get interactions for a list of RXCUIs.
   * Returns normalized Interaction array.
   */
  async getInteractions(rxcuis) {
    return getRxNormInteractions(rxcuis);
  },

  /**
   * Check a medicine against a user's allergy list.
   * Returns matches that warrant a warning.
   */
  checkAllergyConflict(medicine, allergies) {
    const conflicts = [];
    const medLower = medicine.genericName?.toLowerCase() || "";
    const ingredients = (medicine.activeIngredients || []).map((i) => i.toLowerCase());

    for (const allergy of allergies) {
      const allergenLower = (allergy.allergen || "").toLowerCase();
      const classLower = (allergy.drugClass || "").toLowerCase();

      if (
        medLower.includes(allergenLower) ||
        allergenLower.includes(medLower) ||
        ingredients.some((i) => i.includes(allergenLower) || allergenLower.includes(i))
      ) {
        conflicts.push({
          allergen: allergy.allergen,
          reaction: allergy.reaction,
          severity: allergy.severity,
          message: `This medicine may contain or be related to "${allergy.allergen}" which you have listed as an allergy.`,
        });
      }
    }
    return conflicts;
  },

  /**
   * Detect duplicate/overlapping therapy in a medicine list.
   * Returns pairs with the same or similar active ingredient.
   */
  detectDuplicateTherapy(medications) {
    const duplicates = [];
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const a = medications[i];
        const b = medications[j];
        const aIngredients = (a.activeIngredients || [a.genericName]).map((x) => x.toLowerCase());
        const bIngredients = (b.activeIngredients || [b.genericName]).map((x) => x.toLowerCase());
        const overlap = aIngredients.filter((x) => bIngredients.some((y) => x === y || levenshtein(x, y) <= 2));
        if (overlap.length > 0) {
          duplicates.push({
            medicineA: a.genericName || a.brandName,
            medicineB: b.genericName || b.brandName,
            sharedIngredients: overlap,
            message: "These medicines may share active ingredients or overlapping effects. Confirm with your healthcare professional whether both are intended.",
          });
        }
      }
    }
    return duplicates;
  },
};

module.exports = { DrugDataProvider };
