import { generateResponseStream, generateChatTitle } from "../services/ai.service.js";
import { checkAndRefillCredits, setRefillTimer } from "../services/credit.service.js";
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js";
import userModel from "../models/user.model.js";

export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId, isDeepSearch } = req.body;
        
        // Get safe user ID (handles both id and _id)
        const userId = req.user.id || req.user._id;

        // 1. CHECK CREDITS: Fetch user and verify balance
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Auto-refill if 24 hours have passed since last deduction
        const refillStatus = await checkAndRefillCredits(userId);
        user.credits = refillStatus.currentCredits;

        const creditCost = isDeepSearch ? 3 : 1; // 3 for deep search, 1 for normal
        const currentCredits = Number(user.credits) || 0;

        console.log("Fetched user:", userId, "credits (raw):", user.credits, "type:", typeof user.credits);
        console.log("Computed creditCost:", creditCost, "isDeepSearch:", !!isDeepSearch);

        if (currentCredits <= 0 || currentCredits < creditCost) {
            return res.status(403).json({
                success: false,
                message: `Not enough credits. You need ${creditCost} credits to send this message.`
            });
        }

        // 2. CHAT SETUP: Create new chat if ID is not provided
        let title = null, chat = null;

        if (!chatId) {
            title = await generateChatTitle(message);
            chat = await chatModel.create({
                user: userId,
                title
            });
        }

        const activeChatId = chatId || chat._id;

        // 3. SAVE MESSAGES: Save user input
        await messageModel.create({
            chat: activeChatId,
            content: message,
            role: "user"
        });

        // Fetch history for AI context
        const messages = await messageModel.find({ chat: activeChatId });

        let aiReply = "";
        for await (const event of generateResponseStream(messages)) {
            if (event?.event === "on_chat_model_stream" && event?.data?.chunk?.content) {
                aiReply += event.data.chunk.content;
            }
        }

        // Save AI reply
        const aiMessage = await messageModel.create({
            chat: activeChatId,
            content: aiReply || "I couldn't generate a response right now.",
            role: "ai"
        });

        // 4. DEDUCT CREDITS: Update user balance after successful response
        user.credits = currentCredits - creditCost;
        if (user.credits <= 0) {
            await setRefillTimer(userId);
        }
        await user.save();

        // 5. SEND RESPONSE: Return data and remaining credits to update UI
        res.status(201).json({
            success: true,
            title,
            chat,
            aiMessage,
            remainingCredits: user.credits
        });

    } catch (error) {
        console.error("sendMessage Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function getChats(req, res) {
    const userId = req.user.id || req.user._id;
    
    // Fetch all chats for the logged-in user
    const chats = await chatModel.find({ user: userId });

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    });
}

export async function getMessages(req, res) {
    const { chatId } = req.params;
    const userId = req.user.id || req.user._id;

    // Verify if chat belongs to user
    const chat = await chatModel.findOne({
        _id: chatId,
        user: userId
    });

    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }

    // Get all messages for this chat
    const messages = await messageModel.find({ chat: chatId });

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages
    });
}

export async function deleteChat(req, res) {
    const { chatId } = req.params;
    const userId = req.user.id || req.user._id;

    // Delete the chat document
    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: userId
    });

    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }

    // Delete all messages linked to this chat
    await messageModel.deleteMany({ chat: chatId });

    res.status(200).json({
        message: "Chat deleted successfully"
    });
}