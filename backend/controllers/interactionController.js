/**
 * interactionController.js — Drug Interaction Checker
 */
const { DrugInteractionService } = require("../services/drugInteractionService");
const { CrossCheckService } = require("../services/crossCheckService");
const { DrugDataProvider } = require("../services/drugDataProvider");
const { getDB } = require("../config/db");
const { createInteractionHistoryDocument } = require("../models/InteractionHistory");

async function checkInteractions(req, res) {
  try {
    const { medicines } = req.body || {};

    if (!medicines || !Array.isArray(medicines) || medicines.length < 2) {
      return res.status(400).json({ message: "Provide at least 2 medicines to check interactions." });
    }
    if (medicines.length > 10) {
      return res.status(400).json({ message: "Maximum 10 medicines can be checked at once." });
    }

    // Validate each medicine has at minimum a rxcui or genericName
    const validMedicines = medicines.filter((m) => m.rxcui || m.genericName);
    if (validMedicines.length < 2) {
      return res.status(400).json({ message: "Each medicine must have a valid rxcui or name." });
    }

    // Check user allergies if logged in
    let allergyWarnings = [];
    if (req.user) {
      const db = getDB();
      const allergies = await db.collection("allergies")
        .find({ userId: req.user.userId })
        .toArray();

      for (const med of validMedicines) {
        const conflicts = DrugDataProvider.checkAllergyConflict(med, allergies);
        allergyWarnings = allergyWarnings.concat(
          conflicts.map((c) => ({ medicine: med.genericName || med.brandName, ...c }))
        );
      }
    }

    // Run interaction check
    const interactionResult = await DrugInteractionService.checkAll(validMedicines);

    // Run cross-check
    const crossCheckResult = await CrossCheckService.verify(interactionResult.interactions);

    // Store history if user is logged in
    if (req.user) {
      try {
        const db = getDB();
        const histDoc = createInteractionHistoryDocument({
          userId: req.user.userId,
          medicines: validMedicines.map((m) => ({
            rxcui: m.rxcui,
            genericName: m.genericName,
            brandName: m.brandName,
          })),
          interactions: interactionResult.interactions,
          overallSeverity: interactionResult.overallSeverity,
          crossCheckResult,
        });
        await db.collection("interaction_history").insertOne(histDoc);
      } catch (histErr) {
        console.error("Failed to store interaction history:", histErr.message);
        // Non-fatal — continue
      }
    }

    res.json({
      ...interactionResult,
      allergyWarnings,
      crossCheck: crossCheckResult,
      disclaimer: "This interaction check is for informational purposes only and does not replace advice from your doctor or pharmacist.",
      checkedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Interaction check error:", err.message);
    res.status(503).json({ message: "Drug interaction service is temporarily unavailable. Please try again." });
  }
}

module.exports = { checkInteractions };
