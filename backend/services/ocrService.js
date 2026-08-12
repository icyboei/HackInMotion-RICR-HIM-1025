/**
 * ocrService.js — OCR Medicine Extraction Service
 *
 * Receives raw OCR text (extracted browser-side via Tesseract.js)
 * and identifies medicine names using RxNorm normalization.
 *
 * Returns extracted medicines with confidence indicators.
 * Users MUST confirm extracted medicines before they are added to their list.
 */

const { DrugDataProvider } = require("./drugDataProvider");

/**
 * Common prescription patterns in text:
 * "Paracetamol 500mg", "Tab. Aspirin 75mg", "Metformin 500 mg OD"
 */
const MED_PATTERNS = [
  // "Tab. MedicineName DosageMg"
  /(?:tab(?:let)?s?|cap(?:sule)?s?|inj(?:ection)?|syrup|drops?|gel|cream|ointment|spray)\.?\s+([A-Za-z][A-Za-z\s-]{2,30})\s+(\d+\s*(?:mg|mcg|ml|g|iu|units?))/gi,
  // "MedicineName DosageMg"
  /\b([A-Z][a-z]{2,20}(?:[\s-][A-Za-z]{2,15})?)\s+(\d+\s*(?:mg|mcg|ml|g|iu|units?))\b/g,
  // Standalone capitalized medicine-like words (min 5 chars)
  /\b([A-Z][a-z]{4,20})\b/g,
];

/** Extract candidate medicine strings from OCR text */
function extractCandidates(text) {
  const candidates = new Map(); // name → { raw, strength }

  for (const pattern of MED_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const name = (match[1] || "").trim();
      const strength = (match[2] || "").trim();
      if (name.length >= 4 && !candidates.has(name.toLowerCase())) {
        candidates.set(name.toLowerCase(), { raw: name, strength });
      }
    }
  }

  return [...candidates.values()];
}

/** Common English words that are NOT medicines */
const NON_MED_WORDS = new Set([
  "patient", "doctor", "hospital", "clinic", "pharmacy", "prescription",
  "before", "after", "meals", "tablets", "capsules", "daily", "twice", "thrice",
  "morning", "evening", "night", "weeks", "month", "days", "refer", "please",
  "address", "signature", "date", "name", "dosage", "instruction", "follow",
]);

const OcrService = {
  /**
   * Extract and normalize medicines from OCR text.
   * @param {string} rawText — raw OCR output
   * @returns {Array} extracted medicines with confidence scores
   */
  async extractMedicines(rawText) {
    if (!rawText || rawText.trim().length < 5) {
      return [];
    }

    const candidates = extractCandidates(rawText);
    const results = [];

    for (const candidate of candidates.slice(0, 20)) { // process max 20 candidates
      const name = candidate.raw;

      // Skip common non-medicine words
      if (NON_MED_WORDS.has(name.toLowerCase())) continue;

      // Attempt RxNorm lookup
      const rxResults = await DrugDataProvider.searchMedicine(name);

      if (rxResults.length > 0) {
        const best = rxResults[0];
        // Score ≥ 80 = high confidence, 50-79 = medium, <50 = low
        const confidence = Math.min(99, Math.max(10, best.score || 50));
        const confidenceLabel =
          confidence >= 80 ? "high" :
          confidence >= 50 ? "medium" : "low";

        results.push({
          raw: name,
          genericName: best.genericName,
          brandName: best.brandName || "",
          rxcui: best.rxcui,
          strength: candidate.strength,
          confidence,
          confidenceLabel,
          confidencePercent: `${confidence}%`,
          confirmed: false, // user must confirm
        });
      }
    }

    // Remove duplicates by RXCUI
    const seen = new Set();
    return results.filter((r) => {
      if (seen.has(r.rxcui)) return false;
      seen.add(r.rxcui);
      return true;
    });
  },
};

module.exports = { OcrService };
