import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  sendMessage,
  getConversation,
  getAllConversations,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/send", isAuthenticated, sendMessage);
router.get("/conversation/:userId", isAuthenticated, getConversation);
router.get("/conversations", isAuthenticated, getAllConversations); // ✅ Make sure this exists!

export default router;
