import express from "express";
import { io } from "../server.js"; // or wherever you exported io
const router = express.Router();

router.get("/send-notification/:userId", (req, res) => {
    const { userId } = req.params;
  
    console.log("🚀 Emitting notification to:", userId); // 🔍 debug line
  
    io.to(userId).emit("notification", {
      type: "test",
      message: "✅ Test notification from backend!",
    });
  
    res.send("Notification emitted to user: " + userId);
  });
  

export default router;
