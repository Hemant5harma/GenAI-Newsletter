/**
 * DESIGNER AGENT
 * 
 * Purpose: Transforms written content into beautifully styled HTML email.
 * Handles layout, typography, colors, spacing, and responsive design.
 * 
 * Output: Complete HTML email template
 */

import { generateText } from "../ai";
import { BrandData } from "../generator";
import { WriterOutput } from "./writer-agent";
import { LayoutOutput } from "./layout-agent";

export interface DesignerInput {
    brand: BrandData;
    content: WriterOutput;
    colors: { primary: string; secondary: string };
    images: string[];
    layoutBlueprint?: LayoutOutput; // Optional layout blueprint from Layout Agent
}

export interface DesignerOutput {
    html: string;
    subject: string;
    preheader: string;
}

const DESIGNER_PROMPT = `
You are a world-renowned email designer who has created award-winning newsletters for Apple, Stripe, and Linear.
Today you're designing for {{brandName}}.

## DESIGN PHILOSOPHY
Every newsletter should look like it was crafted by a boutique design agency. 
Think: **Premium. Clean. Intentional. Modern.**

## BRAND IDENTITY
- Brand: {{brandName}}
- Website: {{brandDomain}}
- Category: {{brandCategory}}

## 🎨 DYNAMIC COLOR PALETTE (3-5 Colors Based on Content)

You MUST generate a harmonious color palette of **3-5 colors** that matches the CONTENT and MOOD of the newsletter.

### HOW TO PICK COLORS:
1. **Analyze the content** - What is the main topic? What emotions should it evoke?
2. **Pick a dominant color** based on category "{{brandCategory}}":
   - Tech/Software → Deep blues, purples (#6366F1, #8B5CF6)
   - Finance/Business → Navy, emerald, gold (#1E3A5F, #065F46, #F59E0B)
   - Health/Wellness → Teals, greens, corals (#059669, #10B981, #FED7AA)
   - Creative/Design → Magentas, ambers, blacks (#EC4899, #F59E0B, #1F2937)
   - News/Media → Reds, charcoals, grays (#DC2626, #1F2937, #F3F4F6)
   - Lifestyle → Oranges, corals, creams (#F97316, #EF4444, #FEF3C7)

3. **Build a 5-color palette**:
   - **Color 1 (Primary)**: Main brand/header color - BOLD
   - **Color 2 (Secondary)**: Section backgrounds - LIGHTER
   - **Color 3 (Accent)**: CTAs, highlights, links - VIBRANT
   - **Color 4 (Text)**: Body text - Dark gray or near-black (#374151 or #1F2937)
   - **Color 5 (Background)**: Section alternating bg - Very light (#F9FAFB, #FEF3C7, etc.)

### COLOR USAGE IN DESIGN:
- Header: Color 1 (Primary) as background OR text
- Section titles: Color 1 or Color 3
- Body text: Color 4 (always readable)
- CTA buttons: Color 3 (Accent) with white text
- Alternating section backgrounds: White and Color 5
- Borders/dividers: Light version of Color 1

### User Hint (optional starting point):
- Suggested Primary: {{primaryColor}}
- Suggested Secondary: {{secondaryColor}}
(You may adjust these to create a better 5-color palette)

{{layoutSection}}

## 📱 RESPONSIVE DESIGN RULES
- Container: max-width 600px, centered
- Stack columns on mobile (under 480px)
- Minimum font size: 16px body, 24px headers
- Touch targets: minimum 44px height for buttons
- Images: 100% width, fluid

## 🎯 COMPONENT SPECIFICATIONS

### Header
- Brand name: 24-28px, bold, primary color or black
- Date: 12-14px, gray, subtle
- NO navigation links, NO logo images (text only)

### Sections
- Clear visual separation between each
- Section headers: 20-24px, bold
- Use primary color for accents and borders
- Padding: 24-32px vertical, 20px horizontal

### Typography
- Font stack: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif
- Body: 16px, line-height 1.6, color #374151
- Headlines: Bold, use hierarchy (h2, h3)
- Links: Primary color, underline on hover

### CTA Button (Only ONE at the end)
- Full width on mobile, centered on desktop
- Padding: 16px 32px
- Background: Primary color
- Text: White, 16px, bold
- Border-radius: 8px
- Link to: {{brandDomain}}

### Footer
- Simple unsubscribe text
- 12px, gray, centered
- Add: "You received this because you're awesome."

## 📷 IMAGES
Available: {{images}}
If NONE: Create a beautiful text-only design with color blocks and typography.
NEVER use placeholder images or invent URLs.

## CONTENT TO DESIGN

{{writerContent}}

## OUTPUT REQUIREMENTS - CRITICAL!
1. Output ONLY valid HTML - nothing else!
2. Start with \`<!DOCTYPE html>\`
3. First line after doctype: \`<!-- SUBJECT: [Best subject line] -->\`
4. Second line: \`<!-- PREHEADER: [Preview text, 40-90 chars] -->\`
5. ALL CSS must be INLINE (email clients requirement)
6. Use tables for layout (email compatibility)
7. Do NOT wrap in markdown code blocks
8. Do NOT add any explanation before or after the HTML
9. The response should start with <!DOCTYPE html> and end with </html>

Generate the complete HTML email now. Output ONLY the HTML code.
`;

export async function executeDesignerAgent(input: DesignerInput): Promise<DesignerOutput> {
    const { brand, content, colors, images, layoutBlueprint } = input;

    const imagesStr = images.length > 0 ? JSON.stringify(images) : "NONE";

    let prompt = "";

    if (layoutBlueprint) {
        // BLUEPRINT MODE: Strict enforcement
        prompt = `
You are an expert HTML email designer. You have been given a specific layout blueprint to implement.

## YOUR TASK
Translate the following layout blueprint into a beautiful, functional HTML email newsletter.
YOU MUST FOLLOW THE BLUEPRINT SPECIFICATIONS EXACTLY - do not deviate or improvise.

## LAYOUT BLUEPRINT
**Layout Pattern**: ${layoutBlueprint.chosenLayout.name} (${layoutBlueprint.chosenLayout.id})
**CSS Framework**: ${layoutBlueprint.cssFramework}
**Mobile Strategy**: ${layoutBlueprint.mobileNotes}

### HEADER SPECIFICATION
- Type: ${layoutBlueprint.header.type}
- Title: ${layoutBlueprint.header.elements.newsletterTitle}
- Date: ${layoutBlueprint.header.elements.date}
- CSS Class: ${layoutBlueprint.header.cssClass}

### FOOTER SPECIFICATION
- Type: ${layoutBlueprint.footer.type}
- Company: ${layoutBlueprint.footer.elements.companyName}
- CSS Class: ${layoutBlueprint.footer.cssClass}

### COLOR PALETTE (Use these exact colors)
- Primary: ${layoutBlueprint.designTokens.primaryColor}
- Secondary: ${layoutBlueprint.designTokens.secondaryColor}
- Accent: ${layoutBlueprint.designTokens.accentColor}
- Text: ${layoutBlueprint.designTokens.textColor}
- Background: ${layoutBlueprint.designTokens.bgColor}

### SECTION STRUCTURE (Render in this exact order)
${layoutBlueprint.sectionsOrder.map((s, i) => `${i + 1}. [${s.type.toUpperCase()}] - CSS: ${s.cssClass}, Visual: ${s.visualType}`).join('\n')}

### DYNAMIC ELEMENTS TO INCLUDE
${layoutBlueprint.dynamicElements.map(e => `- ${e.type} (Position: ${e.position}, CSS: ${e.cssClass})`).join('\n')}

## BRAND CONTEXT
- Brand: ${brand.name}
- Domain: ${brand.domain || 'https://example.com'}
- Category: ${brand.category || 'General'}

## CONTENT TO DESIGN
${content.rawContent}

## IMAGES
Available: ${imagesStr}
If NONE: Create text-only design with color blocks.

## OUTPUT REQUIREMENTS
1. Output ONLY valid HTML
2. Start with \`<!DOCTYPE html>\`
3. First line after doctype: \`<!-- SUBJECT: [subject line] -->\`
4. Second line: \`<!-- PREHEADER: [preview text] -->\`
5. ALL CSS must be INLINE
6. Use tables for layout (email compatibility)
7. NO markdown code blocks
8. NO explanation text
9. Implement the EXACT header type specified: ${layoutBlueprint.header.type}
10. Implement the EXACT footer type specified: ${layoutBlueprint.footer.type}

Generate the complete HTML email now following the blueprint exactly.
`;
    } else {
        // CREATIVE MODE: Random selection (fallback)
        prompt = DESIGNER_PROMPT
            .replace(/{{brandName}}/g, brand.name)
            .replace(/{{brandDomain}}/g, brand.domain || 'https://example.com')
            .replace(/{{brandCategory}}/g, brand.category || 'General')
            .replace(/{{primaryColor}}/g, colors.primary)
            .replace(/{{secondaryColor}}/g, colors.secondary)
            .replace(/{{images}}/g, imagesStr)
            .replace(/{{writerContent}}/g, content.rawContent)
            .replace(/{{layoutSection}}/g, `
## 📐 LAYOUT STYLES (Pick ONE randomly)
**Style 1: The Minimalist** - Lots of white space, single column
**Style 2: The Card Stack** - Distinct cards, rounded corners
**Style 3: The Magazine** - Hero color block, multi-column
**Style 4: The Modern** - Asymmetric, accent strips
`);
    }

    console.log("\n╔══════════════════════════════════════╗");
    console.log("║       AGENT 4: DESIGNER AGENT        ║");
    console.log("╚══════════════════════════════════════╝");
    if (layoutBlueprint) {
        console.log(`> 📐 BLUEPRINT MODE`);
        console.log(`> Layout: ${layoutBlueprint.chosenLayout.name}`);
        console.log(`> Header: ${layoutBlueprint.header.type}`);
        console.log(`> Footer: ${layoutBlueprint.footer.type}`);
        console.log(`> Framework: ${layoutBlueprint.cssFramework}`);
        console.log(`> Colors: ${layoutBlueprint.designTokens.primaryColor}, ${layoutBlueprint.designTokens.accentColor}`);
    } else {
        console.log(`> 🎲 CREATIVE MODE (No Blueprint)`);
        console.log(`> Primary Color: ${colors.primary}`);
        console.log(`> Secondary Color: ${colors.secondary}`);
    }
    console.log(`> Designing HTML...`);

    let rawResponse = await generateText(prompt);

    // Robust HTML extraction
    let html = extractHtml(rawResponse);

    console.log(`> Design Complete. HTML size: ${html.length} chars.`);

    // Extract subject and preheader
    const subjectMatch = html.match(/<!--\s*SUBJECT:\s*(.+?)\s*-->/i);
    const preheaderMatch = html.match(/<!--\s*PREHEADER:\s*(.+?)\s*-->/i);

    const output: DesignerOutput = {
        html,
        subject: subjectMatch ? subjectMatch[1] : content.subjectLines[0] || `${brand.name} Newsletter`,
        preheader: preheaderMatch ? preheaderMatch[1] : 'Your latest updates'
    };

    return output;
}

/**
 * Extracts valid HTML from AI response that may contain extra text.
 */
function extractHtml(response: string): string {
    // First, clean markdown code fences
    let cleaned = response.replace(/```html\s*/gi, '').replace(/```\s*/g, '').trim();

    // Try to find DOCTYPE
    const doctypeIndex = cleaned.indexOf('<!DOCTYPE');
    if (doctypeIndex === -1) {
        // No DOCTYPE, try to find <html>
        const htmlIndex = cleaned.indexOf('<html');
        if (htmlIndex !== -1) {
            cleaned = '<!DOCTYPE html>\n' + cleaned.substring(htmlIndex);
        }
    } else {
        cleaned = cleaned.substring(doctypeIndex);
    }

    // Find the end of HTML
    const htmlEndIndex = cleaned.lastIndexOf('</html>');
    if (htmlEndIndex !== -1) {
        cleaned = cleaned.substring(0, htmlEndIndex + 7);
    }

    // If still no valid structure, wrap in basic HTML
    if (!cleaned.includes('<html') && !cleaned.includes('<!DOCTYPE')) {
        console.warn('> Warning: No valid HTML structure found, wrapping content...');
        cleaned = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>${cleaned}</body>
</html>`;
    }

    return cleaned.trim();
}
