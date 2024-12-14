const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
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
    Email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    PasswordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
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
    tableName: "Users", // Explicitly define the table name to match your database
    timestamps: false, // Disable Sequelize's automatic timestamp fields (you already define them manually)
  }
);

module.exports = User;
