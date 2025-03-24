import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import { User } from "../models/userSchema.js";
import { Job } from "../models/jobSchema.js";  
import { Application } from "../models/applicationSchema.js"; // Import Application model

const router = express.Router();

// Get all users (Admin only)
router.get("/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "Admin" } }).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users." });
    }
});

// Get all job posts (Admin only)
router.get("/jobs", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch jobs." });
    }
});

// Get all applications (Admin only)
router.get("/applications", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const applications = await Application.find();
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch applications." });
    }
});

// Delete a user (Admin only)
router.delete("/user/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user." });
    }
});

// Delete a job post (Admin only)
router.delete("/job/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: "Job deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete job." });
    }
});

// Delete an application (Admin only)
router.delete("/application/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.json({ message: "Application deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete application." });
    }
});

export default router;
