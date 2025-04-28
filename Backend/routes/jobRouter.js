import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  postJob,
  getAllJobs,
  getASingleJobById,
  updateJob,
  deleteJob,
  assignJob,
  completeJob,
  submitReview,
  getJobsByBusinessId,
  getMatchedJobsForStudent,
} from "../controllers/jobController.js";

const router = express.Router();

router.post("/post", isAuthenticated, postJob);
router.get("/my-jobs", isAuthenticated, isAuthorized("Business"), getJobsByBusinessId);
router.get("/all", getAllJobs);
router.get("/:id", getASingleJobById);
router.put("/:id", isAuthenticated, updateJob);
router.delete("/:id", isAuthenticated, deleteJob);
router.put("/:id/assign", isAuthenticated, assignJob); 
router.put("/:id/complete", isAuthenticated, completeJob); 
router.post("/:id/review", isAuthenticated, submitReview); 
router.get("/match-jobs/student", isAuthenticated, getMatchedJobsForStudent);

export default router;
