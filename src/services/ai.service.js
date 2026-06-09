import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatMistralAI} from "@langchain/mistralai"
import {HumanMessage, SystemMessage} from "langchain"

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY
})

export async function generateResponse(message){

  const response = await geminiModel.invoke([
    new HumanMessage(message)
  ])

  return response.text
}

export async function generateChatTitle(message){

  const response = await mistralModel.invoke([

    /* System instruction which defines the role and behavior of the AI assistant */
    new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for chat conversations. Based on the following conversation, provide a suitable title that captures the essence of the discussion.
      
      User will provide you with the first message of the conversation, and you will generate a title that reflects the main topic or theme of the chat. The title should be concise, ideally between 2 to 4 words, and should accurately represent the content of the conversation.
      `),
      new HumanMessage(`
        Generate a title for a chat conversation based on the following first message:
        "${message}"
        `)
  ])

  return response.text

}