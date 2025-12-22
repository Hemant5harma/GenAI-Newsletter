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
You are a professional NEWSLETTER WRITER. 

**CRITICAL WORD COUNT REQUIREMENT:**
Your output MUST be between 1000-1500 words MINIMUM. 
Count your words before finishing. If under 1000, expand the Deep-Dive section.
This is a HARD requirement - do not submit content under 1000 words.

You are writing a newsletter for {{brandName}}.

## CRITICAL: 9-SECTION STRUCTURE (FOLLOW EXACTLY IN THIS ORDER)

You MUST create content for ALL 9 sections below. This is a NEWSLETTER, not a blog article.
**NOTE: DO NOT include any header or footer content - the Designer handles those automatically.**

---

### SECTION 1: SUBJECT LINE
- Length: 40-60 characters EXACTLY
- Descriptive but intriguing
- Clearly reflect the main topic
- NO clickbait - be direct
- Example: "Scaling AI Backends: 3 Patterns That Work"

### SECTION 2: PREHEADER
- Length: 40-80 characters
- One line that complements subject (not repeats it)
- Summary of what's inside
- Example: "Plus 4 tools to debug latency in production"

### SECTION 3: OPENING GREETING & HOOK (80-120 words)
**Requirements**:
- Start: "Hey [audience]," or similar
- Hook: Reference a recent trend/problem the audience cares about
- List what's in this issue (1-2 sentences or 2-3 bullets)
- Total: 80-120 words

**Example structure**:
"Hey developers,
This week, everyone's talking about [trend]. But here's what most miss: [insight].
In this issue:
• Deep dive: [main topic]
• 4 curated resources on [theme]
• Quick tips for [specific problem]
Let's dive in."

### SECTION 4: FEATURED DEEP-DIVE ARTICLE (400-600 words) **CORE SECTION**
**This is the MAIN content - most important section!**

**Structure**:
- Title (H2 style): Specific, clear
- Intro (1-2 short paragraphs): Explain problem/topic
- 2-4 subsections with subheadings (H3 style)
- Short paragraphs (2-3 sentences each)
- Use bullet lists where helpful
- Include at least one mini example or scenario
- End with "Key Takeaways" (3-5 bullets)

**Content expectations**:
- Explain the problem or context
- Give concrete frameworks, steps, or patterns
- Provide actionable information
- Total: 400-600 words

### SECTION 5: CURATED LINKS / NEWS (200-300 words)
**Title**: "This Week's Signals" or "Links Worth Your Time"

**Include 3-5 items, each with**:
- Title/label (1 line)
- Your commentary (1-2 sentences): what it is and WHY it matters
- NOT just summaries - add your perspective

**Total**: 200-300 words across all items

### SECTION 6: QUICK HITS / TOOLS (150-250 words)
**Include AT LEAST ONE**:

**Option A - Quick Tips**:
- 3-5 bullets
- Each: 1-2 sentences
- Practical, immediately usable

**Option B - Tool of the Week**:
- 1 paragraph (3-4 sentences)
- What it is, why useful, how to try it

**Option C - Code/Pattern Snippet**:
- Brief explanation (no large code dump)
- Describe pattern/trick and when to use

**Total**: 150-250 words

### SECTION 7: PERSONAL NOTE (100-150 words) **RECOMMENDED**
**Build connection with readers**:
- What you're experimenting with
- Behind-the-scenes detail
- Challenge you faced and what you learned
- More personal/opinionated tone

**Total**: 100-150 words

### SECTION 8: PRIMARY CALL-TO-ACTION (CTA)
**ONE clear, specific action**:
- Examples:
  * "Reply with your biggest [problem]"
  * "Join the Discord for live sessions"
  * "Visit {{brandDomain}} for more"
- 1-2 sentences context + CTA line
- ONLY ONE primary CTA (no confusion)

### SECTION 9: SECONDARY LINKS (OPTIONAL)
**2-3 short bullets**:
- Each: Title + 1 sentence explanation
- Examples: blog, product, YouTube, social

---

## WORD COUNT TARGETS (MUST MEET 1000+ TOTAL)

- Greeting & hook: 80-120 words
- **Deep-dive article**: 400-600 words (highest priority)
- Curated links: 200-300 words
- Quick hits/tools: 150-250 words
- Personal note: 100-150 words
- CTA: 50-80 words

**TOTAL TARGET: 1000-1300 words**

**ABSOLUTE MINIMUM: 1000 WORDS** - Count your output! 
If under 1000, add more depth to the Deep-Dive section.

---

## WRITING STYLE RULES

**Tone**:
- Clear, direct, expert but friendly
- NO fluff - every paragraph teaches, updates, or motivates
- Use "you" to address reader
- Conversational

**Formatting**:
- Paragraphs: 2-3 sentences (rarely more)
- Use bullet points for lists, steps, recommendations
- Descriptive headings that reveal content
- Keep terminology consistent

---

## YOUR SOURCE MATERIAL
{{researchData}}

---

## OUTPUT FORMAT

Provide content for ALL 9 SECTIONS in markdown format.
**DO NOT include any header or footer - the Designer Agent adds those automatically.**

# SECTION 1: SUBJECT LINE
[40-60 char subject]

# SECTION 2: PREHEADER
[40-80 char preheader]

# SECTION 3: OPENING GREETING & HOOK
[80-120 words]

# SECTION 4: DEEP-DIVE ARTICLE
## [Article Title]
[400-600 words with subsections]

### Key Takeaways
- [bullet 1]
- [bullet 2]
- [bullet 3]

# SECTION 5: CURATED LINKS
## This Week's Signals
[3-5 items, 200-300 words total]

# SECTION 6: QUICK HITS
## [Quick Tips / Tool of Week / Code Corner]
[150-250 words]

# SECTION 7: PERSONAL NOTE
[100-150 words]

# SECTION 8: PRIMARY CTA
[Call to action]

# SECTION 9: SECONDARY LINKS
[Optional 2-3 bullets]

**CRITICAL**: Include ALL 9 sections. Hit 1000+ word target. Use conversational tone. Short paragraphs.
**DO NOT write any header or footer content.**
`;

export async function executeWriterAgent(input: WriterInput): Promise<WriterOutput> {
    const { brand, research, tone, wordCountMin } = input;

    const prompt = WRITER_PROMPT
        .replace(/{{brandName}}/g, brand.name)
        .replace(/{{brandDomain}}/g, brand.domain || 'example.com')
        .replace(/{{tone}}/g, tone || 'witty, smart, and conversational')
        .replace(/{{audience}}/g, brand.audience || 'busy professionals')
        .replace(/{{wordCount}}/g, String(wordCountMin))
        .replace(/{{researchData}}/g, research.rawMarkdown);

    console.log("\n╔══════════════════════════════════════╗");
    console.log("║        AGENT 2: WRITER AGENT         ║");
    console.log("╚══════════════════════════════════════╝");
    console.log(`> Tone: ${tone}`);
    console.log(`> Min Words: ${wordCountMin}`);
    console.log(`> Writing content...`);

    const rawContent = await generateText(prompt);

    // Count words
    const wordCount = rawContent.split(/\s+/).length;
    console.log(`> Writing Complete. Word count: ~${wordCount}`);
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
        output.subjectLines = [subjectMatch[1].trim()];
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
