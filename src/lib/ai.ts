import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.warn("GOOGLE_API_KEY not found in environment variables. AI features will not work.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// Helper to generate text
export async function generateText(prompt: string) {
    if (!apiKey) return "Error: No API Key configured.";
    try {
        const result = await aiModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
}
