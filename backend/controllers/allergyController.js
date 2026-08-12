/**
 * allergyController.js — User Allergy Profile CRUD
 */
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { createAllergyDocument } = require("../models/Allergy");

async function getAllergies(req, res) {
  try {
    const db = getDB();
    const allergies = await db.collection("allergies")
      .find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ allergies, total: allergies.length });
  } catch (err) {
    console.error("Get allergies error:", err);
    res.status(500).json({ message: "Failed to retrieve allergy profile." });
  }
}

async function addAllergy(req, res) {
  try {
    const { allergen, drugClass, reaction, severity } = req.body || {};
    if (!allergen) return res.status(400).json({ message: "Allergen name is required." });

    const db = getDB();
    const doc = createAllergyDocument({
      userId: req.user.userId,
      allergen: allergen.trim(),
      drugClass: (drugClass || "").trim(),
      reaction: (reaction || "").trim(),
      severity: severity || "unknown",
    });

    const result = await db.collection("allergies").insertOne(doc);
    res.status(201).json({ message: "Allergy added.", id: result.insertedId, allergy: doc });
  } catch (err) {
    console.error("Add allergy error:", err);
    res.status(500).json({ message: "Failed to add allergy." });
  }
}

async function removeAllergy(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid allergy ID." });

    const db = getDB();
    const result = await db.collection("allergies").deleteOne({
      _id: new ObjectId(id),
      userId: req.user.userId,
    });

    if (result.deletedCount === 0) return res.status(404).json({ message: "Allergy not found." });
    res.json({ message: "Allergy removed." });
  } catch (err) {
    console.error("Remove allergy error:", err);
    res.status(500).json({ message: "Failed to remove allergy." });
  }
}

module.exports = { getAllergies, addAllergy, removeAllergy };
