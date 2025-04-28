import { Review } from "../models/reviewSchema.js";

export const createReview = async (req, res) => {
  const { reviewedUser, job, rating, comment } = req.body;

  if (!reviewedUser || !job || !rating) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const review = await Review.create({
    reviewer: req.user._id,
    reviewedUser,
    job,
    rating,
    comment,
  });

  res.status(201).json({ success: true, review });
};

export const getReviewsForUser = async (req, res) => {
  const { userId } = req.params;

  const reviews = await Review.find({ reviewedUser: userId })
    .populate("reviewer", "name")
    .populate("job", "title");

  res.status(200).json({ success: true, reviews });
};
