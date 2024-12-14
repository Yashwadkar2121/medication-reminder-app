const { Sequelize } = require("sequelize");

// Create a new Sequelize instance and connect to the MySQL database
const sequelize = new Sequelize("MedicationReminderApp", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
