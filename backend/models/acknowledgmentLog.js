const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const AcknowledgmentLog = sequelize.define(
  "AcknowledgmentLog",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    MedicineID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Status: {
      type: DataTypes.ENUM("taken", "missed"),
      allowNull: false,
    },
    Timestamp: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    tableName: "acknowledgmentlogs", // Explicitly define the table name to match your database
    timestamps: false, // Disable Sequelize's automatic timestamp fields (you already define them manually)
  }
);

module.exports = AcknowledgmentLog;
