import { Server } from "socket.io";
import { generateResponseStream, generateChatTitle } from "../services/ai.service.js";
import { checkAndRefillCredits, setRefillTimer } from "../services/credit.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import userModel from "../models/user.model.js";

let io;

export function initSocket(httpServer) {
    const socketOrigin = process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173";
    io = new Server(httpServer, {
        cors: {
            origin: socketOrigin,
            credentials: true,
        }
    });

    console.log("Socket.io engine running securely.");

    io.on("connection", (socket) => {
        console.log("Active socket instance connected: " + socket.id);

        socket.on("send_user_message", async ({ tempChatId, chatId, message, userId }) => {
            let activeChatId = chatId;
            let completeAIResponse = "";

            try {
                if (userId) {
                    const user = await userModel.findById(userId);
                    if (!user) {
                        socket.emit("chat_error", {
                            chatId: activeChatId || tempChatId,
                            message: "User not found."
                        });
                        return;
                    }

                    // Auto-refill if 24 hours have passed since last deduction
                    const refillStatus = await checkAndRefillCredits(userId);
                    user.credits = refillStatus.currentCredits;
                    const currentCredits = Number(user.credits) || 0;

                    if (currentCredits <= 0) {
                        const hoursRemaining = refillStatus.hoursRemaining ? refillStatus.hoursRemaining.toFixed(1) : "24";
                        socket.emit("chat_error", {
                            chatId: activeChatId || tempChatId,
                            message: `🚨 You are out of limit!!!! Your credits will refill in approximately ${hoursRemaining} hours.`
                        });
                        return;
                    }
                }

                if (!activeChatId && tempChatId) {
                    const dynamicTitle = await generateChatTitle(message);

                    if (userId) {
                        const newChatDoc = await chatModel.create({
                            user: userId,
                            title: dynamicTitle || "New Chat"
                        });
                        activeChatId = newChatDoc._id.toString();
                    } else {
                        activeChatId = "db_real_" + Date.now();
                    }

                    socket.emit("chat_session_ready", {
                        tempChatId,
                        realChatId: activeChatId,
                        title: dynamicTitle || "New Chat"
                    });
                }

                const shouldPersist = Boolean(activeChatId && !activeChatId.startsWith("db_real_"));

                if (shouldPersist) {
                    await messageModel.create({
                        chat: activeChatId,
                        content: message,
                        role: "user"
                    });
                }

                const historyPayload = [{ role: "user", content: message }];

                const eventStream = await generateResponseStream(historyPayload);

                for await (const event of eventStream) {
                    if (event.event === "on_chat_model_stream") {
                        const chunk = event.data.chunk;
                        if (chunk && chunk.content) {
                            completeAIResponse += chunk.content;

                            socket.emit("chat_chunk", {
                                chatId: activeChatId,
                                text: chunk.content
                            });
                        }
                    }
                }

                if (shouldPersist) {
                    await messageModel.create({
                        chat: activeChatId,
                        content: completeAIResponse,
                        role: "ai"
                    });
                }

                // If this session belongs to an authenticated user, deduct credits
                if (shouldPersist && userId) {
                    try {
                        const user = await userModel.findById(userId);
                        const creditCost = 1; // socket flow currently doesn't accept deep-search flag; default to 1
                        if (user) {
                            console.log("Socket - Fetched user:", userId, "credits (raw):", user.credits, "type:", typeof user.credits);
                            const before = Number(user.credits) || 0;
                            console.log("Before Save:", before);
                            user.credits = before - creditCost;
                            if (user.credits <= 0) {
                                await setRefillTimer(userId);
                            }
                            await user.save();
                            console.log("After Save:", user.credits);
                            // Optionally notify the client about updated credits
                            socket.emit("credits_updated", { userId, remainingCredits: user.credits });
                        }
                    } catch (err) {
                        console.error("Socket credits deduction error:", err);
                    }
                }

                console.log(`Pipeline complete for Session: ${activeChatId}`);

            } catch (error) {
                console.error("Critical Stream Core Breakdown:", error);
                socket.emit("chat_error", {
                    chatId: activeChatId || tempChatId,
                    message: "Streaming runtime loop encountered execution faults."
                });
            }
        });

        socket.on("disconnect", () => {
            console.log("Socket session disconnected: " + socket.id);
        });
    });
}

export function geIo() {
    if (!io) throw new Error("Socket.io layer not initialized.");
    return io;
}