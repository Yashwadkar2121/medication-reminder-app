const AcknowledgmentLog = require("../models/acknowledgmentLog");
const Medicine = require("../models/medicine");
const User = require("../models/User");

// GET all acknowledgment logs
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await AcknowledgmentLog.findAll({
      include: [
        { model: Medicine, attributes: ["Name"] },
        { model: User, attributes: ["Name"] },
      ],
    });
    res.status(200).json(logs);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error fetching acknowledgment logs",
        error: err.message,
      });
  }
};

// POST a new acknowledgment log
exports.createLog = async (req, res) => {
  const { UserID, MedicineID, Status } = req.body;

  try {
    const log = await AcknowledgmentLog.create({ UserID, MedicineID, Status });
    res.status(201).json(log);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error creating acknowledgment log",
        error: err.message,
      });
  }
};

// UPDATE an acknowledgment log
exports.updateLog = async (req, res) => {
  const { id } = req.params;
  const { Status } = req.body;

  try {
    const log = await AcknowledgmentLog.findByPk(id);

    if (!log) {
      return res.status(404).json({ message: "Acknowledgment log not found" });
    }

    log.Status = Status;
    await log.save();
    res.status(200).json(log);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error updating acknowledgment log",
        error: err.message,
      });
  }
};
