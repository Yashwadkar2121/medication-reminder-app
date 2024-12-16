const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const dotenv = require("dotenv");
dotenv.config();

// Register a new user
const registerUser = async (req, res) => {
  const { Name, Email, Password, Role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { Email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create a new user
    const newUser = await User.create({
      Name,
      Email,
      PasswordHash: hashedPassword,
      Role,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { Email, Password } = req.body;

  try {
    console.log("Login attempt with email:", Email); // Debugging statement

    // Find user by email
    const user = await User.findOne({ where: { Email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the entered password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(Password, user.PasswordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User found and password matched."); // Debugging statement

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.ID, role: user.Role },
      process.env.JWT_SECRET
      // { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login: ", error); // Debugging statement
    res.status(500).json({ message: "Server error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // Check if the logged-in user has the "admin" role
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Fetch all users (excluding sensitive information like passwords)
    const users = await User.findAll({
      attributes: ["ID", "Name", "Email", "Role", "CreatedAt", "UpdatedAt"], // Exclude PasswordHash
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { registerUser, loginUser,getAllUsers };
