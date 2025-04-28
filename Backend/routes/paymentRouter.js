import express from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";
import { khaltiVerify, handleKhaltiRedirect,callKhalti } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/khalti-verify", isAuthenticated, isAuthorized("Business"), khaltiVerify);
router.get("/khalti/callback", handleKhaltiRedirect);
router.post("/khalti/initiate", isAuthenticated, isAuthorized("Business"), callKhalti);

export default router;
