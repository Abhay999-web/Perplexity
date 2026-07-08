import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload;
            state.chats[chatId] = {
                id: chatId,
                title: title || "New Chat",
                messages: [],
                lastUpdated: new Date().toISOString(),
            };
        },
        addNewMessage: (state, action) => {
            const { chatId, content, role, isThinking } = action.payload;
            // Agar chat object nahi bana, toh pehle create kar do
            if (!state.chats[chatId]) {
                state.chats[chatId] = {
                    id: chatId,
                    title: "New Chat",
                    messages: [],
                    lastUpdated: new Date().toISOString(),
                };
            }
            state.chats[chatId].messages = [
                ...state.chats[chatId].messages,
                { content, role, isThinking: isThinking || false }
            ];
        },
        appendMessageChunk: (state, action) => {
            const { chatId, text } = action.payload;
            const chat = state.chats[chatId];
            if (chat && chat.messages.length > 0) {
       
                
                for (let i = chat.messages.length - 1; i >= 0; i--) {
                    if (chat.messages[i].role === 'assistant') {
                        chat.messages[i].content += text;
                        chat.messages[i].isThinking = false;
                        break;
                    }
                }
                chat.messages = [...chat.messages];
            }
        },
        syncTemporaryChatId: (state, action) => {
            const { tempChatId, realChatId, title } = action.payload;
            if (state.chats[tempChatId]) {
                state.chats[realChatId] = {
                    ...state.chats[tempChatId],
                    id: realChatId,
                    title: title || state.chats[tempChatId].title
                };
                delete state.chats[tempChatId];
            }
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload;
            if (state.chats[chatId]) {
                state.chats[chatId].messages = [...state.chats[chatId].messages, ...messages];
            }
        },
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        removeChat: (state, action) => {
            const chatId = action.payload;
            delete state.chats[chatId];
        }
    }
});

export const {
    setChats,
    setCurrentChatId,
    setLoading,
    setError,
    createNewChat,
    addNewMessage,
    appendMessageChunk,
    syncTemporaryChatId,
    addMessages,
    removeChat
} = chatSlice.actions;

export default chatSlice.reducer;