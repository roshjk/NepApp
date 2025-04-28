import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { io } from "../server.js"; // Make sure server.js exports io correctly



// ✅ Submit an Application
export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { id: jobId } = req.params;
  const { coverLetter } = req.body;

  if (!coverLetter) {
    return next(new ErrorHandler("Cover letter is required.", 400));
  }

  const job = await Job.findById(jobId);
  if (!job) return next(new ErrorHandler("Job not found.", 404));

  // Check if already applied
  const existing = await Application.findOne({
    jobInfo: jobId,
    studentInfo: req.user._id,
  });
  if (existing) {
    return next(new ErrorHandler("You have already applied for this job.", 400));
  }

  let resumeUrl = req.user.resume?.url;

  if (req.files?.resume) {
    try {
      const upload = await cloudinary.uploader.upload(req.files.resume.tempFilePath, {
        folder: "Student_Resumes",
        resource_type: "raw", // Important for PDF
      });
      resumeUrl = upload.secure_url;
    } catch (err) {
      return next(new ErrorHandler("Failed to upload resume.", 500));
    }
  }

  if (!resumeUrl) {
    return next(new ErrorHandler("Please upload your resume.", 400));
  }

  const application = await Application.create({
    studentInfo: req.user._id,
    resumeUrl,
    coverLetter,
    businessInfo: job.postedBy,
    jobInfo: job._id,
  });
  
  io.to(job.postedBy.toString()).emit("notification", {
    type: "application",
    message: "You have a new application on your job.",
  });

  res.status(201).json({
    success: true,
    message: "Application submitted successfully.",
    application,
  });
});

// ✅ Business: Get All Applications
export const businessGetAllApplication = catchAsyncErrors(async (req, res, next) => {
  const applications = await Application.find({
    businessInfo: req.user._id,
    "deletedBy.business": false,
  })
    .populate("studentInfo", "name email phone address resume coverLetter")
    .populate("jobInfo", "title category subCategory price deliveryTime revisions");

  res.status(200).json({ success: true, applications });
});

// ✅ Student: Get All Applications
export const studentGetAllApplication = catchAsyncErrors(async (req, res, next) => {
  const applications = await Application.find({
    studentInfo: req.user._id,
    "deletedBy.student": false,
  })
    .populate("businessInfo", "name email")
    .populate("jobInfo", "title category subCategory price deliveryTime revisions")
    .populate("studentInfo", "name email phone address resume coverLetter");

  res.status(200).json({ success: true, applications });
});

// ✅ Update Application Status
export const updateApplicationStatus = catchAsyncErrors(async (req, res, next) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "accepted", "rejected"];
  if (!validStatuses.includes(status)) {
    return next(new ErrorHandler("Invalid status provided.", 400));
  }

  const application = await Application.findByIdAndUpdate(
    applicationId,
    { status },
    { new: true }
  );

  if (!application) return next(new ErrorHandler("Application not found.", 404));

  res.status(200).json({ success: true, message: "Application status updated." });
});

// ✅ Submit Work
export const submitWork = catchAsyncErrors(async (req, res, next) => {
  const { applicationId } = req.params;
  const { workUrl } = req.body;

  const application = await Application.findById(applicationId);
  if (!application) return next(new ErrorHandler("Application not found.", 404));

  application.submissionStatus = "submitted";
  application.submittedWork = workUrl;
  await application.save();

  io.to(application.businessInfo.toString()).emit("notification", {
    type: "submission",
    message: "A student has submitted the work for your job.",
  });

  res.status(200).json({ success: true, message: "Work submitted for review." });
});

// ✅ Admin: Get All Applications with Populated Info
export const adminGetAllApplications = catchAsyncErrors(async (req, res, next) => {
  const applications = await Application.find()
    .populate("studentInfo", "name email") // show student name and email
    .populate("jobInfo", "title");         // show job title

  const formatted = applications.map(app => ({
    ...app._doc,
    studentInfo: app.studentInfo,
    jobInfo: { jobTitle: app.jobInfo?.title },
  }));

  res.status(200).json(formatted);
});

// ✅ Business: Initiate Payment After Accepting
export const initiatePayment = catchAsyncErrors(async (req, res, next) => {
  const { applicationId } = req.params;

  const application = await Application.findById(applicationId);

  if (!application) return next(new ErrorHandler("Application not found.", 404));

  if (application.status !== "accepted") {
    return next(new ErrorHandler("You can only pay after accepting the application.", 400));
  }

  if (application.paymentStatus !== "unpaid") {
    return next(new ErrorHandler("Payment already initiated or completed.", 400));
  }

  application.paymentStatus = "pending"; // now waiting for student to submit work
  await application.save();

  res.status(200).json({
    success: true,
    message: "Payment initiated. Waiting for student to submit work.",
    application,
  });
});
// ✅ Verify & Release Payment
export const verifyAndReleasePayment = catchAsyncErrors(async (req, res, next) => {
  const { applicationId } = req.params;

  const application = await Application.findById(applicationId);
  if (!application) return next(new ErrorHandler("Application not found.", 404));

  if (application.submissionStatus !== "submitted") {
    return next(new ErrorHandler("Work has not been submitted yet.", 400));
  }

  application.submissionStatus = "approved";
  application.paymentStatus = "released";
  await application.save();

  io.to(application.studentInfo.toString()).emit("notification", {
    type: "payment",
    message: "Your payment has been released. Great job!",
  });

  res.status(200).json({ success: true, message: "Payment released to student." });
});


export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const application = await Application.findById(id);

  if (!application) return next(new ErrorHandler("Application not found.", 404));

  const { role, _id } = req.user;

  if (role === "Student" && application.studentInfo.toString() === _id.toString()) {
    application.deletedBy.student = true;
  } else if (role === "Business" && application.businessInfo.toString() === _id.toString()) {
    application.deletedBy.business = true;
  } else {
    return next(new ErrorHandler("Unauthorized action.", 403));
  }

  await application.save();

  if (application.deletedBy.student && application.deletedBy.business) {
    await application.deleteOne();
  }

  res.status(200).json({ success: true, message: "Application deleted successfully." });
});
