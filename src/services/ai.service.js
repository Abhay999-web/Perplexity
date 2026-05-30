import { ChatGoogleGenerativeAI } from "@langchain/google-genai";


const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
  
});
console.log(process.env.GEMINI_API_KEY);

export async function testAi(){
    model.invoke("What is AI and what it help for ?")
    .then((response)=>{
        console.log(response.text)
    })
}