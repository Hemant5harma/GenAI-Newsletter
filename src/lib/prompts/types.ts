export type SectionType = 'hook' | 'analysis' | 'story' | 'cta';

export interface Metric {
    name: string;
    value: number;
    trend?: 'up' | 'down' | 'neutral';
}

export interface BrandContext {
    name: string;
    tone: string;
    audience: string;
    voiceProfile?: any; // Will be defined strictly in Week 2
}

export interface PromptContext {
    section: SectionType;
    brand: BrandContext;
    pastPerformance?: Metric[];
    goals?: string[];
}
