const express = require("express");
const router = express.Router();
const {
  addAcknowledgmentLog,
  viewAcknowledgmentLogs,
} = require("../controllers/acknowledgmentLogsController");
const authMiddleware = require("../middleware/authMiddleware"); // Middleware for JWT authentication

// Route to add acknowledgment log
router.post("/:medicineID", authMiddleware, addAcknowledgmentLog);

// Route to view acknowledgment logs
router.get("/", authMiddleware, viewAcknowledgmentLogs);

module.exports = router;
