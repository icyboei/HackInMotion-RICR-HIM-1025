/**
 * Allergy.js — Factory for user allergy profile entries
 */
function createAllergyDocument({ userId, allergen, drugClass, reaction, severity }) {
  return {
    userId,
    allergen: allergen || "",       // e.g. "penicillin"
    drugClass: drugClass || "",     // e.g. "beta-lactam antibiotics"
    reaction: reaction || "",       // e.g. "anaphylaxis"
    severity: severity || "unknown", // mild | moderate | severe | unknown
    createdAt: new Date(),
  };
}

module.exports = { createAllergyDocument };
