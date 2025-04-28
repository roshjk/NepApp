import { Message } from "../models/messageSchema.js";
import { User } from "../models/userSchema.js";

// ✅ Send a Message
export const sendMessage = async (req, res) => {
  const { receiver, text } = req.body;

  if (!receiver || !text) {
    return res.status(400).json({ message: "Receiver and message text are required." });
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver,
    text,
  });

  res.status(201).json({ success: true, message });
};

// ✅ Get Conversation with a Specific User
export const getConversation = async (req, res) => {
  const { userId } = req.params;

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender", "name")
    .populate("receiver", "name");

  res.status(200).json({ success: true, messages });
};

// ✅ Get All Past Conversations for Sidebar
export const getAllConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .sort({ updatedAt: -1 }) // newest message first
      .populate("sender receiver", "name");

    const uniqueUsers = {};

    messages.forEach((msg) => {
      const otherUser = msg.sender._id.equals(req.user._id)
        ? msg.receiver
        : msg.sender;

      // Keep only the latest message
      if (
        !uniqueUsers[otherUser._id] ||
        new Date(msg.updatedAt) > new Date(uniqueUsers[otherUser._id].updatedAt)
      ) {
        uniqueUsers[otherUser._id] = {
          user: otherUser,
          lastMessage: msg.text,
          updatedAt: msg.updatedAt,
        };
      }
    });

    const conversations = Object.values(uniqueUsers);

    res.status(200).json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};
