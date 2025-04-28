import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required."],
    },
    description: {
      type: String,
      required: [true, "Job description is required."],
    },
    category: {
      type: String,
      required: [true, "Job category is required."],
    },
    subCategory: {
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    price: {
      type: Number,
      required: [true, "Job price is required."],
      min: [5, "Minimum price is $5."],
    },
    deliveryTime: {
      type: Number,
      required: [true, "Delivery time is required."],
      min: [1, "Delivery time must be at least 1 day."],
    },
    revisions: {
      type: Number,
      default: 1,
      min: [0, "Revisions cannot be negative."],
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    jobThumbnail: {
      type: String,
      trim: true,
    },
    jobPostedOn: {
      type: Date,
      default: Date.now,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Job must be posted by a user."],
    },
    status: {
      type: String,
      enum: ["open", "closed", "in-progress"],
      default: "open",
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

export const Job = mongoose.model("Job", jobSchema);
