import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import { v2 as cloudinary } from "cloudinary";

// ✅ Student applies for a job
export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // Job ID
  const { name, email, phone, address, coverLetter } = req.body;

  if (!name || !email || !phone || !address || !coverLetter) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  // Fetch job details
  const jobDetails = await Job.findById(id);
  if (!jobDetails) {
    return next(new ErrorHandler("Job not found.", 404));
  }

  // Check if already applied
  const isAlreadyApplied = await Application.findOne({
    "jobInfo.jobId": id,
    "studentInfo.id": req.user._id,
  });

  if (isAlreadyApplied) {
    return next(new ErrorHandler("You have already applied for this job.", 400));
  }

  // Prepare student info
  const studentInfo = {
    id: req.user._id,
    name,
    email,
    phone,
    address,
    coverLetter,
    role: "Student",
  };

  // Resume Upload
  if (req.files && req.files.resume) {
    try {
      const cloudinaryResponse = await cloudinary.uploader.upload(req.files.resume.tempFilePath, {
        folder: "Student_Resume",
      });

      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(new ErrorHandler("Failed to upload resume to cloudinary.", 500));
      }

      studentInfo.resume = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    } catch (error) {
      return next(new ErrorHandler("Failed to upload resume", 500));
    }
  } else if (req.user && req.user.resume?.url) {
    studentInfo.resume = {
      public_id: req.user.resume.public_id,
      url: req.user.resume.url,
    };
  } else {
    return next(new ErrorHandler("Please upload your resume.", 400));
  }

  // Prepare business info
  const businessInfo = {
    id: jobDetails.postedBy,
    role: "Business",
  };

  // Prepare job info
  const jobInfo = {
    jobId: id,
    jobTitle: jobDetails.title,
    category: jobDetails.category,
    price: jobDetails.price,
  };

  // Create new application
  const application = await Application.create({ businessInfo, studentInfo, jobInfo });

  res.status(201).json({
    success: true,
    message: "Application submitted successfully.",
    application,
  });
});

// ✅ Business fetches all applications for their posted jobs
export const businessGetAllApplication = catchAsyncErrors(async (req, res, next) => {
  const { _id } = req.user;

  const applications = await Application.find({
    "businessInfo.id": _id,
    "deletedBy.business": false,
  });

  res.status(200).json({
    success: true,
    applications,
  });
});

// ✅ Student fetches all their applications
export const studentGetAllApplication = catchAsyncErrors(async (req, res, next) => {
  const { _id } = req.user;

  const applications = await Application.find({
    "studentInfo.id": _id,
    "deletedBy.student": false, // 🔥 Fixed the field name
  });

  res.status(200).json({
    success: true,
    applications,
  });
});

// ✅ Delete application (soft delete)
export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // Application ID
  const application = await Application.findById(id);

  if (!application) {
    return next(new ErrorHandler("Application not found.", 404));
  }

  const { role } = req.user;

  if (role === "Student") {
    application.deletedBy.student = true; // 🔥 Updated field name
  } else if (role === "Business") {
    application.deletedBy.business = true;
  } else {
    return next(new ErrorHandler("Unauthorized action.", 403));
  }

  await application.save();

  // If both student and business delete the application, remove it from the database
  if (application.deletedBy.business && application.deletedBy.student) {
    await application.deleteOne();
  }

  res.status(200).json({
    success: true,
    message: "Application deleted successfully.",
  });
});
