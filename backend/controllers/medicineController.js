const Medicine = require("../models/medicine");
const User = require("../models/user");

// Create a new medicine
const createMedicine = async (req, res) => {
  const { Name, Dosage, ScheduleTime } = req.body;
  const UserID = req.user.userId; // From JWT token

  try {
    const newMedicine = await Medicine.create({
      Name,
      Dosage,
      ScheduleTime,
      UserID,
    });
    res.status(201).json(newMedicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all medicines for a user
const getMedicines = async (req, res) => {
  const UserID = req.user.userId; // From JWT token

  try {
    const medicines = await Medicine.findAll({ where: { UserID } });
    res.status(200).json(medicines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update medicine details
const updateMedicine = async (req, res) => {
  const { MedicineID } = req.params;
  const { Name, Dosage, ScheduleTime } = req.body;
  const UserID = req.user.userId; // From JWT token

  try {
    const medicine = await Medicine.findOne({
      where: { ID: MedicineID, UserID },
    });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    medicine.Name = Name || medicine.Name;
    medicine.Dosage = Dosage || medicine.Dosage;
    medicine.ScheduleTime = ScheduleTime || medicine.ScheduleTime;

    await medicine.save();
    res.status(200).json(medicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete medicine record
const deleteMedicine = async (req, res) => {
  const { MedicineID } = req.params;
  const UserID = req.user.userId; // From JWT token

  try {
    const medicine = await Medicine.findOne({
      where: { ID: MedicineID, UserID },
    });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    await medicine.destroy();
    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
};
