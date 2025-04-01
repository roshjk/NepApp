import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
  studentInfo: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Reference to User model (Student)
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
      type: String, // Changed from Number to String (to support different formats)
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
    category: { type: String }, // Matches Job Schema
    price: { type: Number }, // Matches Job Schema
  },

  deletedBy: {
    student: { type: Boolean, default: false }, // Fixed field name
    business: { type: Boolean, default: false },
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Application = mongoose.model("Application", applicationSchema);
