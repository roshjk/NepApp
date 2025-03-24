import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { User } from "./models/userSchema.js"; // Adjust path if needed

dotenv.config({ path: "./config/config.env" }); // Ensure this points to your env file

const createAdmin = async () => {
  try {
    // Connect to your MongoDB database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");

    // Check if an admin already exists
    const existingAdmin = await User.findOne({ role: "Admin" });
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
      process.exit();
    }

    // Create admin data
    const adminData = {
      name: "Admin User",
      email: "admin@gmail.com",
      phone: 1234567890, // Required if your schema demands it for non-admin? Adjust as needed.
      address: "Admin HQ", // Same as above.
      password: "admin123", // Plain text password; will be hashed by the pre-save hook (or you can hash explicitly)
      role: "Admin",
    };

    // Optionally, hash the password manually if you want:
    // adminData.password = await bcrypt.hash(adminData.password, 10);

    // Create admin user
    const admin = await User.create(adminData);
    console.log("Admin created successfully:", admin.email);
    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
