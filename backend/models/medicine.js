const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user"); // Import User model for foreign key reference

const Medicine = sequelize.define(
  "Medicine",
  {
    ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    Dosage: {
      type: DataTypes.STRING(50),
    },
    ScheduleTime: {
      type: DataTypes.TIME,
      allowNull: false,
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
    CreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    UpdatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Medicine", // Explicitly define the table name to match your database
    timestamps: false, // Disable Sequelize's automatic timestamp fields (you already define them manually)
  }
);

module.exports = Medicine;
