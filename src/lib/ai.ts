import { GoogleGenerativeAI } from "@google/generative-ai";

const googleApiKey = process.env.GOOGLE_API_KEY;
const perplexityApiKey = process.env.PERPLEXITY_API_KEY;
const aiProvider = process.env.AI_PROVIDER || 'gemini'; // 'gemini' | 'perplexity'

// --- GEMINI SETUP ---
if (!googleApiKey && aiProvider === 'gemini') {
    console.warn("GOOGLE_API_KEY not found. AI features will fail if using Gemini.");
}

const genAI = new GoogleGenerativeAI(googleApiKey || "");
export const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

// --- PERPLEXITY SETUP ---
// Perplexity uses a standard OpenAI-compatible implementation via fetch
const PERPLEXITY_URL = "https://api.perplexity.ai/chat/completions";
const PERPLEXITY_MODEL = "sonar-pro";

async function generateTextPerplexity(prompt: string): Promise<string> {
    if (!perplexityApiKey) {
        throw new Error("PERPLEXITY_API_KEY is missing.");
    }

    try {
        const response = await fetch(PERPLEXITY_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${perplexityApiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: PERPLEXITY_MODEL,
                max_tokens: 8000, // Allow for long newsletter HTML output
                messages: [
                    { role: "system", content: "You are a helpful AI assistant. When generating HTML, output complete, valid HTML without truncation." },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Perplexity API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Perplexity Generation Error:", error);
        throw error;
    }
}

async function generateTextGemini(prompt: string): Promise<string> {
    if (!googleApiKey) return "Error: No Google API Key configured.";
    try {
        const result = await aiModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        throw error;
    }
}

// --- MAIN EXPORTS ---

/**
 * Default text generation - ALWAYS uses Google Gemini.
 * Used by: Writer Agent, Designer Agent, Finalizer Agent
 */
/**
 * Default text generation - Respects AI_PROVIDER from env.
 * Used by: Writer Agent, Designer Agent, Finalizer Agent
 */
export async function generateText(prompt: string): Promise<string> {
    const provider = process.env.AI_PROVIDER || 'gemini';

    if (provider === 'perplexity') {
        console.log("🤖 Using Perplexity (env: AI_PROVIDER=perplexity)...");
        return await generateTextPerplexity(prompt);
    }

    console.log("🤖 Using Google Gemini (default)...");
    return await generateTextGemini(prompt);
}

/**
 * Research-specific generation.
 * If AI_PROVIDER is perplexity, strictly uses it.
 * If not, prefers Perplexity if key exists (for backward compat), else Gemini.
 */
export async function generateTextForResearch(prompt: string): Promise<string> {
    const provider = process.env.AI_PROVIDER || 'gemini';

    if (provider === 'perplexity') {
        console.log("🔍 Research: Using Perplexity (env: AI_PROVIDER=perplexity)...");
        return await generateTextPerplexity(prompt);
    }

    // Default behavior: Prefer Perplexity for research if key exists
    if (perplexityApiKey) {
        console.log("🔍 Research: Using Perplexity AI (key found)...");
        return await generateTextPerplexity(prompt);
    }

    console.warn("⚠️ Research: PERPLEXITY_API_KEY not found, falling back to Gemini (no web search).");
    return await generateTextGemini(prompt);
}


