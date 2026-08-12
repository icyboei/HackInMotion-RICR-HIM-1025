/**
 * aiController.js — AI Assistant Endpoint
 */
const { AIService } = require("../services/aiService");
const { getDB } = require("../config/db");
const { createAIConversationDocument } = require("../models/AIConversation");

async function askQuestion(req, res) {
  try {
    const { question } = req.body || {};
    if (!question || question.trim().length < 3) {
      return res.status(400).json({ message: "Please provide a question." });
    }
    if (question.length > 500) {
      return res.status(400).json({ message: "Question is too long. Maximum 500 characters." });
    }

    const result = await AIService.answer(question, req.user.userId);

    // Store conversation history
    try {
      const db = getDB();
      const doc = createAIConversationDocument({
        userId: req.user.userId,
        question,
        answer: result.answer,
        medicinesDetected: result.medicinesDetected,
        dataSourced: result.dataSourced,
      });
      await db.collection("ai_conversations").insertOne(doc);
    } catch (histErr) {
      console.error("Failed to store AI conversation:", histErr.message);
    }

    res.json({
      question,
      answer: result.answer,
      medicinesDetected: result.medicinesDetected,
      dataSourced: result.dataSourced,
      safetyPassed: result.safetyPassed,
      disclaimer: "⚠️ This is for educational purposes only. Consult your doctor or pharmacist before making any changes to your medication.",
    });
  } catch (err) {
    console.error("AI assistant error:", err.message);
    res.status(503).json({
      message: "AI assistant is temporarily unavailable.",
      fallback: "For medicine information, please consult your pharmacist or visit MedlinePlus (medlineplus.gov).",
    });
  }
}

module.exports = { askQuestion };
