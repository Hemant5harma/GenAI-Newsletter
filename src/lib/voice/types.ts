// src/lib/voice/types.ts

export interface VoiceProfile {
    vocabulary: {
        keywords: string[]; // e.g., "agentic", "paradigm shift"
        bannedWords: string[]; // e.g., "delve", "unlock"
        jargonLevel: 'low' | 'medium' | 'high';
    };
    toneMarkers: {
        humor: number; // 0-10
        formality: number; // 0-10
        enthusiasm: number; // 0-10
        cynicism: number; // 0-10
    };
    styleGuide: {
        emojiUsage: 'never' | 'sparse' | 'heavy';
        sentenceLength: 'short' | 'varied' | 'long';
        formatting: string[]; // e.g., "Use bold for key terms"
    };
}

export const DEFAULT_VOICE_PROFILE: VoiceProfile = {
    vocabulary: { keywords: [], bannedWords: [], jargonLevel: 'medium' },
    toneMarkers: { humor: 3, formality: 7, enthusiasm: 5, cynicism: 2 },
    styleGuide: { emojiUsage: 'sparse', sentenceLength: 'varied', formatting: [] }
};
