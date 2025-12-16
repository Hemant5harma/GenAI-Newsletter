// src/lib/voice/analyzer.ts
import { db } from "../db";
import { generateText } from "../ai";
import { VoiceProfile, DEFAULT_VOICE_PROFILE } from "./types";

export class VoiceAnalyzer {

    /**
     * Analyzes past content (or brand metadata if cold start) to create a VoiceProfile.
     */
    async analyzeBrandVoice(brandId: string): Promise<VoiceProfile> {
        const brand = await db.brand.findUnique({
            where: { id: brandId },
            include: { issues: { take: 5, orderBy: { generatedAt: 'desc' } } }
        });

        if (!brand) throw new Error("Brand not found");

        // Cold Start vs. Analysis
        const hasHistory = brand.issues.length > 0;

        if (hasHistory) {
            return this.analyzeFromContent(brand.issues.map(i => i.htmlContent || "").join("\n"));
        } else {
            return this.bootstrapFromMetadata(brand);
        }
    }

    /**
     * Bootstraps a profile from Brand Metadata (Cold Start)
     */
    private async bootstrapFromMetadata(brand: any): Promise<VoiceProfile> {
        const prompt = `
      You are an expert Brand Strategist.
      Analyze this brand and generate a Voice Profile JSON.
      
      Brand Name: ${brand.name}
      Tone Description: ${brand.tone}
      Audience: ${brand.audience}
      Description: ${brand.description}
      
      OUTPUT JSON SCHEMA:
      {
        "vocabulary": { "keywords": ["..."], "bannedWords": ["..."], "jargonLevel": "low"|"medium"|"high" },
        "toneMarkers": { "humor": 0-10, "formality": 0-10, "enthusiasm": 0-10, "cynicism": 0-10 },
        "styleGuide": { "emojiUsage": "never"|"sparse"|"heavy", "sentenceLength": "short"|"varied"|"long", "formatting": ["..."] }
      }
      
      Return ONLY the JSON.
    `;

        try {
            const jsonStr = await generateText(prompt);
            return this.parseJson(jsonStr);
        } catch (e) {
            console.error("Voice Bootstrap Failed", e);
            return DEFAULT_VOICE_PROFILE;
        }
    }

    /**
     * Analyzes raw content to extract voice markers
     */
    private async analyzeFromContent(content: string): Promise<VoiceProfile> {
        // Truncate content to avoid token limits
        const sample = content.substring(0, 10000);

        const prompt = `
      You are a Computational Linguist. 
      Analyze the following text samples from a newsletter and extract the Voice Profile.
      
      TEXT SAMPLES:
      ${sample}
      
      OUTPUT JSON SCHEMA (Strict):
      {
        "vocabulary": { "keywords": ["unique phrases found"], "bannedWords": ["cliches to avoid"], "jargonLevel": "low"|"medium"|"high" },
        "toneMarkers": { "humor": 0-10, "formality": 0-10, "enthusiasm": 0-10, "cynicism": 0-10 },
        "styleGuide": { "emojiUsage": "never"|"sparse"|"heavy", "sentenceLength": "short"|"varied"|"long", "formatting": ["observed patterns"] }
      }

      Return ONLY the JSON.
    `;

        try {
            const jsonStr = await generateText(prompt);
            return this.parseJson(jsonStr);
        } catch (e) {
            console.error("Voice Analysis Failed", e);
            return DEFAULT_VOICE_PROFILE;
        }
    }

    private parseJson(text: string): VoiceProfile {
        try {
            // Clean up markdown fences
            const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(clean);
        } catch (e) {
            return DEFAULT_VOICE_PROFILE;
        }
    }

    /**
     * Saves the profile to the DB
     */
    async saveProfile(brandId: string, profile: VoiceProfile) {
        await db.brandVoice.upsert({
            where: { brandId },
            update: {
                vocabulary: profile.vocabulary as any,
                toneMarkers: profile.toneMarkers as any,
                styleGuide: profile.styleGuide as any
            },
            create: {
                brandId,
                vocabulary: profile.vocabulary as any,
                toneMarkers: profile.toneMarkers as any,
                styleGuide: profile.styleGuide as any
            }
        });
    }
}
