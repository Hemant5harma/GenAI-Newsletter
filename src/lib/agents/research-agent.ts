/**
 * RESEARCH AGENT
 * 
 * Purpose: Gathers news, blogs, and resources relevant to the brand's category and audience.
 * Uses brand context (category, audience, keywords, description) to find perfect content sources.
 * 
 * Preferred Model: Gemini (web-enabled) for real-time search
 */

import { generateTextForResearch } from "../ai";
import { BrandData } from "../generator";
import { generateValidatedPalette } from "../colors";

export interface ResearchInput {
    brand: BrandData;
    categories: string[];
    keywords: string[];
    customTopic?: string;
    timeRange?: '24h' | '48h' | 'week' | 'any'; // New parameter
}


export interface ResearchOutput {
    mainStory: StoryData;
    secondaryStories: StoryData[];
    rapidFire: string[];
    rawMarkdown: string;
    colorPalette: {
        primary: string;      // Main brand color for headers
        secondary: string;    // Supporting color for links
        accent: string;       // CTA buttons and highlights
        text: string;         // Body text color
        background: string;   // Background color
    };
}

interface StoryData {
    headline: string;
    summary: string[];
    quotes: string[];
    sourceUrl?: string;
}


const RESEARCH_PROMPT = `
Act as an Expert News Researcher and Investigative Journalist.

## YOUR MISSION
Find the most relevant, impactful, and trustworthy content for a high-quality industry newsletter.
Your goal is not just to "find news" but to uncover **signals** amidst the noise.

## BRAND CONTEXT
- Brand Name: {{brandName}}
- Brand Category: {{category}}
- Target Audience: {{audience}}
- Brand Description: {{description}}
- Focus Keywords: {{keywords}}
{{customTopicSection}}

## 🔴 CRITICAL SEARCH REQUIREMENTS (NON-NEGOTIABLE)

### 1. RECENCY & RELEVANCE (The "Freshness" Rule)
- **Time Window**: Content MUST be from the **{{timeRange}}**.
- **Exception**: If a major industry-shifting event happened slightly outside this window, you may include it, but prioritize freshness.
- **Verification**: Check dates carefully. Do not recycle old news as "new".

### 2. SOURCE QUALITY (The "Authority" Rule)
- **Prioritize**: Primary sources (company blogs, official announcements), reputable industry publications, and recognized experts.
- **Avoid**: Generic content farms, clickbait sites, or superficial "Top 10" listicles without data.
- **Seek**: Data, charts, official quotes, and hard numbers.

### 3. CONTENT DEPTH (The "Insight" Rule)
- Do not just find "what happened". Find **"why it matters"**.
- Look for:
    - **Contrarian views**: Who disagrees with the popular narrative?
    - **Hidden implications**: What does this mean for the next 6 months?
    - **Hard Data**: Percentages, dollar amounts, benchmarks.

## SEARCH STRATEGY
1. **Targeted Queries**: Use specific queries like "{{category}} trends last 24h", "{{keyword}} new release", "analysis of [recent event]".
2. **Cross-Referencing**: If Source A says X, check if Source B confirms it.
3. **Filtering**: Discard press releases that are purely promotional fluff. Look for "Significant Updates".

## OUTPUT STRUCTURE (Markdown)

### MAIN STORY (The Lead)
Select the ONE story that defines the week/day for this industry.
- **Headline**: Punchy, improved headline (don't just copy source).
- **Summary**: 
  - **The "Hook"**: One sentence on what happened.
  - **The "Details"**: 2-3 bullets with specific facts/data.
  - **The "Why It Matters"**: Crucial context for {{audience}}.
- **Key Quote**: "Direct quote" - Author/Speaker.
- **Source**: [Original URL]
- **Date**: [Date]

### SECONDARY STORIES (3 Items)
High-impact stories that support the targeted keywords.
#### 1. [Headline]
- **What**: Brief summary.
- **Why**: One sentence on impact.
- **Source**: [URL]

#### 2. [Headline]
...
#### 3. [Headline]
...

### RAPID FIRE (5-6 Items)
Quick, scannable updates.
- **[Category]**: [Headline] - One sentence takeaway. (Source: [Name])

### INDUSTRY VISUALS (Descriptive)
Describe 1 relevant chart or visual you found (if any) or suggest one.
- **Visual Description**: e.g., "Chart showing 50% rise in X".

### WATER COOLER
One "smart" conversational piece (unexpected stat, history fact, or productivity hack) related to {{category}}.

---

## COLOR PALETTE INSPIRATION
Based on the **mood** of today's news (e.g., Crisis = Red/Black, Growth = Green/Blue, Innovation = Purple/Neon), suggest a palette.

## FINAL CHECKLIST
- [ ] Are all stories < 48 hours old?
- [ ] Did you include "Why it matters" context?
- [ ] Are sources trustworthy?
`;

export async function executeResearchAgent(input: ResearchInput): Promise<ResearchOutput> {
    const { brand, categories, keywords, customTopic, timeRange } = input;

    const category = categories.length > 0 ? categories.join(', ') : brand.category || 'business and technology';
    const keywordList = keywords.length > 0 ? keywords.join(', ') : 'latest news, trends, updates';

    const customTopicSection = customTopic
        ? `\n- **PRIORITY TOPIC**: "${customTopic}" (Focus your research on this topic)`
        : '';

    const timeRangeText = timeRange === 'week' ? 'Last 7 Days'
        : timeRange === 'any' ? 'Any time (prioritize relevance)'
            : timeRange === '24h' ? 'Last 24 Hours'
                : 'Last 48 Hours'; // Default to 48h

    const prompt = RESEARCH_PROMPT
        .replace(/{{brandName}}/g, brand.name)
        .replace(/{{category}}/g, category)
        .replace(/{{audience}}/g, brand.audience || 'general professionals')
        .replace(/{{description}}/g, brand.description || 'A modern brand')
        .replace(/{{keywords}}/g, keywordList)
        .replace(/{{customTopicSection}}/g, customTopicSection)
        .replace(/{{timeRange}}/g, timeRangeText);

    console.log("\n╔══════════════════════════════════════╗");
    console.log("║       AGENT 1: RESEARCH AGENT        ║");
    console.log("╚══════════════════════════════════════╝");
    console.log(`> Brand: ${brand.name}`);
    console.log(`> Category: ${category}`);
    console.log(`> Keywords: ${keywordList}`);
    if (customTopic) console.log(`> Custom Topic: ${customTopic}`);
    console.log(`> Sending research request...`);

    const rawMarkdown = await generateTextForResearch(prompt);

    console.log(`> Research Complete. Received ${rawMarkdown.length} chars.`);
    console.log(`> Preview:\n${rawMarkdown.substring(0, 400)}...`);

    // Generate unique, category-aware color palette PROGRAMMATICALLY
    // This ensures truly unique colors every time, based on brand category
    const generatedPalette = generateValidatedPalette(category);

    // Parse the markdown into structured data (basic parsing)
    const output: ResearchOutput = {
        mainStory: { headline: '', summary: [], quotes: [] },
        secondaryStories: [],
        rapidFire: [],
        rawMarkdown,
        colorPalette: generatedPalette  // Use programmatically generated colors
    };

    // Extract main story headline if present
    const mainMatch = rawMarkdown.match(/### MAIN STORY[\s\S]*?\*\*Headline\*\*:\s*(.+)/i);
    if (mainMatch) {
        output.mainStory.headline = mainMatch[1].trim();
    }

    // NOTE: We no longer parse colors from AI response.
    // Colors are generated programmatically for guaranteed uniqueness.

    console.log(`> Color Palette (Generated): Primary=${output.colorPalette.primary}, Secondary=${output.colorPalette.secondary}, Accent=${output.colorPalette.accent}`);

    return output;
}
