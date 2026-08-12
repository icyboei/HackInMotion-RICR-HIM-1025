const express = require("express");
const { searchMedicines, getMedicineDetails } = require("../controllers/medicineController");
const router = express.Router();

router.get("/search", searchMedicines);           // GET /api/medicines/search?q=aspirin
router.get("/:rxcui", getMedicineDetails);         // GET /api/medicines/1191

module.exports = router;
