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
You are the QA Gatekeeper for a premium newsletter. 
Your Job: Find any "AI Slop", Broken Elements, or Spam Triggers.

## BRAND
- Brand: {{brandName}}

## HTML TO ANALYZE (DO NOT REPRODUCE IT)

{{htmlContent}}

## DETECT THESE SPECIFIC FAILURES:
1. **The "Lorem Ipsum" Check**: Look for "Insert text here", "[Date]", "Image Placeholder" (if not styled as such), or "Input content".
2. **Broken Links**: Look for "example.com", "#", or "javascript:void(0)" in main CTAs.
3. **Spam Triggers**: "ACT NOW", "FREE", "CLICK HERE", excessive exclamation marks!!!
4. **Style Consistency**: Are headers using the brand font? (Guess based on inline styles).

## OUTPUT FORMAT (JSON ONLY)
{
  "spamScore": <number 0-100, 0 is perfect, 100 is spam>,
  "issues": [
      "CRITICAL: Found 'Insert text here' in section 3.",
      "WARNING: Primary CTA links to '#'.",
      "INFO: Subject line is 65 chars (optimal is 40-60)."
  ],
  "suggestions": [
      "Replace '#' with actual {{brandDomain}}.",
      "Shorten subject line."
  ]
}

Output ONLY the JSON object.
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
