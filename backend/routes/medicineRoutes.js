const express = require("express");
const router = express.Router();
const {
  createMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
} = require("../controllers/medicineController");
const authMiddleware = require("../middleware/authMiddleware");

// Create a new medicine
router.post("/", authMiddleware, createMedicine);

// Get all medicines for a user
router.get("/", authMiddleware, getMedicines);

// Update medicine details
router.put("/:MedicineID", authMiddleware, updateMedicine);

// Delete medicine record
router.delete("/:MedicineID", authMiddleware, deleteMedicine);

module.exports = router;
