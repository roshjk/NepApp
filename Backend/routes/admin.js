import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import { User } from "../models/userSchema.js";
import { Job } from "../models/jobSchema.js";
import { Application } from "../models/applicationSchema.js";

const router = express.Router();

// Users CRUD (Admin only)
router.get("/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "Admin" } }).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users." });
    }
});

router.post("/user", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to create user." });
    }
});

router.put("/user/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Failed to update user." });
    }
});

router.delete("/user/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user." });
    }
});

// Jobs CRUD
router.get("/jobs", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch jobs." });
    }
});

router.post("/job", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const newJob = new Job(req.body);
        await newJob.save();
        res.status(201).json(newJob);
    } catch (error) {
        res.status(500).json({ message: "Failed to create job." });
    }
});

router.put("/job/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: "Failed to update job." });
    }
});

router.delete("/job/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: "Job deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete job." });
    }
});

// Applications CRUD
router.get("/applications", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const applications = await Application.find();
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch applications." });
    }
});

router.post("/application", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const newApplication = new Application(req.body);
        await newApplication.save();
        res.status(201).json(newApplication);
    } catch (error) {
        res.status(500).json({ message: "Failed to create application." });
    }
});

router.put("/application/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
        const updatedApplication = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: "Failed to update application." });
    }
});

router.delete("/application/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.json({ message: "Application deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete application." });
    }
});

export default router;
