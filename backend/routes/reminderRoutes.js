const express = require("express");
const { getReminders, addReminder, deleteReminder } = require("../controllers/reminderController");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.use(authenticate);

router.get("/",        getReminders);
router.post("/",       addReminder);
router.delete("/:id",  deleteReminder);

module.exports = router;
