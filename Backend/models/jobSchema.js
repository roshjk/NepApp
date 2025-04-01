import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  tags: { type: String},
  price: { type: Number, required: true },
  deliveryTime: { type: Number, required: true },
  revisions: { type: Number, default: 1 },
  features: { type: String},

  newsLettersSent: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: { type: String, enum: ["open", "closed", "in-progress"], default: "open" },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reviews: [{ userId: mongoose.Schema.Types.ObjectId, rating: Number, comment: String }],
  isActive: { type: Boolean, default: true },

});

export const Job =  mongoose.model("Job", jobSchema);