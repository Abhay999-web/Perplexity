import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

export async function testAi() {
  try {
    const response = await model.invoke(
      "What is AI and what it help for ?"
    );

    console.log(response.content);
  } catch (error) {
    console.error("AI Error:", error);
  }
}