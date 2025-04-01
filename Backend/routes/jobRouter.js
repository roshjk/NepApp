import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  postJob,
  getAllJobs,
  getASingleJobById,
  updateJob,
  deleteJob,
  submitReview,
} from "../controllers/jobController.js";

const router = express.Router();
router.post("/post", isAuthenticated, postJob);
router.get("/all", getAllJobs);
router.get("/:id", getASingleJobById);
router.put("/:id", isAuthenticated, updateJob);
router.delete("/:id", isAuthenticated, deleteJob);
//router.post("/:id/apply", isAuthenticated, applyForJob);
router.post("/:id/review", isAuthenticated, submitReview);

export default router;
