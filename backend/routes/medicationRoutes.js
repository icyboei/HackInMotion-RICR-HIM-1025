const express = require("express");
const { getMedications, addMedication, removeMedication } = require("../controllers/medicationController");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.use(authenticate); // all medication routes require auth

router.get("/",          getMedications);           // GET  /api/medications
router.post("/",         addMedication);             // POST /api/medications
router.delete("/:id",    removeMedication);          // DELETE /api/medications/:id

module.exports = router;
