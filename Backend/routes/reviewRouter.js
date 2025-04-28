import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { createReview, getReviewsForUser } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", isAuthenticated, createReview);
router.get("/:userId", getReviewsForUser);

export default router;
