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
  colorPalette?: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface DesignerOutput {
  html: string;
  subject: string;
  preheader: string;
}

const DESIGNER_PROMPT = `
You are a world-class EMAIL NEWSLETTER designer who creates scannable, engaging newsletters (NOT blog articles).
Today you're designing a NEWSLETTER for {{brandName}}.

## 📧 NEWSLETTER DESIGN PHILOSOPHY
This is an EMAIL NEWSLETTER - not a blog post or article. Think:
**Scannable. Digestible. Newsletter-style. Mobile-friendly.**

### Newsletter vs Article - KEY DIFFERENCES:
❌ AVOID (Article-style):
- Long text blocks and walls of text
- Blog-style hero images at the top
- Single-column dense content
- Website-style navigation

✅ USE (Newsletter-style):
- **Scannable content cards** with clear borders/backgrounds
- **Newsletter masthead** (Brand Name + Date as text)
- **Multiple distinct sections** visually separated
- **Alternating section backgrounds** (white, light gray, subtle colors)
- **Short paragraphs** (2-3 sentences max per paragraph)
- **Visual hierarchy** with emoji headers, bold keywords, spacing

## BRAND IDENTITY
- Brand Name: {{brandName}}
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

## 📱 EMAIL-RESPONSIVE DESIGN (CRITICAL!)
Email clients require special responsive techniques:

### Desktop (600px max width):
- Use table-based layouts for email client compatibility
- Multi-column layouts with <table><tr><td> structure
- Max container width: 600px, centered with margin: 0 auto

### Mobile (320px - 480px):
- ALL multi-column layouts MUST stack to single column
- Use media queries that work in email: @media only screen and (max-width: 480px)
- Mobile font sizes: **18px minimum for body**, 28px+ for headers
- Touch-friendly buttons: **minimum 44px height**, full-width or centered
- Images: width: 100%; max-width: 100%; height: auto;
- Padding: minimum 16px on all sides for touch targets

### Email Client Compatibility:
- Use **inline CSS** (no external stylesheets)
- Use **table layouts** (not flexbox/grid)
- Test-friendly for: Gmail, Outlook, Apple Mail, Yahoo Mail
- Fallback fonts: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

## 🏗️ NEWSLETTER STRUCTURE (Morning Brew Style) - CRITICAL!

This must look like a NEWSLETTER with proper visual hierarchy:

### 1. BRANDED HEADER BAR (MOST IMPORTANT):
**Full-width colored bar** across the very top:
- Background: Use PRIMARY brand color (bold, vibrant)
- Content: WHITE text, centered
- Brand Name: {{brandName}} in white, bold, 24-28px (NOT domain!)
- Date: Below brand name, white text, 14px
- Padding: 20-30px vertical
- Example HTML structure:
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: PRIMARY_COLOR">
    <tr><td align="center" style="padding: 24px">
      <h1 style="color: white; margin: 0; font-size: 26px">{{brandName}}</h1>
      <p style="color: white; opacity: 0.9; margin: 5px 0; font-size: 14px">December 17, 2025</p>
    </td></tr>
  </table>

### 2. MAIN CONTENT CONTAINER:
- Max width: 600px, centered (margin: 0 auto)
- White background
- Padding: 20-30px all sides

### 3. SECTION STRUCTURE (EACH STORY):
**Visual Pattern for each section**:
- Section emoji + header: 🔥 **Section Title** (20-24px, bold, primary color or black)
- Headline: Bold, 18px, dark text
- Content: 2-3 SHORT paragraphs (16px), #374151
- Visual separator: 1px light gray line (#e5e7eb) OR 20px spacing
- Optional: Alternate #ffffff and #f9fafb backgrounds for sections

### 4. SCANNABLE HIERARCHY:
- Clear visual breaks between sections
- Bold keywords and numbers
- Emoji section headers (🔥 📊 ⚡ 💼)
- White space for breathing room

### 5. FOOTER:
- Light gray background (#f3f4f6)
- Centered, 12px text
- "Subscribed to {{brandName}}" | Unsubscribe

## 🎯 NEWSLETTER COMPONENT SPECIFICATIONS (11-SECTION STRUCTURE)

The content will have 11 sections. You must render ALL of them properly.

### Newsletter Masthead (SECTION 3: Header Area) - CRITICAL STRUCTURE:
**THIS IS THE FIRST THING READERS SEE - MAKE IT PROFESSIONAL!**

**FULL-WIDTH COLORED BAR STRUCTURE**:
- **Background Color**: Use PRIMARY brand color (bold, professional)
- **Brand Name**: {{brandName}} in WHITE, bold, 28-32px, centered
- **Date**: Current date in WHITE, 14-16px, centered, below brand name with 8px spacing
- **Padding**: 32px vertical (top and bottom) for premium look
- **NO domain**, NO "Newsletter" text, NO navigation
- **Visual Impact**: This should look like a professional email header

**HTML Structure Requirements**:
Create a professional full-width colored header using tables (email-compatible):
- Full-width table, primary color background, white brand name (32px bold), white date (15px), 32px padding
  ** CRITICAL NOTES**:
- Extract brand name from SECTION 3 content(remove "Newsletter", remove domain)
  - If content says "eloancompare.com" → use only "eloancompare"
    - Use professional color from brand category
      - White text on colored background for maximum contrast
        - Large, bold brand name for recognition
          - Clean, modern, professional appearance

### Main Content Container:
- Max width: 600px, centered(margin: 0 auto)
  - White background
    - Padding: 20 - 30px

### SECTION 4: Opening Greeting & Hook
  - Font: 16px, line - height 1.6
    - 2 - 3 short paragraphs
      - Bullet list if content includes "In this issue:"
        - Total: 80 - 120 words

### SECTION 5: Deep - Dive Article(MAIN CONTENT)
  ** Most important section - 400 - 600 words **:
- Article Title: H2, 24 - 28px, bold, primary color or black
  - Intro paragraphs: 16px body text
    - 2 - 4 subsections:
  * Subsection headers: H3, 20px, bold
  * Paragraphs: 2 - 3 sentences each, 16px
    * Bullet lists where indicated
      - "Key Takeaways" section at end:
  * H3 header
  * 3 - 5 bullet points, bold key terms

### SECTION 6: Curated Links / News
  - Section Header: H2, "This Week's Signals" or similar
    - 3 - 5 items, each:
  * Item title: Bold, 18px
  * Commentary: 16px, 1 - 2 sentences
    - Visual separator between items(light gray line or spacing)
      - Total: 200 - 300 words

### SECTION 7: Quick Hits / Tools
  - Section Header: H2
    - Can be:
  * Bullet list(3 - 5 items)
  * Single tool paragraph
    * Code / pattern explanation
      - Total: 150 - 250 words

### SECTION 8: Personal Note
  - Section Header: H2 or intro line
    - 1 - 2 paragraphs, more personal tone
      - Light background(#f9fafb) optional
        - Total: 100 - 150 words

### SECTION 9: Primary CTA
  - Prominent button or highlighted section
    - Background: Accent color
      - Text: White, 16px, bold, centered
        - Padding: 16px 32px(44px min height)
          - Border - radius: 6 - 8px
            - Full width mobile, max 300px desktop

### SECTION 10: Secondary Links(if present)
  - 2 - 3 bullet points or small text links
    - 14px, gray text
      - Minimal styling

### SECTION 11: Footer
  - Background: Light gray(#f3f4f6)
    - Text: 12px, gray(#6b7280), centered
      - Elements:
  * {{ brandName }}
  * {{ brandDomain }} link
  * Social links
    * "Unsubscribe or manage preferences"
    - Padding: 30px 20px

### Visual Hierarchy & Separators:
- Clear spacing between sections(24 - 32px vertical)
  - Light gray separator lines(#e5e7eb, 1px) between major sections
    - Alternating backgrounds optional(white and #f9fafb)
      - Consistent typography hierarchy

### Content Sections(Newsletter - Style)
Each story / section should be a visually distinct CARD or BLOCK:
- ** Visual Separation **: Border(1px solid #e5e7eb) OR background color OR 16px spacing
  - ** Section Headers **: 20 - 24px bold with emoji / icon prefix(e.g., "🔥 Main Story")
    - ** Scannable Layout **: Short paragraphs(2 - 3 sentences), bold key terms
      - ** Alternating Backgrounds **: Alternate between white and light background(#F9FAFB)
        - ** Padding **: 24 - 32px vertical, 20px horizontal per section
          - ** Border Radius **: 8px for card - style sections(optional)

### Typography(Newsletter - Optimized)
  - ** Font Stack **: -apple - system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans - serif
    - ** Body Text **: 16px(18px mobile), line - height 1.6, color #374151
      - ** Headlines **: Bold, clear hierarchy(h2: 24px, h3: 20px)
        - ** Links **: Primary color, underline on hover
          - ** Bold Key Terms **: Use<strong> for names, numbers, important facts

### CTA Button(Only ONE at the end)
  - Full width on mobile(100 %), centered on desktop(max 300px)
    - Padding: 16px 32px(minimum 44px height for touch)
  - Background: Accent color(high contrast)
    - Text: White, 16px, bold, centered
      - Border - radius: 8px
        - Link to: { { brandDomain } }

### Newsletter Footer
  - Simple unsubscribe link(required for email compliance)
  - Font: 12px, gray(#6B7280), centered
    - Text: "You received this because you're subscribed to {{brandName}}"
      - Include: Unsubscribe link, preference center link(can be placeholder #)

## 📷 IMAGES
Available: { { images } }
If NONE: Create a beautiful text - only design with color blocks and typography.
NEVER use placeholder images or invent URLs.

## CONTENT TO DESIGN

{ { writerContent } }

## OUTPUT REQUIREMENTS - CRITICAL!
1. Output ONLY valid HTML - nothing else !
  2. Start with <!DOCTYPE html >
  3. Include proper email viewport meta tag: <meta name="viewport" content = "width=device-width, initial-scale=1.0" >
    4. Extract SUBJECT from SECTION 1 -- > <!--SUBJECT: [from content]-- >
      5. Extract PREHEADER from SECTION 2 -- > <!--PREHEADER: [from content]-- >
        6. ALL CSS must be INLINE(email clients requirement)
7. Use TABLE - BASED layouts for email compatibility(not div / flexbox)
8. Include media queries in <style>tag for responsive mobile behavior
9. ** RENDER ALL 11 SECTIONS FROM CONTENT **:
- SECTION 3: Colored header bar - ** IMPORTANT **: Extract brand name ONLY(remove.com, .io, "Newsletter" text)
  * If content says "eloancompare.com Newsletter" → use "eloancompare"
    * If content says "TechDaily | Dec 17" → use "TechDaily"
      * Professional colored bar(32px padding), white text(32px brand name, 15px date)
        - SECTION 4: Opening greeting(80 - 120 words)
          - SECTION 5: Deep - dive article(400 - 600 words, subsections, Key Takeaways)
            - SECTION 6: Curated links(3 - 5 items)
              - SECTION 7: Quick hits / tools
                - SECTION 8: Personal note
                  - SECTION 9: Primary CTA button
                    - SECTION 10: Secondary links(if present)
  - SECTION 11: Footer
10. Single - column, mobile - friendly(600px max width)
11. Clear visual hierarchy with section spacing
12. Do NOT wrap in markdown code blocks
13. Do NOT add any explanation before or after the HTML
14. Start with <!DOCTYPE html > and end with </html>
15. ** USE BRAND NAME(not domain) IN HEADER BAR **

  Generate the complete HTML email newsletter now.Output ONLY the HTML code.
`;

export async function executeDesignerAgent(input: DesignerInput): Promise<DesignerOutput> {
  const { brand, content, colors, images, layoutBlueprint, colorPalette } = input;

  const imagesStr = images.length > 0 ? JSON.stringify(images) : "NONE";

  let prompt = "";

  // Use dynamic colors if provided, otherwise defaults
  const dynamicColors = colorPalette || {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: '#10b981',
    text: '#1f2937',
    background: '#ffffff'
  };

  if (layoutBlueprint) {
    // BLUEPRINT MODE: Strict enforcement
    prompt = `
You are an expert HTML email designer creating a NEWSLETTER(Morning Brew style) for {{ brandName }}.

## YOUR TASK
Create a beautiful, scannable HTML email newsletter following the blueprint AND Morning Brew structure.

##  DYNAMIC COLOR PALETTE (USE THESE EXACT COLORS THROUGHOUT)
**CRITICAL: Apply these colors consistently across ALL sections:**
- **Primary**: ${dynamicColors.primary}  Header background (with gradient), section headers
- **Secondary**: ${dynamicColors.secondary}  All hyperlinks, supporting elements
- **Accent**: ${dynamicColors.accent}  All CTA buttons, highlights
- **Text**: ${dynamicColors.text}  Body paragraphs, footer text
- **Background**: ${dynamicColors.background}  Page background, alternating sections

**ENHANCED PREMIUM HEADER (CRITICAL):**
- Background: linear-gradient(135deg, ${dynamicColors.primary} 0%, [10% darker shade] 100%)
- Box shadow: 0 4px 6px rgba(0,0,0,0.1)
- Border bottom: 3px solid ${dynamicColors.accent}
- Brand name: #FFFFFF, 36px, weight 800, letter-spacing -1px
- Date: rgba(255,255,255,0.9), 14px, with  emoji
- Padding: 40px vertical, 20px horizontal

** IMAGE PLACEHOLDERS (Add where needed):**
<div style="width:100%; max-width:600px; margin:20px auto; background:#1a1a1a; border:1px solid #e5e7eb; border-radius:8px; padding:60px 20px; text-align:center;">
  <p style="color:#9ca3af; font-size:14px; margin:0; line-height:1.6;">
     <strong>IMAGE PLACEHOLDER</strong><br>
    <em>Suggested: [Specific description based on content]</em><br>
    Dimensions: 600x400px
  </p>
</div>
Add in: Deep-Dive Article (Section 5), Tool sections, News items

## CRITICAL NEWSLETTER STRUCTURE:
1. ** FULL - WIDTH COLORED HEADER BAR **: Use primary color, white text, centered brand name
2. ** Brand name ** (${brand.name}) in WHITE on colored bar - NOT domain!
3. ** Scannable sections ** with clear hierarchy
4. ** Visual separators ** between sections
5. ** Short paragraphs ** (2 - 3 sentences max)

## LAYOUT BLUEPRINT
  ** Layout Pattern **: ${layoutBlueprint.chosenLayout.name} (${layoutBlueprint.chosenLayout.id})
** CSS Framework **: ${layoutBlueprint.cssFramework}
** Mobile Strategy **: ${layoutBlueprint.mobileNotes}

### HEADER SPECIFICATION(IMPLEMENT AS COLORED BAR):
- Type: ${layoutBlueprint.header.type}
- Title: ${brand.name} (USE THIS, NOT DOMAIN!)
- Date: ${layoutBlueprint.header.elements.date}
- ** STRUCTURE **: Full - width colored bar, white text, centered
  - ** HTML **: <table width="100%" style = "background: ${dynamicColors.primary}; background: linear-gradient(135deg, ${dynamicColors.primary} 0%, [darker] 100%);" > <tr><td align="center" style = "padding: 40px 20px; border-bottom: 3px solid ${dynamicColors.accent};" > <h1 style="color: white; margin: 0; font-size: 36px;" > ${brand.name} </h1><p style="color: white; margin: 10px 0 0 0;">📅 ${layoutBlueprint.header.elements.date}</p > </td></tr > </table>

### FOOTER SPECIFICATION:
- Type: ${layoutBlueprint.footer.type}
- Company: ${brand.name}
- CSS Class: ${layoutBlueprint.footer.cssClass}

### COLOR PALETTE(Use these exact colors):
- Primary: ${dynamicColors.primary} (for HEADER BAR background)
  - Secondary: ${dynamicColors.secondary}
- Accent: ${dynamicColors.accent}
- Text: ${dynamicColors.text}
- Background: ${dynamicColors.background}

### SECTION STRUCTURE(Render in this exact order):
${layoutBlueprint.sectionsOrder.map((s, i) => `${i + 1}. [${s.type.toUpperCase()}] - CSS: ${s.cssClass}, Visual: ${s.visualType}`).join('\n')}

### DYNAMIC ELEMENTS TO INCLUDE:
${layoutBlueprint.dynamicElements.map(e => `- ${e.type} (Position: ${e.position}, CSS: ${e.cssClass})`).join('\n')}

## BRAND CONTEXT
  - Brand Name: ${brand.name} (USE THIS IN HEADER!)
- Website: ${brand.domain || 'https://example.com'} (for CTA button only)
  - Category: ${brand.category || 'General'}

## CONTENT TO DESIGN
${content.rawContent}

## IMAGES
Available: ${imagesStr}
If NONE: Use color blocks and typography.

## OUTPUT REQUIREMENTS
1. Output ONLY valid HTML
2. Start with <!DOCTYPE html >
3. Comment lines: <!--SUBJECT: ... --> and < !--PREHEADER: ... -->
  4. ALL CSS must be INLINE
5. Use tables for layout(email compatibility)
6. NO markdown code blocks
7. NO explanation text
8. ** CRITICAL **: Implement COLORED HEADER BAR with ${brand.name} in WHITE
9. ** CRITICAL **: Use ${brand.name} NOT domain in header
10. Scannable sections with visual hierarchy
11. Implement the EXACT header type: ${layoutBlueprint.header.type} as a COLORED BAR

Generate the complete Morning Brew - style HTML email newsletter now.
`;
  } else {
    // CREATIVE MODE: Random selection (fallback)
    prompt = DESIGNER_PROMPT
      .replace(/{{brandName}}/g, brand.name)
      .replace(/{{brandDomain}}/g, brand.domain || 'https://example.com')
      .replace(/{{brandCategory}}/g, brand.category || 'General')
      .replace(/{{primaryColor}}/g, dynamicColors.primary)
      .replace(/{{secondaryColor}}/g, dynamicColors.secondary)
      .replace(/{{accentColor}}/g, dynamicColors.accent)
      .replace(/{{textColor}}/g, dynamicColors.text)
      .replace(/{{backgroundColor}}/g, dynamicColors.background)
      .replace(/{{images}}/g, imagesStr)
      .replace(/{{writerContent}}/g, content.rawContent)
      .replace(/{{layoutSection}}/g, `
## 📐 LAYOUT STYLES(Pick ONE randomly)
  ** Style 1: The Minimalist ** - Lots of white space, single column
    ** Style 2: The Card Stack ** - Distinct cards, rounded corners
      ** Style 3: The Magazine ** - Hero color block, multi - column
        ** Style 4: The Modern ** - Asymmetric, accent strips
          `);
  }

  console.log("\n╔══════════════════════════════════════╗");
  console.log("║       AGENT 4: DESIGNER AGENT        ║");
  console.log("╚══════════════════════════════════════╝");
  if (layoutBlueprint) {
    console.log(`> 📐 BLUEPRINT MODE`);
    console.log(`> Layout: ${layoutBlueprint.chosenLayout.name} `);
    console.log(`> Header: ${layoutBlueprint.header.type} `);
    console.log(`> Footer: ${layoutBlueprint.footer.type} `);
    console.log(`> Framework: ${layoutBlueprint.cssFramework} `);
    console.log(`> Colors: Primary=${dynamicColors.primary}, Secondary=${dynamicColors.secondary}, Accent=${dynamicColors.accent}`);
  } else {
    console.log(`> 🎲 CREATIVE MODE(No Blueprint)`);
    console.log(`> Primary Color: ${colors.primary} `);
    console.log(`> Secondary Color: ${colors.secondary} `);
  }
  console.log(`> Designing HTML...`);

  let rawResponse = await generateText(prompt);

  // Robust HTML extraction
  let html = extractHtml(rawResponse);

  console.log(`> Design Complete.HTML size: ${html.length} chars.`);

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
  let cleaned = response.replace(/```html\s * /gi, '').replace(/```\s*/g, '').trim();

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
    cleaned = `< !DOCTYPE html >
  <html>
  <head><meta charset="UTF-8" > </head>
    < body > ${cleaned} </body>
      </html>`;
  }

  return cleaned.trim();
}
