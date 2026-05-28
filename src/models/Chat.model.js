import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Chat must belong to a user"],
    },
    title: {
      type: String,
      required: [true, "Please provide a chat title"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      enum: ["general", "research", "coding", "creative", "analysis", "other"],
      default: "general",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },
    model: {
      type: String,
      enum: ["gpt-4", "gpt-3.5", "claude", "local"],
      default: "gpt-4",
    },
    messageCount: {
      type: Number,
      default: 0,
    },
    metadata: {
      language: String,
      source: String,
      customData: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

// Index for faster queries
chatSchema.index({ user: 1, createdAt: -1 });
chatSchema.index({ user: 1, isPinned: -1 });
chatSchema.index({ tags: 1 });

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;
