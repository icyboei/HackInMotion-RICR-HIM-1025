/**
 * OCRScan.js — Factory for OCR prescription scan records
 */
function createOCRScanDocument({ userId, imageUrl, rawText, extractedMedicines, confirmedMedicines }) {
  return {
    userId,
    imageUrl: imageUrl || null,
    rawText: rawText || "",
    extractedMedicines: extractedMedicines || [], // [{ name, confidence, rxcui }]
    confirmedMedicines: confirmedMedicines || [],  // medicines user confirmed
    scannedAt: new Date(),
  };
}

module.exports = { createOCRScanDocument };
