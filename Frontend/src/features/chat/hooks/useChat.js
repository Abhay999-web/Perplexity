import { useEffect, useRef } from "react";
import { initializeSocketConnection } from "../service/chat.socket.js";
import { getChats, getMessages, deleteChat } from "../service/chat.api.js";
import { setChats, setCurrentChatId, setError, setLoading, addNewMessage, appendMessageChunk, syncTemporaryChatId, addMessages, removeChat } from "../chat.slice.js"; 
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../auth/auth.slice.js";

export const useChat = () => {
    const dispatch = useDispatch();
    const socketRef = useRef(null);
    const currentChatIdRef = useRef(null);
    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = initializeSocketConnection();

            // 1. Listen to dynamic incoming text tokens
            socketRef.current.on("chat_chunk", (data) => {
                const targetId = currentChatIdRef.current || data.chatId;
                dispatch(appendMessageChunk({
                    chatId: targetId,
                    text: data.text
                }));
            });

            // Listen for credits updates from backend and update global auth state
            socketRef.current.on("credits_updated", (data) => {
                try {
                    const { remainingCredits } = data;
                    if (currentUser && typeof remainingCredits !== "undefined") {
                        dispatch(setUser({ ...currentUser, credits: remainingCredits }));
                    }
                } catch (err) {
                    console.error("credits_updated handler error:", err);
                }
            });

            // 2. Listen to session validation & database mapping updates from backend
            socketRef.current.on("chat_session_ready", (data) => {
                const { tempChatId, realChatId, title } = data;
                dispatch(syncTemporaryChatId({ tempChatId, realChatId, title }));
                currentChatIdRef.current = realChatId;
                dispatch(setCurrentChatId(realChatId));
            });

            socketRef.current.on("chat_error", (data) => {
                dispatch(setError(data.message));
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off("chat_chunk");
                socketRef.current.off("credits_updated");
                socketRef.current.off("chat_session_ready");
                socketRef.current.off("chat_error");
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [dispatch]);

    async function handleSendMessage({ message, chatId, userId }) {
        try {
            dispatch(setError(null));
            
            const tempChatId = chatId || "temp_chat_id_" + Date.now();
            currentChatIdRef.current = tempChatId;

            // Immediate frontend execution UI updating
            dispatch(addNewMessage({
                chatId: tempChatId,
                content: message,
                role: "user",
            }));

            dispatch(addNewMessage({
                chatId: tempChatId,
                content: "",
                role: "assistant",
                isThinking: true, 
            }));

            if (!chatId) {
                dispatch(setCurrentChatId(tempChatId));
            }

            
            if (socketRef.current && socketRef.current.connected) {
                socketRef.current.emit("send_user_message", {
                    tempChatId: !chatId ? tempChatId : null,
                    chatId: chatId || null,
                    message: message,
                    userId: userId || null
                });
            } else {
                throw new Error("Socket connection pipeline is down. Please try again.");
            }
            
        } catch (err) {
            dispatch(setError(err.message || "Failed to send message"));
        }
    }

    async function handleGetChats() {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getChats();
            const { chats } = data;
            
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[ chat._id ] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                };
                return acc;
            }, {})));
        } catch (err) {
            dispatch(setError(err.message || "Failed to load chats"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleOpenChat(chatId, chats) {
        try {
            dispatch(setError(null));
            currentChatIdRef.current = chatId;

            if (chats[ chatId ]?.messages.length === 0) {
                const data = await getMessages(chatId);
                const { messages } = data;

                const formattedMessages = messages.map(msg => ({
                    content: msg.content,
                    role: msg.role,
                }));

                dispatch(addMessages({
                    chatId,
                    messages: formattedMessages,
                }));
            }
            dispatch(setCurrentChatId(chatId));
        } catch (err) {
            dispatch(setError(err.message || "Failed to open chat"));
        }
    }

    async function handleDeleteChat(chatId) {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            await deleteChat(chatId);
            dispatch(removeChat(chatId));
            if (currentChatIdRef.current === chatId) {
                currentChatIdRef.current = null;
            }
            dispatch(setCurrentChatId(null));
        } catch (err) {
            dispatch(setError(err.message || "Failed to delete chat"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        initializeSocketConnection,
        handleSendMessage,
        handleGetChats,
        handleOpenChat,
        handleDeleteChat 
    };
};