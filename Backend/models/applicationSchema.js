import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    studentInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student information is required."],
    },

    resumeUrl: {
      type: String,
      required: [true, "Resume URL is required."],
      trim: true,
    },

    coverLetter: {
      type: String,
      required: [true, "Cover letter is required."],
      trim: true,
    },

    businessInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Business information is required."],
    },

    jobInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job reference is required."],
    },

    deletedBy: {
      student: { type: Boolean, default: false },
      business: { type: Boolean, default: false },
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "released", "paid"],
      default: "unpaid",
    },

    submissionStatus: {
      type: String,
      enum: ["none", "submitted", "approved", "rejected"],
      default: "none",
    },

    submittedWork: {
      type: String, // URL or description of submitted work
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

export const Application = mongoose.model("Application", applicationSchema);
