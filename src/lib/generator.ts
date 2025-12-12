import { generateText } from "./ai";
import { db } from "./db";

interface GenerationSettings {
    images: { mode: 'random' | 'manual'; urls: string[] };
    linksCount: { mode: 'random' | 'manual'; count: number };
    categories: { mode: 'random' | 'manual'; list: string[] };
    content: { mode: 'random' | 'manual'; text: string };
    keywords: string[];
    colors: { mode: 'random' | 'manual'; primary: string; secondary: string; preset?: string };
    contentSize: 'small' | 'medium' | 'large';
    editorMode: 'html' | 'blocks';
}

const defaultSettings: GenerationSettings = {
    images: { mode: 'random', urls: [] },
    linksCount: { mode: 'random', count: 4 },
    categories: { mode: 'random', list: [] },
    content: { mode: 'random', text: '' },
    keywords: [],
    colors: { mode: 'random', primary: '#6366f1', secondary: '#8b5cf6' },
    contentSize: 'medium',
    editorMode: 'html',
};

interface BrandData {
    name: string;
    category: string | null;
    tone: string | null;
    audience: string | null;
    description: string | null;
    tagline: string | null;
    domain: string | null;
}

export async function generateNewsletterForBrand(brandId: string): Promise<string> {
    const brand = await db.brand.findUnique({ where: { id: brandId } });
    if (!brand) throw new Error("Brand not found");

    console.log("=== GENERATION START ===");
    console.log("Brand:", brand.name);
    console.log("Brand Settings:", JSON.stringify(brand.settings, null, 2));

    const settings = brand.settings ? (brand.settings as unknown as GenerationSettings) : defaultSettings;

    const issue = await db.issue.create({
        data: { brandId: brand.id, status: "GENERATING" }
    });

    try {
        const prompt = buildPrompt(brand, settings);
        console.log("=== PROMPT SENT ===");
        console.log(prompt.substring(0, 500) + "...");

        const htmlContent = await generateText(prompt);
        if (!htmlContent) throw new Error("AI returned empty response");

        // Extract subject and preheader from HTML comments if present
        const subjectMatch = htmlContent.match(/<!--\s*SUBJECT:\s*(.+?)\s*-->/i);
        const preheaderMatch = htmlContent.match(/<!--\s*PREHEADER:\s*(.+?)\s*-->/i);

        const subject = subjectMatch ? subjectMatch[1] : `${brand.name} Newsletter`;
        const preheader = preheaderMatch ? preheaderMatch[1] : "Your latest updates";

        // Store the full HTML
        await db.issue.update({
            where: { id: issue.id },
            data: {
                subject,
                preheader,
                htmlContent,
                status: "DRAFT"
            }
        });

        // If blocks mode is selected, create default content blocks
        /* Block generation disabled
        if (settings.editorMode === 'blocks') {
           // ... block creation code
        }
        */

        console.log("=== GENERATION COMPLETE ===");
        return issue.id;

    } catch (error) {
        console.error("Generation failed:", error);
        await db.issue.update({ where: { id: issue.id }, data: { status: "FAILED" } });
        throw error;
    }
}

function buildPrompt(brand: BrandData, settings: GenerationSettings): string {
    const seed = Date.now();
    const linksCount = settings.linksCount.mode === 'manual' ? settings.linksCount.count : Math.floor(Math.random() * 3) + 3;

    // Get colors
    const primaryColor = settings.colors.mode === 'manual' ? settings.colors.primary : '#6366f1';
    const secondaryColor = settings.colors.mode === 'manual' ? settings.colors.secondary : '#8b5cf6';

    // Get categories
    const categories = settings.categories.mode === 'manual' && settings.categories.list.length > 0
        ? settings.categories.list.join(', ')
        : brand.category || 'general updates';

    // Get content size instructions
    const contentSizeInstructions = {
        small: 'Keep content BRIEF and SCANNABLE. Use 2-3 short paragraphs per section. Focus on key points only.',
        medium: 'Use STANDARD newsletter depth. Include 3-5 paragraphs per section with good detail.',
        large: 'Create COMPREHENSIVE, DETAILED content. Write 5-7+ paragraphs per section with in-depth information.'
    }[settings.contentSize || 'medium'];

    const prompt = `You are AutoNewsletter, an expert email designer creating UNIQUE HTML newsletters.

BRAND CONFIGURATION:
- Brand Name: "${brand.name}"
- Website: ${brand.domain || 'https://example.com'}
- Tagline: "${brand.tagline || ''}"
- Mission: ${brand.description || 'Delivering value to subscribers'}
- Category: ${categories}
- Tone: ${brand.tone || 'professional, engaging'}
- Target Audience: ${brand.audience || 'general subscribers'}

DESIGN CONFIGURATION:
- Primary Color: ${primaryColor}
- Secondary Color: ${secondaryColor}
- Number of Content Sections: ${linksCount}

CONTENT SIZE REQUIREMENT:
${contentSizeInstructions}

${settings.content.mode === 'manual' && settings.content.text ? `
USER PROVIDED CONTENT (HIGH PRIORITY - incorporate this):
${settings.content.text}
${settings.keywords.length > 0 ? `Keywords to emphasize: ${settings.keywords.join(', ')}` : ''}
` : `
Generate FRESH, UNIQUE content about: ${categories}
`}

CRITICAL REQUIREMENTS (seed: ${seed}):
1. Generate COMPLETELY UNIQUE design every time - different layouts, different section styles
2. USE THE COLORS: Primary ${primaryColor}, Secondary ${secondaryColor} for backgrounds, buttons, accents
3. Create ${linksCount} content sections with varied layouts
4. Make it responsive (max-width: 600px, table-based for email)
5. Include at start: <!-- SUBJECT: Your catchy subject line --> and <!-- PREHEADER: Preview text -->

OUTPUT FORMAT:
Generate ONLY the complete HTML email. Start with <!DOCTYPE html> and end with </html>.
Use inline CSS. No external stylesheets or JavaScript.
Use table-based layout for email compatibility.
ACTUALLY USE the colors ${primaryColor} and ${secondaryColor} in backgrounds, buttons, headings!

DESIGN VARIETY - Choose DIFFERENT approach each time:
- Hero styles: full-width image, split layout, gradient overlay, minimal text-only
- Section layouts: cards, list items, two-column, featured spotlight
- Color usage: colored headers, accent borders, gradient buttons, tinted backgrounds
- Typography: bold headlines, subtle intros, varied font sizes

Generate the HTML now. Make it UNIQUE and use the brand colors!`;

    return prompt;
}
