const express = require("express");
const {
  getAllLogs,
  createLog,
  updateLog,
} = require("../controllers/acknowledgmentLogController");

const router = express.Router();

// GET all acknowledgment logs
router.get("/", getAllLogs);

// POST a new acknowledgment log
router.post("/", createLog);

// UPDATE an acknowledgment log
router.put("/:id", updateLog);

module.exports = router;
