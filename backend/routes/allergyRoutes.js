const express = require("express");
const { getAllergies, addAllergy, removeAllergy } = require("../controllers/allergyController");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.use(authenticate);

router.get("/",        getAllergies);
router.post("/",       addAllergy);
router.delete("/:id",  removeAllergy);

module.exports = router;
