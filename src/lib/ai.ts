import { GoogleGenerativeAI } from "@google/generative-ai";

// --- CONFIGURATION TYPE ---
export interface AiConfig {
    apiKey?: string | null;
    model?: string;
}

// --- FALLBACK TO ENV ---
const envApiKey = process.env.GOOGLE_API_KEY;
const defaultModel = "gemini-2.0-flash-exp";

// --- DYNAMIC MODEL CREATION ---
function getGenAI(config?: AiConfig): GoogleGenerativeAI {
    const apiKey = config?.apiKey || envApiKey;
    if (!apiKey) {
        console.warn("No API Key configured. AI features will fail.");
    }
    return new GoogleGenerativeAI(apiKey || "");
}

function getModel(config?: AiConfig) {
    const genAI = getGenAI(config);
    const modelName = config?.model || defaultModel;
    return genAI.getGenerativeModel({ model: modelName });
}

function getResearchModel(config?: AiConfig) {
    const genAI = getGenAI(config);
    const modelName = config?.model || defaultModel;
    return genAI.getGenerativeModel({
        model: modelName,
        // @ts-ignore - googleSearch is supported in v0.24+ but types might lag
        tools: [{ googleSearch: {} }]
    });
}

// --- LEGACY EXPORTS (for backward compatibility) ---
const genAI = new GoogleGenerativeAI(envApiKey || "");
export const aiModel = genAI.getGenerativeModel({ model: defaultModel });
export const researchModel = genAI.getGenerativeModel({
    model: defaultModel,
    // @ts-ignore
    tools: [{ googleSearch: {} }]
});

// --- MAIN EXPORTS ---

/**
 * Default text generation - Uses Google Gemini.
 * Used by: Writer Agent, Designer Agent, Finalizer Agent
 * @param prompt The prompt to generate text from
 * @param config Optional AI configuration (apiKey, model)
 */
export async function generateText(prompt: string, config?: AiConfig): Promise<string> {
    const apiKey = config?.apiKey || envApiKey;
    if (!apiKey) return "Error: No Google API Key configured.";

    const model = getModel(config);
    const modelName = config?.model || defaultModel;

    console.log(`🤖 Using Google Gemini (${modelName})...`);
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw error;
    }
}

/**
 * Research-specific generation.
 * Uses Gemini with Google Search enabled to find recent content.
 * @param prompt The prompt to generate text from
 * @param config Optional AI configuration (apiKey, model)
 */
export async function generateTextForResearch(prompt: string, config?: AiConfig): Promise<string> {
    const apiKey = config?.apiKey || envApiKey;
    if (!apiKey) return "Error: No Google API Key configured.";

    const model = getResearchModel(config);
    const fallbackModel = getModel(config);
    const modelName = config?.model || defaultModel;

    console.log(`🔍 Research: Using Google Gemini with Search (${modelName})...`);
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Research Error:", error);
        // Fallback to standard generation if search fails
        console.warn("⚠️ Research: Search tool failed or not available, falling back to standard generation.");
        const fallbackResult = await fallbackModel.generateContent(prompt);
        return await fallbackResult.response.text();
    }
}

