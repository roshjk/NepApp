import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";

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
jobPostedOn,
status,
applicants,
reviews,
isActive,

  } = req.body;

  if (
   !title ||
   !description ||
   !category ||
   !subCategory ||
   !price ||       
   !deliveryTime||
   !features||
   !jobPostedOn

  ) {
    return next(new ErrorHandler("Please provide full details.", 400));
  }

  const postedBy = req.user._id;

  const job = await Job.create({
title,
description,
category,
subCategory,
tags,
price,
deliveryTime,
features,
jobPostedOn: new Date(),
postedBy,
status,

});
  res.status(201).json({
    success: true,
    message: "Gig posted successfully.",
    job,
  });
});


export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  const { category, subCategory, status,searchKeyword } = req.query;
  const query = {};

  if (category) {
    query.category = category;
  }

  if (subCategory) {
    query.subCategory = subCategory;
  }

  if (status) {
    query.status = { $in: ["open", "closed", "in-progress"] };
  }

  if (searchKeyword) {
    query.$or = [
      { title: { $regex: searchKeyword, $options: "i" } },
      { description: { $regex: searchKeyword, $options: "i" } },
      { category: { $regex: searchKeyword, $options: "i" } },
    ];
  }
  const jobs = await Job.find(query);

  res.status(200).json({
    success: true,
    jobs,
    count: jobs.length,
  });
});




// Get a Single Job by ID
export const getASingleJobById = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  
  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
  }

  res.status(200).json({ 
    success: true, 
    job 
  });
});

// ✅ Update a Job
export const updateJob = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) return next(new ErrorHandler("gig not found", 404));

  if (job.postedBy.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized to update this gig", 403));
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json({ success: true, updatedJob });
});

// ✅ Delete a Job
export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) return next(new ErrorHandler("Gig not found", 404));

  if (job.postedBy.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized to delete this gig", 403));
  }

  await job.deleteOne();
  res.status(200).json({ success: true, message: "Job deleted successfully" });
});



// ✅ Submit a Review for a Job
export const submitReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment } = req.body;
  const job = await Job.findById(req.params.id);

  if (!job) return next(new ErrorHandler("gig not found", 404));

  const existingReview = job.reviews.find((review) => review.userId.toString() === req.user._id.toString());
  if (existingReview) {
    return next(new ErrorHandler("You have already reviewed this gig", 400));
  }

  job.reviews.push({ userId: req.user._id, rating, comment, createdAt: new Date() });
  await job.save();

  res.status(200).json({ success: true, message: "Review submitted successfully", job });
});