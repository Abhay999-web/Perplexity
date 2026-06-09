import { response } from "express";
import { generateResponse, generateChatTitle } from "../services/ai.service.js";


export async function sendMessage(req,res){

    const {message} = req.body;

    //title generate for the chat
    const title = await generateChatTitle(message);
    console.log(title)

    //generate response from the ai
    const result = await generateResponse(message);

    res.json({
        aiMessage: result,
        title: title
    })

}