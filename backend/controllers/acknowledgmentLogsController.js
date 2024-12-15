const AcknowledgmentLogs = require("../models/acknowledgmentLogs");
const Medicine = require("../models/medicine");


// Add acknowledgment log
const addAcknowledgmentLog = async (req, res) => {
  try {
    const { status } = req.body;
    const { medicineID } = req.params; // Medicine ID passed in URL params
    const UserID = req.user.userId; // Extracted from JWT token middleware

    // Ensure the medicine belongs to the user
    const medicine = await Medicine.findOne({
      where: { ID: medicineID, UserID },
    });

    if (!medicine) {
      return res
        .status(404)
        .json({ message: "Medicine not found for the user." });
    }

    // Create acknowledgment log
    const acknowledgmentLog = await AcknowledgmentLogs.create({
      UserID,
      MedicineID: medicineID,
      Status: status,
    });

    res.status(201).json({
      message: "Acknowledgment log added successfully.",
      acknowledgmentLog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

// View acknowledgment logs
const viewAcknowledgmentLogs = async (req, res) => {
  try {
    const UserID = req.user.userId; // Extracted from JWT token middleware

    // Fetch acknowledgment logs for the user
    const acknowledgmentLogs = await AcknowledgmentLogs.findAll({
      where: { UserID },
      include: [
        {
          model: Medicine,
          attributes: ["Name", "Dosage", "ScheduleTime"],
        },
      ],
    });

    res.status(200).json({ acknowledgmentLogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

module.exports = {
  addAcknowledgmentLog,
  viewAcknowledgmentLogs,
};
