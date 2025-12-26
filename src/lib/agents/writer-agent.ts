/**
 * WRITER AGENT
 * 
 * Purpose: Writes the newsletter content (text only, no HTML).
 * Takes research data and brand voice to produce 1000+ word engaging content.
 * 
 * Output: Plain text/markdown content structured for the newsletter
 */

import { generateText } from "../ai";
import { BrandData } from "../generator";
import { ResearchOutput } from "./research-agent";

export interface WriterInput {
    brand: BrandData;
    research: ResearchOutput;
    tone: string;
    wordCountMin: number;
}

export interface WriterOutput {
    subjectLines: string[];
    intro: string;
    deepDive: string;
    secondaryArticles: { title: string; content: string }[];
    rapidFire: string[];
    waterCooler: string;
    rawContent: string;
}

const WRITER_PROMPT = `
You are a World-Class Newsletter Writer (e.g., like the writers of Morning Brew, The Hustle, or dense discovery).

## 🛑 BANNED PHRASES (INSTANT FAIL)
DO NOT use these AI clichés. I will reject the output if I see them:
- "In today's fast-paced world..."
- "Let's dive in..."
- "Game-changer"
- "landscape" (unless referring to actual land)
- "In conclusion"
- "stark contrast"
- "delve"

## VOICE & TONE
- **Status**: Smart, Insider, Friend.
- **Tone**: {{tone}}
- **Style**: Short sentences. Punchy. Use "You". Ask questions.
- **Philosophy**: Don't just report news; tell me *why I should care* and *what I should do*.

## 🚨 CRITICAL REQUIREMENT: MINIMUM 1500 WORDS (NON-NEGOTIABLE)
- **HARD MINIMUM**: 1500 words (count ONLY body text, NOT headers or structure).
- **TARGET**: 1800-2000 words.
- **RULE**: If the *body text* is under 1500 words, you have FAILED.
  - Expand the Deep Dive section with detailed examples and data.
  - Expand the "Signals" and "Toolbox" sections.
- **NOTE**: The user expects a "Deep Dive" newsletter. Do NOT skimp on length.
- **NOTE**: This is the {{wordCount}}+ word minimum set by the user.

## WRITING STRUCTURE (9 SECTIONS)

### SECTION 1: SUBJECT LINE
- Generate 3 options.
- Style: Curiosity Gap or High Value.
- Format: "Subject: [Option 1]", "Preheader: [Option 1]"

### SECTION 2: PREHEADER
- One punchy sentence found in the recipient's inbox preview.

### SECTION 3: THE HOOK (Opening)
- **Goal**: Grab attention immediately.
- **Method**: Start with a surprising stat, a bold statement, or a relatable problem.
- **Length**: 80-120 words.
- NO "Welcome to the newsletter". Just start.

### SECTION 4: THE DEEP DIVE (The Meat)
- **Length**: 500-700 words.
- **Structure**:
    1. **The Problem**: What's broken or changing?
    2. **The Shift**: What is the new reality?
    3. **The Analysis**: Back it up with the Research Data provided.
    4. **The Action**: What should the reader do differently?
- **Format**: Use H2/H3 for subheads. Use bullet points for readability.

### SECTION 5: SIGNALS (Curated News)
- **Length**: 250 words.
- **Format**: 3-4 links.
- **Style**: "[Headline] - [One sentence on what happened] + [One sentence on why it matters]."

### SECTION 6: THE TOOLBOX (Resources)
- **Length**: 200 words.
- **Content**: 1 High-value tool/resource + 2 Quick tips.
- **Style**: Practical. "Use this to save 5 hours."

### SECTION 7: WATER COOLER (Fun)
- **Length**: 100 words.
- **Content**: A weird fact, history snippet, or industry meme description.

### SECTION 8: THE ASK (CTA)
- **Length**: 50 words.
- **Content**: One clear Call to Action (e.g., "Reply 'Yes' if...", "Check out our premium...").

### SECTION 9: SECONDARY LINKS
- **Content**: 2-3 standard links (Archive, Socials).

---

## YOUR SOURCE MATERIAL
{{researchData}}

---

## OUTPUT FORMAT (Markdown)

# SECTION 1: SUBJECT LINE
[Selected Subject]

# SECTION 2: PREHEADER
[Selected Preheader]

# SECTION 3: OPENING GREETING & HOOK
[Content...]

# SECTION 4: DEEP-DIVE ARTICLE
## [Title]
[Content...]

# SECTION 5: CURATED LINKS
## Signals
[Content...]

# SECTION 6: QUICK HITS
## Toolbox
[Content...]

# SECTION 7: PERSONAL NOTE
[Content...]

# SECTION 8: PRIMARY CTA
[Content...]

# SECTION 9: SECONDARY LINKS
[Content...]

**FINAL CHECK**: Did you hit 1000 words? Did you avoid "AI-isms"?
`;

export async function executeWriterAgent(input: WriterInput): Promise<WriterOutput> {
    const { brand, research, tone, wordCountMin } = input;

    // Bump the user's min word count to ensure safety
    const safeWordCount = Math.max(wordCountMin, 1500);

    const prompt = WRITER_PROMPT
        .replace(/{{brandName}}/g, brand.name)
        .replace(/{{brandDomain}}/g, brand.domain || 'example.com')
        .replace(/{{tone}}/g, tone || 'witty, smart, and conversational')
        .replace(/{{audience}}/g, brand.audience || 'busy professionals')
        .replace(/{{wordCount}}/g, String(safeWordCount))
        .replace(/{{researchData}}/g, research.rawMarkdown);

    console.log("\n╔══════════════════════════════════════╗");
    console.log("║        AGENT 2: WRITER AGENT         ║");
    console.log("╚══════════════════════════════════════╝");
    console.log(`> Tone: ${tone}`);
    console.log(`> Min Words: ${safeWordCount}`);
    console.log(`> Writing content...`);

    const rawContent = await generateText(prompt);

    // Count words (Exclude headers starting with #)
    const bodyText = rawContent.replace(/^#.*$/gm, '').trim();
    const wordCount = bodyText.split(/\s+/).length;
    console.log(`> Writing Complete. Body Word Payload: ~${wordCount}`);
    console.log(`> Preview:\n${rawContent.substring(0, 400)}...`);

    // Parse content into sections
    const output: WriterOutput = {
        subjectLines: [],
        intro: '',
        deepDive: '',
        secondaryArticles: [],
        rapidFire: [],
        waterCooler: '',
        rawContent
    };

    // Extract subject line (format: # SECTION 1: SUBJECT LINE)
    const subjectMatch = rawContent.match(/#\s*SECTION\s*1[:\s]+SUBJECT\s*LINE[^\n]*\n+([^\n#]+)/i);
    if (subjectMatch) {
        let subject = subjectMatch[1].trim();
        // Remove common prefixes iteratively (handles "Subject: [Option 1] Title")
        while (true) {
            const original = subject;
            subject = subject.replace(/^(Subject:|Option \d+:?|\[Option \d+\]|Subject Line:)\s*/i, "").trim();
            if (subject === original) break;
        }
        // Remove quotes if present
        subject = subject.replace(/^["']|["']$/g, "");
        output.subjectLines = [subject];
    }

    // Extract preheader as second option
    const preheaderMatch = rawContent.match(/#\s*SECTION\s*2[:\s]+PREHEADER[^\n]*\n+([^\n#]+)/i);
    if (preheaderMatch) {
        output.subjectLines.push(preheaderMatch[1].trim());
    }

    // Fallback if no subject found
    if (output.subjectLines.length === 0) {
        output.subjectLines = [`${brand.name} Newsletter`];
    }

    console.log(`> Subject Line: "${output.subjectLines[0]}"`);

    return output;
}
