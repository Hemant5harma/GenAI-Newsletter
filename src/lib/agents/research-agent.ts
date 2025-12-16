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

## SEARCH INSTRUCTIONS
1. Search for the top 5-7 stories related to the category and keywords from the last 24-48 hours.
2. Prioritize stories that would RESONATE with the target audience.
3. Look for unique angles, data points, and expert opinions.
4. Find content from reputable sources (major publications, industry blogs, official announcements).

## OUTPUT STRUCTURE

### MAIN STORY (The Deep Dive)
Select the SINGLE most impactful story. This will be the feature article.
- **Headline**: [Clear, engaging headline]
- **Summary**: 
  - Key Fact 1
  - Key Fact 2
  - Key Fact 3
  - Why it matters to the audience
- **Quotes**: 
  > "Direct quote from source" - Person, Title
- **Source**: [URL]

### SECONDARY STORIES (3 items)
Three other significant stories for shorter coverage.
#### Story 1: [Headline]
- Summary bullet points
- Source: [URL]

#### Story 2: [Headline]
...

#### Story 3: [Headline]
...

### RAPID FIRE (5-6 quick headlines)
Short, punchy headlines with one-sentence summaries.
1. **[Headline]** - One sentence summary.
2. ...

### WATER COOLER MATERIAL
One interesting fact, productivity tip, or conversation starter related to the industry.

---
**IMPORTANT**: Do NOT write the newsletter. Only gather and organize the facts.
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
        rawMarkdown
    };

    // Extract main story headline if present
    const mainMatch = rawMarkdown.match(/### MAIN STORY[\s\S]*?\*\*Headline\*\*:\s*(.+)/i);
    if (mainMatch) {
        output.mainStory.headline = mainMatch[1].trim();
    }

    return output;
}
