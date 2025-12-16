import { generateText } from "../ai";
import { QualityReport } from "./types";
import { BrandData } from "../generator"; // We might need to export this or move types

// Initial stub for dependencies if we don't have them
// import fleschKincaid from 'flesch-kincaid'; 

export class QualityScorer {

    /**
     * Scores the newsletter based on multiple dimensions.
     */
    async scoreNewsletter(htmlContent: string, brand: any): Promise<QualityReport> {

        // 1. LLM Evaluation for subjective metrics (Engagement, Brand Alignment)
        const llmReport = await this.llmEvaluate(htmlContent, brand);

        // 2. Heuristic Evaluation for objective metrics (Readability, Structure)
        const heuristicReport = this.heuristicEvaluate(htmlContent);

        // 3. Combine Scores
        const metrics = {
            readability: heuristicReport.readability,
            structure: heuristicReport.structure,
            seo: heuristicReport.seo, // Placeholder logic
            engagement: llmReport.engagement,
            brandAlignment: llmReport.brandAlignment
        };

        const overallScore = Math.round(
            (metrics.readability * 1.5 +
                metrics.structure * 1.5 +
                metrics.engagement * 3.0 +
                metrics.brandAlignment * 3.0 +
                metrics.seo * 1.0)
            / 10 // Weighted Average normalized to 0-10 then * 10 for 100 scale? 
            // Sum of weights = 10. Max score = 100.
        ) * 10;

        // Correction: (Sum(Score * Weight) / Sum(Weights)) * 10
        const weightedSum =
            metrics.readability * 1.5 +
            metrics.structure * 1.5 +
            metrics.engagement * 3.0 +
            metrics.brandAlignment * 3.0 +
            metrics.seo * 1.0;

        const finalScore = Math.round((weightedSum / 10) * 10); // Result is 0-100

        return {
            overallScore: finalScore,
            metrics,
            feedback: llmReport.feedback
        };
    }

    private heuristicEvaluate(html: string) {
        const text = html.replace(/<[^>]*>?/gm, ' ');
        const wordCount = text.split(/\s+/).length;

        // Readability (Proxy: Sentence length / Word complexity)
        // Simple implementation: Avg word length < 6, Avg sent length < 20
        const sentences = text.split(/[.!?]+/);
        const avgSentLength = wordCount / (sentences.length || 1);
        let readability = 10;
        if (avgSentLength > 20) readability -= 2;
        if (avgSentLength > 30) readability -= 3;

        // Structure (Headers, Lists)
        let structure = 5; // Base
        if (html.includes('<h1') || html.includes('<h2')) structure += 2;
        if (html.includes('<ul>') || html.includes('<ol')) structure += 2;
        if (html.includes('<b>') || html.includes('<strong>')) structure += 1;

        // SEO (Title, Alt tags)
        let seo = 5;
        if (html.includes('<!-- SUBJECT:')) seo += 3;
        if (html.includes('<!-- PREHEADER:')) seo += 2;

        return { readability, structure, seo };
    }

    private async llmEvaluate(html: string, brand: any) {
        const prompt = `
      You are a Senior Editor. Grade this newsletter draft.
      
      BRAND: ${brand.name}
      TONE: ${brand.tone}
      
      CONTENT:
      ${html.substring(0, 15000)}
      
      EVALUATE AND RETURN JSON ONLY:
      {
        "engagement": 0-10 (Curiosity gaps? Hooks? Boring?),
        "brandAlignment": 0-10 (Does it sound like the brand tone?),
        "feedback": ["Critical issue 1", "Suggestion 2"]
      }
    `;

        try {
            const jsonStr = await generateText(prompt);
            const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error("LLM Evaluation Failed", e);
            return { engagement: 5, brandAlignment: 5, feedback: ["Scoring failed"] };
        }
    }
}
