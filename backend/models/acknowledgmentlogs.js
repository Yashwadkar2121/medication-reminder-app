const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user"); // Import User model for foreign key reference
const Medicine = require("./medicine"); // Import Medicine model for foreign key reference

const AcknowledgmentLogs = sequelize.define(
  "AcknowledgmentLogs",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    UserID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "ID",
      },
      onDelete: "CASCADE",
    },
    MedicineID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Medicine,
        key: "ID",
      },
      onDelete: "CASCADE",
    },
    Status: {
      type: DataTypes.ENUM("Taken", "Missed"),
      allowNull: false,
    },
    Timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "AcknowledgmentLogs", // Explicitly define the table name to match your database
    timestamps: false, // Disable Sequelize's automatic timestamp fields
  }
);

// Define associations (optional but good for Sequelize relationship handling)
AcknowledgmentLogs.belongsTo(User, { foreignKey: "UserID" });
AcknowledgmentLogs.belongsTo(Medicine, { foreignKey: "MedicineID" });

module.exports = AcknowledgmentLogs;
