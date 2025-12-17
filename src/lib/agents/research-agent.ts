/**
 * RESEARCH AGENT
 * 
 * Purpose: Gathers news, blogs, and resources relevant to the brand's category and audience.
 * Uses brand context (category, audience, keywords, description) to find perfect content sources.
 * 
 * Preferred Model: Perplexity (web-enabled) for real-time search
 */

import { generateTextForResearch } from "../ai";
import { BrandData } from "../generator";

export interface ResearchInput {
    brand: BrandData;
    categories: string[];
    keywords: string[];
    customTopic?: string; // Optional user-provided topic
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
Act as an Expert News Researcher and Content Curator.

## YOUR MISSION
Find the most relevant, engaging, and newsworthy content for a newsletter targeting a specific audience.

## BRAND CONTEXT (Use this to find RELEVANT content)
- Brand Name: {{brandName}}
- Brand Category: {{category}}
- Target Audience: {{audience}}
- Brand Description: {{description}}
- Focus Keywords: {{keywords}}
{{customTopicSection}}

## 🔴 CRITICAL SEARCH REQUIREMENTS (NON-NEGOTIABLE)

### RECENCY REQUIREMENT (MOST IMPORTANT):
**CRITICAL: Content MUST be from the last 24-48 hours.**
- Search for news from TODAY and YESTERDAY only
- Reject any stories older than 2 days (48 hours)
- Check publication dates/timestamps carefully
- If you cannot find 24-48 hour content, search for "last 24 hours [category] news"

### CATEGORY & KEYWORD FOCUS:
**Search specifically for: {{category}} + {{keywords}} + brand description themes**
- Prioritize {{category}} industry news
- Use {{keywords}} as primary search terms
- Align with {{description}} mission/focus
- Target {{audience}} interests

### Search Query Format:
"{{category}} {{keywords}} news [current date]"
"latest {{category}} news last 24 hours"
"{{keywords}} breaking news [today's date]"

## SEARCH INSTRUCTIONS
1. **Search for 5-7 stories from the LAST 24-48 HOURS** related to category and keywords
2. **Verify publication dates** - must be within last 2 days
3. Prioritize stories that would RESONATE with {{audience}}
4. Look for unique angles, data points, and expert opinions
5. Find content from reputable sources (major publications, industry blogs, official announcements)
6. **If no recent content found**, search more broadly but STILL prioritize recency

## OUTPUT STRUCTURE

### MAIN STORY (The Deep Dive)
Select the SINGLE most impactful story FROM LAST 24-48 HOURS.
- **Headline**: [Clear, engaging headline]
- **Summary**: 
  - Key Fact 1
  - Key Fact 2
  - Key Fact 3
  - Why it matters to the audience
- **Quotes**: 
  > "Direct quote from source" - Person, Title
- **Source**: [URL]
- **Date Published**: [Must be within last 48 hours]

### SECONDARY STORIES (3 items)
Three other significant stories from LAST 24-48 HOURS.
#### Story 1: [Headline]
- Summary bullet points
- Source: [URL]
- Date: [Within last 48 hours]

#### Story 2: [Headline]
...

#### Story 3: [Headline]
...

### RAPID FIRE (5-6 quick headlines)
Short, punchy headlines from LAST 24-48 HOURS with one-sentence summaries.
1. **[Headline]** - One sentence summary. (Published: [date])
2. ...

### WATER COOLER MATERIAL
One interesting fact, productivity tip, or conversation starter related to the industry.

---

## COLOR PALETTE SUGGESTION
Based on the content theme, industry, and mood, suggest a cohesive 5-color palette in HEX format:

**Guidelines by Industry:**
- Tech/Software: Blues, teals (professional, trust)
- Finance/Business: Greens, navy (growth, stability)
- Creative/Design: Vibrant, bold colors (energy, creativity)
- Health/Wellness: Greens, soft blues (calm, health)
- News/Media: Reds, blacks (urgency, authority)

**Output Format:**
COLOR PALETTE:
- Primary: #1e3a8a (main headers, brand color)
- Secondary: #3b82f6 (links, supporting elements)
- Accent: #10b981 (CTAs, highlights)
- Text: #1f2937 (body text - must be dark for readability)
- Background: #ffffff (page background)

Choose colors that:
1. Match the content mood and industry
2. Have good contrast for readability
3. Work well together as a cohesive palette
4. Feel professional for email newsletters

---
**IMPORTANT REMINDERS**:
1. Do NOT write the newsletter. Only gather and organize the facts.
2. ALL content must be from LAST 24-48 HOURS
3. Focus on {{category}} and {{keywords}}
4. Verify publication dates
5. Provide complete color palette
`;

export async function executeResearchAgent(input: ResearchInput): Promise<ResearchOutput> {
    const { brand, categories, keywords, customTopic } = input;

    const category = categories.length > 0 ? categories.join(', ') : brand.category || 'business and technology';
    const keywordList = keywords.length > 0 ? keywords.join(', ') : 'latest news, trends, updates';

    const customTopicSection = customTopic
        ? `\n- **PRIORITY TOPIC**: "${customTopic}" (Focus your research on this topic)`
        : '';

    const prompt = RESEARCH_PROMPT
        .replace(/{{brandName}}/g, brand.name)
        .replace(/{{category}}/g, category)
        .replace(/{{audience}}/g, brand.audience || 'general professionals')
        .replace(/{{description}}/g, brand.description || 'A modern brand')
        .replace(/{{keywords}}/g, keywordList)
        .replace(/{{customTopicSection}}/g, customTopicSection);

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

    // Parse the markdown into structured data (basic parsing)
    const output: ResearchOutput = {
        mainStory: { headline: '', summary: [], quotes: [] },
        secondaryStories: [],
        rapidFire: [],
        rawMarkdown,
        colorPalette: {
            primary: '#1e3a8a',     // Default blue
            secondary: '#3b82f6',   // Default light blue
            accent: '#10b981',      // Default green
            text: '#1f2937',        // Default dark gray
            background: '#ffffff'   // Default white
        }
    };

    // Extract main story headline if present
    const mainMatch = rawMarkdown.match(/### MAIN STORY[\s\S]*?\*\*Headline\*\*:\s*(.+)/i);
    if (mainMatch) {
        output.mainStory.headline = mainMatch[1].trim();
    }

    // Extract color palette
    const primaryMatch = rawMarkdown.match(/Primary:\s*(#[0-9a-fA-F]{6})/i);
    const secondaryMatch = rawMarkdown.match(/Secondary:\s*(#[0-9a-fA-F]{6})/i);
    const accentMatch = rawMarkdown.match(/Accent:\s*(#[0-9a-fA-F]{6})/i);
    const textMatch = rawMarkdown.match(/Text:\s*(#[0-9a-fA-F]{6})/i);
    const bgMatch = rawMarkdown.match(/Background:\s*(#[0-9a-fA-F]{6})/i);

    if (primaryMatch) output.colorPalette.primary = primaryMatch[1];
    if (secondaryMatch) output.colorPalette.secondary = secondaryMatch[1];
    if (accentMatch) output.colorPalette.accent = accentMatch[1];
    if (textMatch) output.colorPalette.text = textMatch[1];
    if (bgMatch) output.colorPalette.background = bgMatch[1];

    console.log(`> Color Palette: Primary=${output.colorPalette.primary}, Accent=${output.colorPalette.accent}`);

    return output;
}
