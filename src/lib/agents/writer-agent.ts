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

## CRITICAL: 11-SECTION STRUCTURE (FOLLOW EXACTLY IN THIS ORDER)

You MUST create content for ALL 11 sections below. This is a NEWSLETTER, not a blog article.

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

### SECTION 3: HEADER AREA
**CRITICAL: Output ONLY the brand name and date - NO "Newsletter" text, NO domain!**

- Output format: "{{brandName}} | [Date]"
- Example: "eloancompare | December 17, 2025"
- The Designer will handle the visual presentation (colored bar, styling, etc.)
- Just provide the text content here
- NO domain name (no .com, .io, etc.)
- NO extra text like "Newsletter" or "Weekly" - just brand name + date

### SECTION 4: OPENING GREETING & HOOK (80-120 words)
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

### SECTION 5: FEATURED DEEP-DIVE ARTICLE (400-600 words) **CORE SECTION**
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

### SECTION 6: CURATED LINKS / NEWS (200-300 words)
**Title**: "This Week's Signals" or "Links Worth Your Time"

**Include 3-5 items, each with**:
- Title/label (1 line)
- Your commentary (1-2 sentences): what it is and WHY it matters
- NOT just summaries - add your perspective

**Total**: 200-300 words across all items

### SECTION 7: QUICK HITS / TOOLS (150-250 words)
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

### SECTION 8: PERSONAL NOTE (100-150 words) **RECOMMENDED**
**Build connection with readers**:
- What you're experimenting with
- Behind-the-scenes detail
- Challenge you faced and what you learned
- More personal/opinionated tone

**Total**: 100-150 words

### SECTION 9: PRIMARY CALL-TO-ACTION (CTA)
**ONE clear, specific action**:
- Examples:
  * "Reply with your biggest [problem]"
  * "Join the Discord for live sessions"
  * "Visit {{brandDomain}} for more"
- 1-2 sentences context + CTA line
- ONLY ONE primary CTA (no confusion)

### SECTION 10: SECONDARY LINKS (OPTIONAL)
**2-3 short bullets**:
- Each: Title + 1 sentence explanation
- Examples: blog, product, YouTube, social

### SECTION 11: FOOTER
**Include**:
- Brand name: {{brandName}}
- Website: {{brandDomain}}
- Social links (mention platforms)
- "Unsubscribe or manage preferences"
- Keep concise

---

## WORD COUNT TARGETS (MUST MEET 1000+ TOTAL)

- Greeting & hook: 80-120 words
- **Deep-dive article**: 400-600 words (highest priority)
- Curated links: 200-300 words
- Quick hits/tools: 150-250 words
- Personal note: 100-150 words
- CTA + footer: 80-120 words combined

**TOTAL TARGET: 1000-1300 words**

?? **ABSOLUTE MINIMUM: 1000 WORDS** - Count your output! 
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

Provide content for ALL 11 SECTIONS in markdown format:

\`\`\`markdown
# SECTION 1: SUBJECT LINE
[40-60 char subject]

# SECTION 2: PREHEADER
[40-80 char preheader]

# SECTION 3: HEADER
{{brandName}} | [Date]

# SECTION 4: OPENING GREETING & HOOK
[80-120 words]

# SECTION 5: DEEP-DIVE ARTICLE
## [Article Title]
[400-600 words with subsections]

### Key Takeaways
- [bullet 1]
- [bullet 2]
- [bullet 3]

# SECTION 6: CURATED LINKS
## This Week's Signals
[3-5 items, 200-300 words total]

# SECTION 7: QUICK HITS
## [Quick Tips / Tool of Week / Code Corner]
[150-250 words]

# SECTION 8: PERSONAL NOTE
[100-150 words]

# SECTION 9: PRIMARY CTA
[Call to action]

# SECTION 10: SECONDARY LINKS
[Optional 2-3 bullets]

# SECTION 11: FOOTER
{{brandName}} | {{brandDomain}} | Unsubscribe
\`\`\`

**CRITICAL**: Include ALL 11 sections. Hit 1000+ word target. Use conversational tone. Short paragraphs.
`;



export async function executeWriterAgent(input: WriterInput): Promise<WriterOutput> {
    const { brand, research, tone, wordCountMin } = input;

    const prompt = WRITER_PROMPT
        .replace(/{{brandName}}/g, brand.name)
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

    // Parse content into sections (basic extraction)
    const output: WriterOutput = {
        subjectLines: [],
        intro: '',
        deepDive: '',
        secondaryArticles: [],
        rapidFire: [],
        waterCooler: '',
        rawContent
    };

    // Extract subject lines
    const subjectMatch = rawContent.match(/### SUBJECT LINES[\s\S]*?1\.\s*(.+?)[\r\n]+2\.\s*(.+?)[\r\n]+3\.\s*(.+?)[\r\n]/i);
    if (subjectMatch) {
        output.subjectLines = [subjectMatch[1].trim(), subjectMatch[2].trim(), subjectMatch[3].trim()];
    }

    return output;
}
