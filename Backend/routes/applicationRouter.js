import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  deleteApplication,
  businessGetAllApplication,
  studentGetAllApplication,
  postApplication,
  updateApplicationStatus,
  submitWork,
  initiatePayment,
  verifyAndReleasePayment,
  adminGetAllApplications,

} from "../controllers/applicationController.js";

const router = express.Router();

router.post(
  "/apply/:id",
  isAuthenticated,
  isAuthorized("Student"),
  postApplication
);

router.get(
 "/business/applications",
  isAuthenticated,
  isAuthorized("Business"),
  businessGetAllApplication
);

router.get("/applications",
   isAuthenticated,
   isAuthorized("Admin"),
 adminGetAllApplications);
router.get(
  "/student/applications",
  isAuthenticated,
  studentGetAllApplication
);

router.delete(
  "/delete/:id",
  isAuthenticated,
  deleteApplication);

router.put(
  "/update-status/:applicationId",
   updateApplicationStatus);

   router.put(
    "/submit-work/:applicationId",
    isAuthenticated,
    isAuthorized("Student"),
    submitWork);

   router.put(
    "/verify-and-release/:applicationId",
     isAuthenticated,
     isAuthorized("Admin"),
     verifyAndReleasePayment); 
     
     router.put(
      "/initiate-payment/:applicationId",
      isAuthenticated,
      isAuthorized("Business"),
      initiatePayment
    ); 

export default router;