
import mongoose from "mongoose"; // Add this at the top



const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String },
  tags: { type: String },
  price: { type: Number, required: true },
  deliveryTime: { type: Number, required: true },
  revisions: { type: Number, default: 1 },
  features: { type: String },
  jobThumbnail: { type: String }, // <-- Thumbnail Image URL
  jobPostedOn: { type: Date, default: Date.now },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["open", "closed", "in-progress"], default: "open" },
  reviews: [{ userId: mongoose.Schema.Types.ObjectId, rating: Number, comment: String,
    reviewer: String }],
  isActive: { type: Boolean, default: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  paymentStatus: { type: String, enum: ["pending", "completed"], default: "pending" },

});

export const Job = mongoose.model("Job", jobSchema);

