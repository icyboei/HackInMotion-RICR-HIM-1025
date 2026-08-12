/**
 * Medication.js — Factory for user medication list entries
 */
function createMedicationDocument({ userId, rxcui, genericName, brandName, strength, dosageForm, activeIngredients, source }) {
  return {
    userId,
    rxcui: rxcui || null,
    genericName: genericName || "",
    brandName: brandName || "",
    strength: strength || "",
    dosageForm: dosageForm || "",
    activeIngredients: activeIngredients || [],
    source: source || "user",
    addedAt: new Date(),
    updatedAt: new Date(),
  };
}

module.exports = { createMedicationDocument };
