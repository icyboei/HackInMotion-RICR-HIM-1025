const express = require("express");
const { getHistory, deleteHistoryItem } = require("../controllers/historyController");
const { authenticate } = require("../middleware/auth");
const router = express.Router();

router.use(authenticate);

router.get("/",               getHistory);           // GET  /api/history?limit=20&skip=0
router.delete("/:type/:id",   deleteHistoryItem);    // DELETE /api/history/interaction/:id

module.exports = router;
