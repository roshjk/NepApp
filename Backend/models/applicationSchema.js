import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
  studentInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Reference to User model
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Please provide a valid email."],
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    resume: {
      public_id: { type: String, default: null },
      url: { type: String, default: null },
    },
    coverLetter: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Student"],
      required: true,
    },
  },
  businessInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Reference to Business user
      required: true,
    },
    role: {
      type: String,
      enum: ["Business"],
      required: true,
    },
  },
  jobInfo: {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",  // Reference to Job model
      required: true,
    },
    jobTitle: {
      type: String,
      required: true,
    },
  },
  deletedBy: {
    jobSeeker: {
      type: Boolean,
      default: false,
    },
    business: {
      type: Boolean,
      default: false,
    },
  },
});

export const Application = mongoose.model("Application", applicationSchema);
