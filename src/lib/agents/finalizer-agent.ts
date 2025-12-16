/**
 * FINALIZER AGENT
 * 
 * Purpose: Quality analysis for the newsletter (ANALYZE ONLY - does not regenerate HTML)
 * - Spam content detection
 * - Accessibility check
 * - Quality scoring
 * 
 * IMPORTANT: This agent PRESERVES the original HTML and only adds a quality report.
 * It does NOT ask the AI to regenerate the HTML to avoid truncation issues.
 */

import { generateText } from "../ai";
import { BrandData } from "../generator";
import { DesignerOutput } from "./designer-agent";

export interface FinalizerInput {
    brand: BrandData;
    design: DesignerOutput;
}

export interface FinalizerOutput {
    html: string;
    subject: string;
    preheader: string;
    qualityReport: {
        spamScore: number; // 0-100, lower is better
        issues: string[];
        improvements: string[];
    };
}

const ANALYSIS_PROMPT = `
You are an Email Deliverability Expert. Analyze this newsletter HTML and provide a quality report.

## BRAND
- Brand: {{brandName}}

## HTML TO ANALYZE (DO NOT REPRODUCE IT)

{{htmlContent}}

## YOUR TASK
Analyze the HTML above and provide ONLY a JSON report. Do NOT output any HTML.

Check for:
1. SPAM TRIGGERS: ALL CAPS, excessive punctuation, spammy phrases
2. ACCESSIBILITY: alt text, font sizes, color contrast
3. STRUCTURE: proper DOCTYPE, responsive design, valid HTML

## OUTPUT FORMAT (JSON ONLY)
{
  "spamScore": <number 0-100, lower is better>,
  "issues": ["issue1", "issue2"],
  "suggestions": ["suggestion1", "suggestion2"]
}

Output ONLY the JSON object, nothing else.
`;

export async function executeFinalizerAgent(input: FinalizerInput): Promise<FinalizerOutput> {
    const { brand, design } = input;

    console.log("\\n╔══════════════════════════════════════╗");
    console.log("║      AGENT 4: FINALIZER AGENT        ║");
    console.log("╚══════════════════════════════════════╝");
    console.log(`> Analyzing HTML quality (preserving original)...`);

    let qualityReport = {
        spamScore: 0,
        issues: [] as string[],
        improvements: [] as string[]
    };

    try {
        // Only analyze - don't regenerate HTML
        const analysisPrompt = ANALYSIS_PROMPT
            .replace(/{{brandName}}/g, brand.name)
            .replace(/{{htmlContent}}/g, design.html.substring(0, 5000)); // Only send first 5K chars for analysis

        const analysisResponse = await generateText(analysisPrompt);

        // Try to parse JSON response
        const jsonMatch = analysisResponse.match(/\\{[\\s\\S]*\\}/);
        if (jsonMatch) {
            try {
                const parsed = JSON.parse(jsonMatch[0]);
                qualityReport.spamScore = parsed.spamScore || 0;
                qualityReport.issues = parsed.issues || [];
                qualityReport.improvements = parsed.suggestions || [];
            } catch {
                console.log("> Could not parse quality report, using defaults.");
            }
        }
    } catch (error) {
        console.log("> Quality analysis failed, continuing with original HTML.");
    }

    console.log(`> Spam Score: ${qualityReport.spamScore}/100 (lower is better)`);
    console.log(`> Issues Found: ${qualityReport.issues.length}`);
    console.log(`> Original HTML preserved: ${design.html.length} chars.`);

    // CRITICAL: Return the ORIGINAL HTML from Designer, not regenerated
    const output: FinalizerOutput = {
        html: design.html, // Keep original!
        subject: design.subject,
        preheader: design.preheader,
        qualityReport
    };

    return output;
}
