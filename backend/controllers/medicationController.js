/**
 * medicationController.js — User Medication List CRUD
 */
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { createMedicationDocument } = require("../models/Medication");

async function getMedications(req, res) {
  try {
    const db = getDB();
    const meds = await db.collection("medications")
      .find({ userId: req.user.userId })
      .sort({ addedAt: -1 })
      .toArray();
    res.json({ medications: meds, total: meds.length });
  } catch (err) {
    console.error("Get medications error:", err);
    res.status(500).json({ message: "Failed to retrieve medications." });
  }
}

async function addMedication(req, res) {
  try {
    const { rxcui, genericName, brandName, strength, dosageForm, activeIngredients, source } = req.body || {};

    if (!rxcui && !genericName) {
      return res.status(400).json({ message: "Medicine must have a name or RXCUI." });
    }

    const db = getDB();
    // Check for duplicates
    const existing = await db.collection("medications").findOne({
      userId: req.user.userId,
      $or: [
        { rxcui: rxcui || null },
        { genericName: (genericName || "").toLowerCase() },
      ],
    });

    if (existing) {
      return res.status(409).json({ message: `${genericName || rxcui} is already in your medication list.` });
    }

    const doc = createMedicationDocument({
      userId: req.user.userId,
      rxcui,
      genericName: (genericName || "").toLowerCase(),
      brandName,
      strength,
      dosageForm,
      activeIngredients,
      source,
    });

    const result = await db.collection("medications").insertOne(doc);
    res.status(201).json({ message: "Medication added.", id: result.insertedId, medication: doc });
  } catch (err) {
    console.error("Add medication error:", err);
    res.status(500).json({ message: "Failed to add medication." });
  }
}

async function removeMedication(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid medication ID." });
    }

    const db = getDB();
    const result = await db.collection("medications").deleteOne({
      _id: new ObjectId(id),
      userId: req.user.userId, // ensures user can only delete their own
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Medication not found." });
    }

    res.json({ message: "Medication removed." });
  } catch (err) {
    console.error("Remove medication error:", err);
    res.status(500).json({ message: "Failed to remove medication." });
  }
}

module.exports = { getMedications, addMedication, removeMedication };
