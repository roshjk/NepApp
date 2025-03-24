import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/messageController.js";
import { param, validationResult } from "express-validator";

const router = express.Router();

// Validate ID parameter
const validateId = [
  param("id").isMongoId().withMessage("Invalid user ID"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Routes
router.get("/users", protectRoute, getUsersForSidebar);
router.get("/messages/:id", protectRoute, validateId, getMessages);
router.post("/send/:id", protectRoute, validateId, sendMessage);

export default router;