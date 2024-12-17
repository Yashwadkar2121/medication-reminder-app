const cron = require("node-cron");
const Medicine = require("./models/medicine");
const User = require("./models/user");
const sendEmailNotification = require("./services/notificationsJob");

// Function to check schedules and send notifications
const checkMedicineSchedules = async () => {
  const currentTime = new Date().toTimeString().slice(0, 5); // Get current time in HH:MM format
  console.log("Checking schedules for:", currentTime);

  try {
    // Find medicines scheduled for the current time
    const medicines = await Medicine.findAll({
      where: { ScheduleTime: currentTime },
      include: [{ model: User, attributes: ["Email", "Name"] }],
    });

    // Send email notifications to users
    for (const medicine of medicines) {
      const { Name, Dosage } = medicine;
      const userEmail = medicine.User.Email;
      const userName = medicine.User.Name;

      const subject = `Reminder: Time to Take Your Medicine - ${Name}`;
      const message = `Hi ${userName},\n\nThis is a reminder to take your medicine "${Name}" (Dosage: ${Dosage}).\n\nStay healthy!\nYour Medicine App`;

      await sendEmailNotification(userEmail, subject, message);
    }
  } catch (error) {
    console.error("Error checking medicine schedules:", error.message);
  }
};

// Function to start the cron job
const startMedicineScheduler = () => {
  cron.schedule("* * * * *", () => {
    checkMedicineSchedules();
  });
  console.log("Medicine scheduler started...");
};

module.exports = startMedicineScheduler;
