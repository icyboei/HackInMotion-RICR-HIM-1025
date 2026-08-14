/**
 * drugInteractionService.js — DrugInteractionService
 *
 * Evaluates ALL pairs of medicines in a user's list.
 * Uses DrugDataProvider as the data source.
 * Returns per-pair interaction results + overall severity summary.
 */

const { DrugDataProvider } = require("./drugDataProvider");

// Severity ordering for determining "overall" worst case
const SEVERITY_ORDER = ["unknown", "none", "mild", "moderate", "severe", "critical"];

function maxSeverity(a, b) {
  const ai = SEVERITY_ORDER.indexOf(a);
  const bi = SEVERITY_ORDER.indexOf(b);
  return ai >= bi ? a : b;
}

function overallSummaryLabel(severity) {
  switch (severity) {
    case "critical": return "Critical";
    case "severe":   return "Severe";
    case "moderate": return "Moderate";
    case "mild":     return "Mild";
    case "none":     return "No known interaction identified";
    default:         return "Insufficient data";
  }
}

/**
 * Generate all unique pairs from a list of medicines.
 * e.g. [A, B, C] → [[A,B], [A,C], [B,C]]
 */
function generatePairs(medicines) {
  const pairs = [];
  for (let i = 0; i < medicines.length; i++) {
    for (let j = i + 1; j < medicines.length; j++) {
      pairs.push([medicines[i], medicines[j]]);
    }
  }
  return pairs;
}

/**
 * Identify overlapping pharmacological effects across the full medication list.
 * ONLY flags effects that are described in the interaction data.
 */
function detectOverlappingEffects(interactions) {
  const effectCategories = {
    sedation: /sedation|drowsiness|cns depression|sedative/i,
    bleeding: /bleeding|anticoagulant|platelet|hemorrhage/i,
    hypotension: /hypotension|blood pressure.*low|drop.*pressure/i,
    hypertension: /hypertension|blood pressure.*high|elevat.*pressure/i,
    cardiac: /arrhythmia|qt.*prolong|tachycardia|bradycardia|cardiac/i,
    gastrointestinal: /nausea|vomiting|gi bleed|stomach|gastrointestinal/i,
    renal: /kidney|renal|nephrotoxic/i,
    hepatic: /liver|hepatic|hepatotoxic/i,
  };

  const overlaps = {};
  for (const interaction of interactions) {
    const text = (interaction.mechanism || "") + " " + (interaction.effects || "");
    for (const [category, pattern] of Object.entries(effectCategories)) {
      if (pattern.test(text)) {
        if (!overlaps[category]) overlaps[category] = [];
        overlaps[category].push(`${interaction.medicineA} + ${interaction.medicineB}`);
      }
    }
  }

  return Object.entries(overlaps).map(([category, pairs]) => ({
    category,
    pairs,
    message: `Overlapping ${category} effects noted in: ${pairs.join("; ")}.`,
    disclaimer: "These overlapping effects are based on available interaction data. Consult your doctor or pharmacist.",
  }));
}

const DrugInteractionService = {
  /**
   * Check all pairs in a medicine list.
   * @param {Array} medicines — each must have { rxcui, genericName, brandName }
   * @returns { interactions, overallSeverity, overallSummary, pairs, overlappingEffects, duplicates }
   */
  async checkAll(medicines) {
    if (!medicines || medicines.length < 2) {
      return {
        interactions: [],
        overallSeverity: "none",
        overallSummary: "No known interaction identified from the available data.",
        pairs: [],
        overlappingEffects: [],
        duplicates: [],
      };
    }

    // Fetch interactions across all medicine pairs
    const allInteractions = medicines.length >= 2
      ? await DrugDataProvider.getInteractions(medicines)
      : [];

    // Annotate interactions with full medicine names where possible
    const annotated = allInteractions.map((ix) => ({
      ...ix,
      checkedAt: new Date().toISOString(),
    }));

    // Calculate overall severity
    let worstSeverity = annotated.length === 0 ? "none" : "unknown";
    for (const ix of annotated) {
      worstSeverity = maxSeverity(worstSeverity, ix.severity);
    }

    // Detect duplicate therapy
    const duplicates = DrugDataProvider.detectDuplicateTherapy(medicines);

    // Detect overlapping effects
    const overlappingEffects = detectOverlappingEffects(annotated);

    return {
      interactions: annotated,
      overallSeverity: worstSeverity,
      overallSummary: overallSummaryLabel(worstSeverity),
      noKnownInteraction: worstSeverity === "none"
        ? "No known interaction was identified from the available data. This does not guarantee the combination is safe — always consult your pharmacist or doctor."
        : null,
      pairs: generatePairs(medicines).map(([a, b]) => ({
        medicineA: a.genericName || a.brandName,
        medicineB: b.genericName || b.brandName,
      })),
      overlappingEffects,
      duplicates,
    };
  },
};

module.exports = { DrugInteractionService };
