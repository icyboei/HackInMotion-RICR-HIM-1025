/**
 * reminderController.js — Medication Reminders CRUD
 */
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const { createReminderDocument } = require("../models/Reminder");

async function getReminders(req, res) {
  try {
    const db = getDB();
    const reminders = await db.collection("reminders")
      .find({ userId: req.user.userId, active: true })
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ reminders, total: reminders.length });
  } catch (err) {
    console.error("Get reminders error:", err);
    res.status(500).json({ message: "Failed to retrieve reminders." });
  }
}

async function addReminder(req, res) {
  try {
    const { medicationId, medicineName, dosage, times, startDate, endDate, notes } = req.body || {};
    if (!medicineName) return res.status(400).json({ message: "Medicine name is required." });
    if (!times || !Array.isArray(times) || times.length === 0) {
      return res.status(400).json({ message: "At least one reminder time is required." });
    }

    const db = getDB();
    const doc = createReminderDocument({
      userId: req.user.userId,
      medicationId,
      medicineName: medicineName.trim(),
      dosage: (dosage || "").trim(),
      times,
      startDate,
      endDate,
      notes: (notes || "").trim(),
    });

    const result = await db.collection("reminders").insertOne(doc);
    res.status(201).json({ message: "Reminder set.", id: result.insertedId, reminder: doc });
  } catch (err) {
    console.error("Add reminder error:", err);
    res.status(500).json({ message: "Failed to add reminder." });
  }
}

async function deleteReminder(req, res) {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid reminder ID." });

    const db = getDB();
    // Soft delete — set active: false
    const result = await db.collection("reminders").updateOne(
      { _id: new ObjectId(id), userId: req.user.userId },
      { $set: { active: false, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return res.status(404).json({ message: "Reminder not found." });
    res.json({ message: "Reminder deleted." });
  } catch (err) {
    console.error("Delete reminder error:", err);
    res.status(500).json({ message: "Failed to delete reminder." });
  }
}

module.exports = { getReminders, addReminder, deleteReminder };
