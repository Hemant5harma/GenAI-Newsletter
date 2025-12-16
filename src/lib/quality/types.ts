export interface QualityReport {
    overallScore: number; // 0-100
    metrics: {
        readability: number; // 0-10
        engagement: number; // 0-10 (Curiosity gaps, hooks)
        structure: number; // 0-10 (Formatting, headers)
        seo: number; // 0-10
        brandAlignment: number; // 0-10
    };
    feedback: string[]; // Specific actionable feedback for improvement
}
