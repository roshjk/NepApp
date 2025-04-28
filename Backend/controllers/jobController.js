import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/userSchema.js";
import { io } from "../server.js";
// ✅ Post a Job
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
  } = req.body;

  if (!title || !description || !category || !price || !deliveryTime || !features) {
    return next(new ErrorHandler("Please provide full details.", 400));
  }

  const postedBy = req.user._id;
  let thumbnailUrl = "";

  if (req.files && req.files.jobThumbnail) {
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        req.files.jobThumbnail.tempFilePath,
        {
          folder: "Job_Thumbnails",
          resource_type: "image",
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
    tags: Array.isArray(tags) ? tags : tags?.split(",") || [],
    price,
    deliveryTime,
    revisions,
    features: Array.isArray(features) ? features : features?.split(",") || [],
    postedBy,
    status,
    jobThumbnail: thumbnailUrl,
  });

  io.emit("notification", {
    type: "job-posted",
    message: `A new job titled '${job.title}' has been posted.`,
  });

  res.status(201).json({
    success: true,
    message: "Job posted successfully.",
    job,
  });
});

// ✅ Get All Jobs
export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const { category, subCategory, status, searchKeyword } = req.query;
  const query = {};

  if (category) query.category = category;
  if (subCategory) query.subCategory = subCategory;
  if (status) query.status = status;
  if (searchKeyword) {
    query.$or = [
      { title: { $regex: searchKeyword, $options: "i" } },
      { description: { $regex: searchKeyword, $options: "i" } },
    ];
  }

  const jobs = await Job.find(query).populate("postedBy", "name email");

  res.status(200).json({
    success: true,
    jobs,
    count: jobs.length,
  });
});

// ✅ Get a Single Job
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

  const updatedFields = req.body;
  if (updatedFields.tags && typeof updatedFields.tags === "string") {
    updatedFields.tags = updatedFields.tags.split(",");
  }
  if (updatedFields.features && typeof updatedFields.features === "string") {
    updatedFields.features = updatedFields.features.split(",");
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, updatedFields, {
    new: true,
  });

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

  io.to(req.user._id.toString()).emit("notification", {
    type: "job-deleted",
    message: `Your job '${job.title}' was deleted.`,
  });

  res.status(200).json({ success: true, message: "Job deleted successfully" });
});

// ✅ Assign Job to a Student
export const assignJob = catchAsyncErrors(async (req, res, next) => {
  const { studentId } = req.body;
  const job = await Job.findById(req.params.id);

  if (!job) return next(new ErrorHandler("Job not found", 404));

  if (job.postedBy.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized to assign this job", 403));
  }

  job.assignedTo = studentId;
  job.status = "in-progress";
  await job.save();

  io.to(studentId).emit("notification", {
    type: "job-assigned",
    message: `You have been assigned to a new job: '${job.title}'`,
  });

  res.status(200).json({
    success: true,
    message: "Job assigned successfully.",
  });
});

// ✅ Mark Job as Completed
export const completeJob = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) return next(new ErrorHandler("Job not found", 404));

  if (job.postedBy.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized to complete this job", 403));
  }

  job.status = "closed";
  job.paymentStatus = "completed"; // Optional: match your application's payment flow
  await job.save();

  if (job.assignedTo) {
    io.to(job.assignedTo.toString()).emit("notification", {
      type: "job-completed",
      message: `The job '${job.title}' has been marked as completed.`,
    });
  }

  res.status(200).json({
    success: true,
    message: "Job marked as completed.",
  });
});

// ✅ Fetch Jobs Posted By a Specific Business
export const getJobsByBusinessId = catchAsyncErrors(async (req, res, next) => {
  const jobs = await Job.find({ postedBy: req.user._id }).populate("postedBy", "name email");

  res.status(200).json({
    success: true,
    jobs,
  });
});


export const getMatchedJobsForStudent = catchAsyncErrors(async (req, res, next) => {
  const student = await User.findById(req.user._id);

  if (!student || student.role !== "Student") {
    return next(new ErrorHandler("Only students can view matched jobs.", 403));
  }

  const studentNiches = [
    student.niches.firstNiche,
    student.niches.secondNiche,
    student.niches.thirdNiche,
  ].filter(Boolean);

  const jobs = await Job.find({ status: "open", isActive: true });

  const matchedJobs = jobs
    .map(job => {
      const tags = job.tags || [];
      const matchedTags = tags.filter(tag => studentNiches.includes(tag));
      return {
        ...job._doc,
        matchScore: matchedTags.length,
      };
    })
    .filter(job => job.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);

  res.status(200).json({
    success: true,
    count: matchedJobs.length,
    matchedJobs,
  });
});

// ✅ Submit a Review (NOTE: this only stores the review reference now)
export const submitReview = catchAsyncErrors(async (req, res, next) => {
  const { reviewId } = req.body;
  const job = await Job.findById(req.params.id);

  if (!job) return next(new ErrorHandler("Job not found", 404));

  if (!reviewId) return next(new ErrorHandler("Review ID is required", 400));

  job.reviews.push(reviewId);
  await job.save();
  io.to(job.postedBy.toString()).emit("notification", {
    type: "review-submitted",
    message: `A review has been submitted for your job '${job.title}'.`,
  });

  res.status(200).json({
    success: true,
    message: "Review attached to job.",
  });

  
});
