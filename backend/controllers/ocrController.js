/**
 * ocrController.js — OCR Prescription Processing
 */
const { OcrService } = require("../services/ocrService");
const { getDB } = require("../config/db");
const { createOCRScanDocument } = require("../models/OCRScan");

async function extractMedicinesFromText(req, res) {
  try {
    const { rawText } = req.body || {};

    if (!rawText || rawText.trim().length < 5) {
      return res.status(400).json({ message: "OCR text is required. Please scan a prescription first." });
    }
    if (rawText.length > 5000) {
      return res.status(400).json({ message: "Text is too long. Please check your scan." });
    }

    const extractedMedicines = await OcrService.extractMedicines(rawText);

    // Store scan record
    if (req.user) {
      try {
        const db = getDB();
        const doc = createOCRScanDocument({
          userId: req.user.userId,
          rawText,
          extractedMedicines,
          confirmedMedicines: [],
        });
        await db.collection("ocr_scans").insertOne(doc);
      } catch (histErr) {
        console.error("Failed to store OCR scan:", histErr.message);
      }
    }

    res.json({
      extractedMedicines,
      total: extractedMedicines.length,
      message: extractedMedicines.length === 0
        ? "No medicines could be identified from this text. Please verify the scan quality or enter medicines manually."
        : `${extractedMedicines.length} potential medicine(s) identified. Please review and confirm before adding to your list.`,
      disclaimer: "⚠️ OCR results must be confirmed by the user before use. Always verify extracted medicines with your original prescription.",
    });
  } catch (err) {
    console.error("OCR extraction error:", err.message);
    res.status(503).json({
      message: "Could not confidently identify medicines from this image. Please try again or enter medicines manually.",
    });
  }
}

module.exports = { extractMedicinesFromText };
