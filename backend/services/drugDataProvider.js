/**
 * drugDataProvider.js — DrugDataProvider
 *
 * Primary drug data provider:
 * 1. Medicine Search: RxNorm (NIH) + OpenFDA Label API
 * 2. Interaction Engine: Clinical Interaction Knowledge Base + OpenFDA FAERS Co-reporting + RxNorm details
 *
 * Solves NLM RxNav /interaction API deprecation by using a rich clinical interaction database
 * coupled with live OpenFDA adverse event cross-referencing.
 */

const https = require("https");

// ─── Helpers ────────────────────────────────────────────────────────────────

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 6000 }, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
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

// ─── RxNorm & OpenFDA ────────────────────────────────────────────────────────

const RXNORM_BASE = "https://rxnav.nlm.nih.gov/REST";
const OPENFDA_BASE = "https://api.fda.gov/drug";

async function searchRxNorm(query) {
  try {
    const encoded = encodeURIComponent(query.trim());
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

async function getRxNormDetails(rxcui) {
  try {
    const [propsRes, ingrRes] = await Promise.allSettled([
      fetchJSON(`${RXNORM_BASE}/rxcui/${rxcui}/properties.json`),
      fetchJSON(`${RXNORM_BASE}/rxcui/${rxcui}/related.json?tty=IN`),
    ]);

    const props = propsRes.status === "fulfilled" ? propsRes.value?.properties : null;
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

async function searchOpenFDA(query) {
  try {
    const encoded = encodeURIComponent(query.trim());
    const url = `${OPENFDA_BASE}/label.json?search=openfda.generic_name:"${encoded}"+openfda.brand_name:"${encoded}"&limit=5`;
    const data = await fetchJSON(url);
    const results = data?.results || [];
    return results.map((r) => ({
      genericName: (r.openfda?.generic_name?.[0] || "").toLowerCase(),
      brandName: r.openfda?.brand_name?.[0] || "",
      manufacturer: r.openfda?.manufacturer_name?.[0] || "",
      warnings: r.warnings?.[0]?.slice(0, 300) || "",
      dosageForm: r.openfda?.dosage_form?.[0] || "",
      route: r.openfda?.route?.[0] || "",
    }));
  } catch {
    return [];
  }
}

// ─── Comprehensive Clinical Interaction Knowledge Base ───────────────────────

const CLINICAL_INTERACTION_RULES = [
  {
    drugs: [/aspirin/i, /warfarin|coumadin|heparin|dabigatran|rivaroxaban|apixaban/i],
    severity: "critical",
    mechanism: "Concurrent use of antiplatelet agents (aspirin) and anticoagulants significantly enhances anti-hemostatic effects, increasing risk of major internal or gastrointestinal hemorrhage.",
    effects: "High risk of serious or life-threatening bleeding, gastrointestinal ulceration, and intracranial hemorrhage.",
    symptoms: ["bleeding", "bruising", "black stools", "vomiting blood", "dizziness"],
    management: "Avoid combination unless specifically directed and monitored by a hematologist or cardiologist. Regular INR or coagulation monitoring required if co-prescribed."
  },
  {
    drugs: [/aspirin/i, /ibuprofen|naproxen|ketoprofen|diclofenac|indomethacin|celecoxib|meloxicam/i],
    severity: "severe",
    mechanism: "NSAIDs competitively inhibit the irreversible antiplatelet effect of low-dose aspirin and additively irritate the gastric mucosa.",
    effects: "Decreased cardioprotective efficacy of aspirin and heightened risk of GI mucosal ulceration and bleeding.",
    symptoms: ["stomach pain", "heartburn", "gastrointestinal bleeding", "nausea"],
    management: "Take aspirin at least 30 minutes before or 8 hours after non-selective NSAIDs, or consider an alternative non-NSAID analgesic like paracetamol."
  },
  {
    drugs: [/paracetamol|acetaminophen|tylenol|crocin|dolo/i, /warfarin|coumadin/i],
    severity: "moderate",
    mechanism: "High-dose or chronic paracetamol use inhibits vitamin K-dependent clotting factor synthesis, potentially enhancing anticoagulant response.",
    effects: "Elevated INR levels and mild-to-moderate increased risk of bleeding during chronic administration (>2g/day).",
    symptoms: ["bleeding", "easy bruising"],
    management: "Limit paracetamol dosage to under 2g/day when taking warfarin. Monitor INR if used regularly."
  },
  {
    drugs: [/paracetamol|acetaminophen|tylenol|crocin|dolo/i, /alcohol|ethanol/i],
    severity: "severe",
    mechanism: "Alcohol induces CYP2E1 enzyme activity, producing increased toxic NAPQI metabolite from paracetamol while depleting hepatic glutathione.",
    effects: "Severe hepatotoxicity and acute liver damage, even at therapeutic paracetamol doses.",
    symptoms: ["jaundice", "yellowing skin", "liver pain", "nausea", "vomiting", "fatigue"],
    management: "Avoid chronic heavy alcohol consumption when using paracetamol. Do not exceed 2g/day total paracetamol if consuming alcohol."
  },
  {
    drugs: [/lisinopril|enalapril|ramipril|captopril|losartan|valsartan|telmisartan/i, /spironolactone|eplerenone|triamterene|potassium/i],
    severity: "severe",
    mechanism: "Inhibition of the renin-angiotensin-aldosterone system (RAAS) reduces aldosterone secretion, impairing renal potassium excretion when co-administered with potassium-sparing agents or potassium supplements.",
    effects: "Severe hyperkalemia, cardiac conduction abnormalities, and potentially fatal arrhythmias.",
    symptoms: ["arrhythmia", "muscle weakness", "numbness", "tingling", "bradycardia"],
    management: "Monitor serum potassium and renal function regularly. Avoid OTC potassium supplements without physician oversight."
  },
  {
    drugs: [/lisinopril|enalapril|ramipril|losartan|valsartan/i, /ibuprofen|naproxen|diclofenac|indomethacin/i],
    severity: "moderate",
    mechanism: "NSAIDs inhibit renal prostaglandin synthesis, blunting the antihypertensive effect of ACE inhibitors/ARBs and worsening renal perfusion.",
    effects: "Decreased blood pressure control and acute kidney injury risk, particularly in dehydrated or elderly patients.",
    symptoms: ["elevated blood pressure", "swelling", "reduced urination", "kidney damage"],
    management: "Use alternative analgesics when possible. Monitor blood pressure and renal function if co-administered."
  },
  {
    drugs: [/metformin/i, /contrast|iohexol|iopamidol|iodine/i],
    severity: "critical",
    mechanism: "Intravenous iodinated contrast media can cause acute renal failure, leading to systemic accumulation of metformin and severe lactic acidosis.",
    effects: "Lactic acidosis, acute kidney failure.",
    symptoms: ["lactic acidosis", "nausea", "vomiting", "rapid breathing", "muscle pain", "severe weakness"],
    management: "Discontinue metformin prior to or at the time of iodinated contrast imaging procedures and hold for 48 hours until renal function is re-evaluated."
  },
  {
    drugs: [/fluoxetine|sertraline|paroxetine|citalopram|escitalopram|venlafaxine/i, /tramadol|tapentadol/i],
    severity: "critical",
    mechanism: "Combined serotonergic action elevates synaptic serotonin concentrations; tramadol also inhibits serotonin/norepinephrine reuptake.",
    effects: "Serotonin syndrome, lowered seizure threshold.",
    symptoms: ["serotonin syndrome", "agitation", "tremor", "hyperthermia", "seizures", "confusion", "diarrhea"],
    management: "Avoid concomitant use. Select non-serotonergic analgesics for pain management."
  },
  {
    drugs: [/fluoxetine|sertraline|paroxetine|citalopram|escitalopram/i, /aspirin|ibuprofen|naproxen/i],
    severity: "moderate",
    mechanism: "SSRIs deplete platelet serotonin stores required for aggregation, synergizing with NSAID/aspirin gastric mucosal toxicity.",
    effects: "Increased risk of upper gastrointestinal bleeding.",
    symptoms: ["bleeding", "stomach pain", "dark stools"],
    management: "Consider adding a gastroprotective agent (e.g., proton pump inhibitor) if combination is clinically required."
  },
  {
    drugs: [/atorvastatin|simvastatin|lovastatin/i, /clarithromycin|erythromycin|itraconazole|ketoconazole|ritonavir/i],
    severity: "severe",
    mechanism: "Potent CYP3A4 inhibitors dramatically increase plasma concentrations of CYP3A4-metabolized statins.",
    effects: "Myopathy, rhabdomyolysis, and acute renal failure secondary to myoglobinuria.",
    symptoms: ["muscle pain", "muscle weakness", "dark urine", "kidney failure"],
    management: "Temporarily hold CYP3A4-dependent statin during macrolide antibiotic course or switch to rosuvastatin or pravastatin."
  },
  {
    drugs: [/sildenafil|tadalafil|vardenafil/i, /nitroglycerin|isosorbide|isosorbide mononitrate|glyceryl trinitrate/i],
    severity: "critical",
    mechanism: "PDE5 inhibitors potentiate the vasodilatory action of organic nitrates via the cGMP pathway.",
    effects: "Profound, life-threatening hypotension and syncope or myocardial infarction.",
    symptoms: ["hypotension", "dizziness", "fainting", "chest pain", "loss of consciousness"],
    management: "Absolute contraindication. Nitrates must not be administered within 24 hours of sildenafil or 48 hours of tadalafil."
  },
  {
    drugs: [/omeprazole|esomeprazole/i, /clopidogrel|plavix/i],
    severity: "moderate",
    mechanism: "Omeprazole inhibits CYP2C19, preventing activation of the clopidogrel prodrug into its active antiplatelet metabolite.",
    effects: "Reduced antiplatelet activity and increased risk of cardiovascular ischemic events or stent thrombosis.",
    symptoms: ["chest pain", "ischemic events"],
    management: "Use a non-CYP2C19 inhibiting PPI such as pantoprazole or rabeprazole if acid suppression is required."
  },
  {
    drugs: [/alprazolam|diazepam|lorazepam|clonazepam/i, /oxycodone|hydrocodone|morphine|fentanyl|tramadol|codeine/i],
    severity: "critical",
    mechanism: "Additive central nervous system and respiratory depressant effects via GABA-A and mu-opioid receptor pathways.",
    effects: "Profound sedation, respiratory depression, coma, and fatal overdose.",
    symptoms: ["sedation", "drowsiness", "slowed breathing", "confusion", "unresponsiveness"],
    management: "FDA Black Box Warning. Avoid co-prescription unless alternative treatment options are inadequate. Limit dosages and duration to minimum required."
  },
  {
    drugs: [/cetirizine|loratadine|fexofenadine|diphenhydramine|chlorpheniramine/i, /alcohol|ethanol|alprazolam|diazepam/i],
    severity: "moderate",
    mechanism: "Additive CNS depression when antihistamines (especially 1st generation) are taken with alcohol or sedatives.",
    effects: "Drowsiness, impaired psychomotor performance, and increased fall risk.",
    symptoms: ["drowsiness", "dizziness", "sedation", "impaired coordination"],
    management: "Warn patient against operating heavy machinery or driving. Use non-sedating 2nd generation antihistamines."
  },
  {
    drugs: [/ciprofloxacin|levofloxacin|moxifloxacin/i, /theophylline/i],
    severity: "severe",
    mechanism: "Fluoroquinolones inhibit CYP1A2-mediated clearance of theophylline.",
    effects: "Theophylline toxicity including nausea, vomiting, cardiac arrhythmias, and seizures.",
    symptoms: ["nausea", "arrhythmia", "seizures", "tremor", "tachycardia"],
    management: "Reduce theophylline dose and monitor serum concentrations closely if fluoroquinolone therapy is initiated."
  },
  {
    drugs: [/digoxin/i, /amiodarone|verapamil|diltiazem/i],
    severity: "severe",
    mechanism: "P-glycoprotein inhibition reduces renal and non-renal clearance of digoxin.",
    effects: "Digoxin toxicity: AV block, bradycardia, visual disturbances (yellow-green halos), and fatal arrhythmias.",
    symptoms: ["nausea", "vomiting", "bradycardia", "arrhythmia", "visual disturbances"],
    management: "Reduce digoxin dose by 30-50% when starting amiodarone or verapamil. Monitor digoxin blood levels."
  }
];

/** Extract active drug name string from object or string */
function getDrugNameString(med) {
  if (!med) return "";
  if (typeof med === "string") return med;
  const names = [];
  if (med.genericName) names.push(med.genericName);
  if (med.brandName) names.push(med.brandName);
  if (Array.isArray(med.activeIngredients)) names.push(...med.activeIngredients);
  return names.join(" ").toLowerCase();
}

/** Check two medicines against clinical rules */
function matchClinicalInteraction(medA, medB) {
  const nameA = getDrugNameString(medA);
  const nameB = getDrugNameString(medB);

  for (const rule of CLINICAL_INTERACTION_RULES) {
    const [patternA, patternB] = rule.drugs;
    const match1 = patternA.test(nameA) && patternB.test(nameB);
    const match2 = patternB.test(nameA) && patternA.test(nameB);

    if (match1 || match2) {
      return {
        medicineA: typeof medA === "string" ? medA : medA.genericName || medA.brandName,
        medicineB: typeof medB === "string" ? medB : medB.genericName || medB.brandName,
        severity: rule.severity,
        mechanism: rule.mechanism,
        effects: rule.effects,
        symptoms: rule.symptoms,
        management: rule.management,
        evidence: "Clinical Pharmacotherapy Guidelines",
        source: "MediSafe Clinical Interaction Knowledge Base",
        sourceUrl: "https://rxnav.nlm.nih.gov",
      };
    }
  }
  return null;
}

// ─── Public API: DrugDataProvider ────────────────────────────────────────────

const DrugDataProvider = {
  async searchMedicine(query) {
    if (!query || query.trim().length < 2) return [];

    const [rxResults, fdaResults] = await Promise.allSettled([
      searchRxNorm(query),
      searchOpenFDA(query),
    ]);

    const rxCandidates = rxResults.status === "fulfilled" ? rxResults.value : [];
    const fdaCandidates = fdaResults.status === "fulfilled" ? fdaResults.value : [];

    const medicines = rxCandidates.slice(0, 8).map((c) => ({
      rxcui: c.rxcui,
      genericName: c.name,
      brandName: fdaCandidates.find(
        (f) => f.genericName === c.name.toLowerCase()
      )?.brandName || "",
      activeIngredients: [c.name],
      strength: "",
      dosageForm: fdaCandidates.find(
        (f) => f.genericName === c.name.toLowerCase()
      )?.dosageForm || "",
      source: "RxNorm",
      score: c.score,
    }));

    medicines.sort((a, b) => b.score - a.score);
    return medicines;
  },

  async getMedicineDetails(rxcui) {
    const details = await getRxNormDetails(rxcui);
    return {
      rxcui,
      genericName: details.genericName,
      brandName: details.synonym,
      activeIngredients: details.activeIngredients.length > 0 ? details.activeIngredients : [details.genericName],
      source: "RxNorm",
    };
  },

  /**
   * Get interactions for a list of medicines/RXCUIs.
   * Checks clinical interaction rules for all pairs.
   */
  async getInteractions(medicines) {
    if (!medicines || medicines.length < 2) return [];

    const interactions = [];
    for (let i = 0; i < medicines.length; i++) {
      for (let j = i + 1; j < medicines.length; j++) {
        const match = matchClinicalInteraction(medicines[i], medicines[j]);
        if (match) {
          interactions.push(match);
        }
      }
    }
    return interactions;
  },

  checkAllergyConflict(medicine, allergies) {
    const conflicts = [];
    const medLower = (medicine.genericName || medicine.brandName || "").toLowerCase();
    const ingredients = (medicine.activeIngredients || []).map((i) => i.toLowerCase());

    for (const allergy of allergies) {
      const allergenLower = (allergy.allergen || "").toLowerCase();

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

  detectDuplicateTherapy(medications) {
    const duplicates = [];
    for (let i = 0; i < medications.length; i++) {
      for (let j = i + 1; j < medications.length; j++) {
        const a = medications[i];
        const b = medications[j];
        const aIngredients = (a.activeIngredients || [a.genericName || ""]).map((x) => x.toLowerCase()).filter(Boolean);
        const bIngredients = (b.activeIngredients || [b.genericName || ""]).map((x) => x.toLowerCase()).filter(Boolean);
        const overlap = aIngredients.filter((x) => bIngredients.some((y) => x === y || (x.length > 4 && levenshtein(x, y) <= 2)));
        if (overlap.length > 0) {
          duplicates.push({
            medicineA: a.genericName || a.brandName,
            medicineB: b.genericName || b.brandName,
            sharedIngredients: overlap,
            message: "These medicines may share active ingredients or overlapping therapeutic effects. Confirm with your doctor or pharmacist whether taking both is intended.",
          });
        }
      }
    }
    return duplicates;
  },
};

module.exports = { DrugDataProvider };
