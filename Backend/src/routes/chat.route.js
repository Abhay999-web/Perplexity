import { Router } from "express";
import { sendMessage, getChats, getMessages, deleteChat } from "../controllers/chat.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const chatRouter = Router()

chatRouter.post("/message", authUser ,sendMessage) //for sending a message and creating a new chat if it doesn't exist

chatRouter.get("/", authUser, getChats ) //for getting all the chats of the logged in user

chatRouter.get("/:chatId/messages", authUser, getMessages)  //for getting all the messages of a specific chat by its ID

chatRouter.delete("/delete/:chatId", authUser, deleteChat) //for deleting a specific chat by its ID


export default chatRouter;