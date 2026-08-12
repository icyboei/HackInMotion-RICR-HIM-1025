/**
 * historyController.js — Interaction & Scan History
 */
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

async function getHistory(req, res) {
  try {
    const db = getDB();
    const limit = Math.min(parseInt(req.query.limit || "20"), 50);
    const skip = parseInt(req.query.skip || "0");

    const [interactions, scans, aiChats] = await Promise.all([
      db.collection("interaction_history")
        .find({ userId: req.user.userId })
        .sort({ checkedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("ocr_scans")
        .find({ userId: req.user.userId })
        .sort({ scannedAt: -1 })
        .limit(5)
        .toArray(),
      db.collection("ai_conversations")
        .find({ userId: req.user.userId })
        .sort({ askedAt: -1 })
        .limit(10)
        .toArray(),
    ]);

    res.json({ interactions, scans, aiChats });
  } catch (err) {
    console.error("Get history error:", err);
    res.status(500).json({ message: "Failed to retrieve history." });
  }
}

async function deleteHistoryItem(req, res) {
  try {
    const { id, type } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID." });

    const collectionMap = {
      interaction: "interaction_history",
      scan: "ocr_scans",
      ai: "ai_conversations",
    };
    const collection = collectionMap[type];
    if (!collection) return res.status(400).json({ message: "Invalid history type." });

    const db = getDB();
    const result = await db.collection(collection).deleteOne({
      _id: new ObjectId(id),
      userId: req.user.userId,
    });

    if (result.deletedCount === 0) return res.status(404).json({ message: "Record not found." });
    res.json({ message: "Record deleted." });
  } catch (err) {
    console.error("Delete history error:", err);
    res.status(500).json({ message: "Failed to delete history record." });
  }
}

module.exports = { getHistory, deleteHistoryItem };
