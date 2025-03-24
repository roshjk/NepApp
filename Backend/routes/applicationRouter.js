import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import {
  deleteApplication,
  businessGetAllApplication,
  studentGetAllApplication,
  postApplication,
} from "../controllers/applicationController.js";

const router = express.Router();

router.post(
  "/post/:id",
  isAuthenticated,
  isAuthorized("Student"),
  postApplication
);

router.get(
  "/business/getall",
  isAuthenticated,
  isAuthorized("Business"),
  businessGetAllApplication
);

router.get(
  "/student/getall",
  isAuthenticated,
  isAuthorized("Student"),
  studentGetAllApplication
);

router.delete("/delete/:id", isAuthenticated, deleteApplication);

export default router;