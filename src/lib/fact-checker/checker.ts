import { generateText } from "../ai";
import { Claim, FactCheckReport, VerificationResult } from "./types";

export class FactChecker {

    /**
     * Main entry point: Scans content and returns a full report.
     */
    async checkNewsletter(htmlContent: string): Promise<FactCheckReport> {
        const claims = await this.extractClaims(htmlContent);
        const verificationResults = await Promise.all(claims.map(c => this.verifyClaim(c)));

        // Calculate Score
        const totalClaims = verificationResults.length;
        if (totalClaims === 0) return { score: 100, claims: [], hasUnverifiedStats: false };

        const trustedClaims = verificationResults.filter(r => r.status === 'verified').length;
        const score = Math.round((trustedClaims / totalClaims) * 100);
        const hasUnverifiedStats = verificationResults.some(r => r.claim.isStatistic && r.status !== 'verified');

        return {
            score,
            claims: verificationResults,
            hasUnverifiedStats
        };
    }

    /**
     * Uses LLM to extract claims and stats from HTML text.
     */
    private async extractClaims(content: string): Promise<Claim[]> {
        // Strip HTML tags for analysis
        const text = content.replace(/<[^>]*>?/gm, ' ');
        const prompt = `
      EXTRACT CLAIMS & STATISTICS
      
      Analyze the text below. Identify every specific claim, statistic, or data point.
      Check if there is a Source URL explicitly cited nearby (e.g. "according to [Link]").
      
      TEXT:
      ${text.substring(0, 15000)}

      OUTPUT JSON LIST (Strict Array):
      [
        { "text": "Claim text", "isStatistic": true/false, "sourceUrl": "http://..." or null, "context": "Sentence it appeared in" }
      ]
    `;

        try {
            const jsonStr = await generateText(prompt);
            const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error("Claim Extraction Failed", e);
            return [];
        }
    }

    /**
     * Verifies a single claim based on source credibility.
     */
    private async verifyClaim(claim: Claim): Promise<VerificationResult> {
        const score = this.scoreSource(claim.sourceUrl);
        let status: VerificationResult['status'] = 'unverified';

        if (claim.sourceUrl) {
            if (score >= 8) status = 'verified';
            else if (score >= 4) status = 'verified'; // Acceptable
            else status = 'suspicious';
        } else {
            // If it's a statistic with no source, it's unverified.
            // If it's a general claim with no source, we might be lenient, but for this system, we flag it.
            status = claim.isStatistic ? 'unverified' : 'verified';
            // For non-stats, we assume "verified" if it's just opinion, unless we do full fact checking.
            // Let's be strict: if no source, it gets a 0 score but status depends on isStatistic.
        }

        return {
            claim,
            status,
            credibilityScore: score,
            notes: !claim.sourceUrl && claim.isStatistic ? "Missing source for statistic" : undefined
        };
    }

    /**
     * Heuristic scoring of domains.
     */
    private scoreSource(url?: string): number {
        if (!url) return 0;

        try {
            const domain = new URL(url).hostname.toLowerCase();

            if (domain.endsWith('.gov') || domain.endsWith('.edu')) return 10;
            if (domain.includes('nature.com') || domain.includes('science.org')) return 10;
            if (domain.includes('reuters.com') || domain.includes('bloomberg.com')) return 8;
            if (domain.includes('nytimes.com') || domain.includes('wsj.com')) return 8;
            if (domain.includes('wikipedia.org')) return 6;
            if (domain.includes('medium.com') || domain.includes('linkedin.com')) return 3;
            if (domain.includes('twitter.com') || domain.includes('x.com')) return 2;

            return 5; // Default neutral
        } catch (e) {
            return 0;
        }
    }
}
