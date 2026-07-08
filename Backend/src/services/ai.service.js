import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain"
import * as z from "zod"
import { searchInternet } from "./internet.service.js";

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY
});

const searchInternetTool = tool(
  searchInternet,
  {
    name: "searchInternet",
    description: "Use this tool to get the latest information from the internet.",
    schema: z.object({
      query: z.string().describe("The search query to look up on the internet."),
    }),
  }
);

const agent = createAgent({
  model: mistralModel,
  tools: [searchInternetTool],
});

function extractPureText(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map(extractPureText).filter(Boolean).join("");
  }
  if (content && typeof content === "object") {
    if (typeof content.text === "string") return content.text;
    if (typeof content.content === "string") return content.content;
    if (Array.isArray(content.content)) return extractPureText(content.content);
    if (typeof content.message === "string") return content.message;
    if (typeof content.value === "string") return content.value;
  }
  return "";
}

export async function* generateResponseStream(messages) {
  const formattedMessages = [
    new SystemMessage(`
      You are a helpful assistant that provides accurate and concise answers to user queries. 
      You have access to the latest information from the internet and can use it to provide up-to-date responses. 
      If you don't know the answer, you should say "I don't know" instead of making up an answer.
    `),
    ...messages.map(msg => {
      if (msg.role === "user") return new HumanMessage(msg.content);
      if (msg.role === "ai" || msg.role === "assistant") return new AIMessage(msg.content);
      return null;
    }).filter(Boolean)
  ];

  const eventStream = await agent.streamEvents(
    { messages: formattedMessages },
    { version: "v2" }
  );

  for await (const event of eventStream) {
    if (event?.event === "on_chat_model_stream" && event?.data?.chunk) {
      const normalizedContent = extractPureText(event.data.chunk.content);
      if (normalizedContent) {
        yield {
          ...event,
          data: {
            ...event.data,
            chunk: {
              ...event.data.chunk,
              content: normalizedContent,
            },
          },
        };
      }
      continue;
    }

    yield event;
  }
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`You are a helpful assistant that generates concise and descriptive titles for chat conversations. The title should be between 2 to 4 words.`),
    new HumanMessage(`Generate a title based on this message: "${message}"`)
  ]);
  return response.text;
}