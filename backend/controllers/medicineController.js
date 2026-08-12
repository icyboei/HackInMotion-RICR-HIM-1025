/**
 * medicineController.js — Medicine Search & Details
 */
const { DrugDataProvider } = require("../services/drugDataProvider");

async function searchMedicines(req, res) {
  try {
    const query = (req.query.q || "").trim();
    if (!query || query.length < 2) {
      return res.status(400).json({ message: "Search query must be at least 2 characters." });
    }

    const results = await DrugDataProvider.searchMedicine(query);
    res.json({ query, results, total: results.length });
  } catch (err) {
    console.error("Medicine search error:", err.message);
    res.status(503).json({ message: "Medicine information service is temporarily unavailable. Please try again." });
  }
}

async function getMedicineDetails(req, res) {
  try {
    const { rxcui } = req.params;
    if (!rxcui) return res.status(400).json({ message: "RXCUI is required." });

    const details = await DrugDataProvider.getMedicineDetails(rxcui);
    res.json(details);
  } catch (err) {
    console.error("Medicine details error:", err.message);
    res.status(503).json({ message: "Medicine information service is temporarily unavailable." });
  }
}

module.exports = { searchMedicines, getMedicineDetails };
