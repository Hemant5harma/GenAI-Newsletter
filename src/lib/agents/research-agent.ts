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
- Primary: #[HEX CODE] (main brand color)
- Secondary: #[HEX CODE] (links, supporting elements)
- Accent: #[HEX CODE] (CTAs, highlights)
- Text: #1f2937 or darker (body text - must be readable)
- Background: #ffffff or light tint (page background)

**COLOR STYLE: PROFESSIONAL & SOBER**
Newsletters require MUTED, PROFESSIONAL colors - NOT vibrant or flashy.

Example palettes (pick from these styles):
- **Corporate Blue**: Primary #1E3A5F (dark navy), Secondary #4A6FA5 (muted blue), Accent #2D5A3D (forest)
- **Executive Gray**: Primary #374151 (charcoal), Secondary #6B7280 (slate), Accent #047857 (muted green)
- **Professional Teal**: Primary #115E59 (deep teal), Secondary #0F766E (teal), Accent #B45309 (muted amber)
- **Classic Navy**: Primary #1E3A8A (navy), Secondary #3B5998 (muted blue), Accent #7C3AED (muted purple)
- **Warm Professional**: Primary #78350F (brown), Secondary #92400E (amber-brown), Accent #065F46 (emerald)

**RULES:**
1. Use DARK, MUTED primary colors (saturation 40-60%, not 100%)
2. NO bright neons, hot pinks, electric blues
3. Colors should feel like a professional email, not a party invite
4. Think: Banks, Law firms, Corporate brands
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
