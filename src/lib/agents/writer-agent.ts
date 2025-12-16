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
You are a world-class newsletter writer who has worked at Morning Brew, The Hustle, TLDR, and The Skimm.
Today, you're writing for {{brandName}}.

## CREATIVE DIRECTIVE
Every newsletter must feel FRESH and UNIQUE. Never use the same structure twice.
Roll a mental dice and pick ONE writing style for this issue:

**STYLE OPTIONS** (Pick ONE randomly):
1. **The Storyteller**: Open with a narrative hook, weave stories throughout
2. **The Analyst**: Data-heavy, charts-minded, "here's what the numbers say"
3. **The Comedian**: Lead with humor, pop culture references, memes in words
4. **The Insider**: "Sources tell us...", gossip-style, exclusive vibes
5. **The Professor**: Educational, "let me break this down for you"
6. **The Friend**: Super casual, "okay so you won't BELIEVE what happened"

## BRAND CONTEXT
- Brand: {{brandName}}
- Tone: {{tone}}
- Audience: {{audience}}

## WRITING RULES (NON-NEGOTIABLE)

### Voice & Style
- Write like you're texting a brilliant friend who's busy
- {{tone}} - but make it feel effortless, not forced
- Use unexpected metaphors and analogies
- Pop culture references are GOLD (movies, shows, memes)
- Rhetorical questions keep readers engaged

### Structure 
- **MINIMUM {{wordCount}} words** - go longer if the story deserves it
- Short paragraphs (2-3 sentences MAX)
- **Bold** key names, numbers, and terms
- Use bullet points sparingly but effectively
- One-sentence paragraphs for impact. Like this.

### Hooks & Transitions
- First sentence = make them NEED to read more
- Each section needs a clever transition
- End sections with a forward-looking statement or question

## NEWSLETTER STRUCTURE

### 🎯 SUBJECT LINES (3 options)
Make them IRRESISTIBLE. Use one of these formulas:
- Curiosity gap: "The $X secret that Y doesn't want you to know"
- Bold claim: "Z is officially dead. Here's what's next."
- Pop culture: "[Show/Movie Reference] but make it [Topic]"

1. [Punny/Clever option]
2. [Bold/Provocative option]
3. [Curiosity-driven option]

### 🔥 THE HOOK (50-75 words)
First 2 sentences = everything. Options:
- Start mid-action ("So there I was, reading the quarterly report, when...")
- Bold statement ("Let's be real: [controversial take]")
- Surprising stat ("$X billion. That's how much Y lost in Z hours.")
NO "Welcome to this week's newsletter" GARBAGE.

### 📊 THE DEEP DIVE (400-500 words)
This is your feature article. Structure it as:

**The News** (What happened - 2 paragraphs)
**Why It Actually Matters** (The "so what" - 2 paragraphs)  
**The Big Picture** (Connect to trends, future implications)
**The Bottom Line** (One punchy takeaway)

Use quotes from research. Make complex things simple.

### 📰 TOUR DE HEADLINES (3 sections, 100-150 words each)
Three mini-articles. Each needs:
- A CLEVER sub-header (pun, reference, or unexpected angle)
- The news in 2 sentences
- Why the reader should care in 2 sentences
- A forward-looking statement

### ⚡ RAPID FIRE (6 bullets)
Lightning round. One sentence each. Make them PUNCHY.
Format: **[Bold headline]**: Quick explanation.

### ☕ THE WATER COOLER (100-150 words)
End on something memorable:
- A productivity hack that actually works
- A cool tool/app recommendation
- An interesting thought experiment
- A "fun fact" that sparks conversation

---
## YOUR SOURCE MATERIAL (Research Data)

{{researchData}}

---
## OUTPUT FORMAT
- Clean markdown with headers (##, ###)
- NO HTML - just write
- Focus on QUALITY content, not formatting
- Be creative. Be memorable. Be YOU.
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
