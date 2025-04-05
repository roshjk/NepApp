import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";
import { v2 as cloudinary } from "cloudinary";
// ✅ Post a Job (with image thumbnail support)
export const postJob = catchAsyncErrors(async (req, res, next) => {
  const {
    title,
    description,
    category,
    subCategory,
    tags,
    price,
    deliveryTime,
    revisions,
    features,
    status,
    applicants,
    reviews,
    isActive,
    jobThumbnail, // Image URL or file path
  } = req.body;

  if (!title || !description || !category || !price || !deliveryTime || !features) {
    return next(new ErrorHandler("Please provide full details.", 400));
  }

  const postedBy = req.user._id;
  let thumbnailUrl = "";

  // ✅ Upload Thumbnail to Cloudinary (if provided)
  if (req.files && req.files.jobThumbnail) {
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        req.files.jobThumbnail.tempFilePath,
        {
          folder: "Job_Thumbnails",
          resource_type: "image", // image instead of auto
        }
      );
  
      thumbnailUrl = cloudinaryResponse.secure_url;
    } catch (error) {
      return next(new ErrorHandler("Thumbnail upload failed.", 500));
    }
  } else {
    return next(new ErrorHandler("Thumbnail image is required.", 400));
  }
  
  const job = await Job.create({
    title,
    description,
    category,
    subCategory,
    tags,
    price,
    deliveryTime,
    revisions,
    features,
    jobPostedOn: new Date(),
    postedBy,
    status,
    jobThumbnail: thumbnailUrl, // Save image thumbnail
  });

  res.status(201).json({
    success: true,
    message: "Job posted successfully.",
    job,
  });
});

// ✅ Get All Jobs (with filtering & searching)
export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const { category, subCategory, status, searchKeyword } = req.query;
  const query = {};

  if (category) query.category = category;
  if (subCategory) query.subCategory = subCategory;
  if (status) query.status = { $in: ["open", "closed", "in-progress"] };
  if (searchKeyword) {
    query.$or = [
      { title: { $regex: searchKeyword, $options: "i" } },
      { description: { $regex: searchKeyword, $options: "i" } },
      { category: { $regex: searchKeyword, $options: "i" } },
    ];
  }

  const jobs = await Job.find(query).populate("postedBy", "name email");

  res.status(200).json({
    success: true,
    jobs,
    count: jobs.length,
  });
});

// ✅ Get a Single Job by ID
export const getASingleJobById = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.findById(req.params.id).populate("postedBy", "name email");

  if (!job) return next(new ErrorHandler("Job not found", 404));

  res.status(200).json({ success: true, job });
});

// ✅ Update a Job
export const updateJob = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) return next(new ErrorHandler("Job not found", 404));

  if (job.postedBy.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized to update this job", 403));
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, updatedJob });
});

// ✅ Delete a Job
export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) return next(new ErrorHandler("Job not found", 404));

  if (job.postedBy.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized to delete this job", 403));
  }

  await job.deleteOne();
  res.status(200).json({ success: true, message: "Job deleted successfully" });
});


// ✅ Assign Job to a Student
export const assignJob = catchAsyncErrors(async (req, res, next) => {
  const { studentId } = req.body;
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized to assign this job", 403));
  }

  job.assignedTo = studentId;
  job.status = "in-progress";
  await job.save();

  res.status(200).json({
    success: true,
    message: "Job assigned successfully.",
  });
});

// ✅ Mark Job as Completed
export const completeJob = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }

  if (job.postedBy.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized to update job status", 403));
  }

  job.status = "completed";
  job.paymentStatus = "completed"; // Assuming payment is done when job is completed
  await job.save();

  res.status(200).json({
    success: true,
    message: "Job marked as completed.",
  });
});

// ✅ Submit a Review
export const submitReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment } = req.body;
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }

  const newReview = {
    userId: req.user._id,
    rating,
    comment,
    reviewer: req.user.name, // Assuming you have user name in auth middleware
  };

  job.reviews.push(newReview);
  await job.save();

  res.status(200).json({
    success: true,
    message: "Review submitted successfully.",
  });
});

