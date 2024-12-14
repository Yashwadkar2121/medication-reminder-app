const express = require("express");
const dotenv = require("dotenv");
const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

dotenv.config();

const app = express();

// Enable CORS for Vite origin
app.use(cors({
  origin: "http://localhost:5173", // Adjust the origin to match your Vite app's URL
}));

app.use(express.json());

app.use("/api/auth", authRoutes);

// Sync the database and start the server
sequelize
  .sync()
  .then(() => {
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
