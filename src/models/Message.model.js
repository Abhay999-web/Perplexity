import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: [true, "Message must belong to a chat"],
    },
    content: {
      type: String,
      required: [true, "Message content is required"],
    },
    role: {
      type: String,
      enum: ["user", "ai"],
      required: [true, "Please specify message role"],
    },
    sources: [
      {
        title: String,
        url: String,
        snippet: String,
        domain: String,
        timestamp: Date,
      },
    ],
    citations: [
      {
        source: String,
        page: Number,
        quote: String,
      },
    ],
    metadata: {
      tokens: Number,
      processingTime: Number,
      confidence: Number,
      model: String,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    originalContent: String,
    status: {
      type: String,
      enum: ["pending", "sent", "error"],
      default: "sent",
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: String,
    },
    reactions: [
      {
        emoji: String,
        count: Number,
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
messageSchema.index({ chat: 1, createdAt: 1 });
messageSchema.index({ role: 1 });

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
