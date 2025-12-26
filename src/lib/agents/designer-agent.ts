/**
 * DESIGNER AGENT - Premium Newsletter Edition
 */

import { generateText } from "../ai";
import { BrandData } from "../generator";
import { WriterOutput } from "./writer-agent";
import { LayoutOutput } from "./layout-agent";
import { HEADER_TEMPLATES } from "./header-templates";

export interface DesignerInput {
  brand: BrandData;
  content: WriterOutput;
  colors: { primary: string; secondary: string };
  images: string[];
  layoutBlueprint?: LayoutOutput;
  colorPalette?: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  // New customizations
  fonts?: 'sans' | 'serif' | 'mono';
  borderRadius?: string;
}

export interface DesignerOutput {
  html: string;
  subject: string;
  preheader: string;
}

const BODY_CONTENT_PROMPT = `You are a WORLD-CLASS email newsletter designer (HTML/CSS Expert).
Your goal is to convert Markdown content into a Pixel-Perfect, Responsive HTML Newsletter.

BRAND: {{brandName}} | CATEGORY: {{brandCategory}}
PRIMARY: {{primaryColor}} | ACCENT: {{accentColor}}

## 📐 LAYOUT REQUIREMENTS (FROM ARCHITECT)
{{layoutInstructions}}

## 🎨 DESIGN SYSTEM (PREMIUM)

### GLOBAL STYLES
- **Font Stack**: {{fontFamily}} (Clean, Modern).
- **Background**: #F3F4F6 (Light Gray) for body, #FFFFFF (White) for cards.
- **Spacing**: 24px padding standard. Handy "Airy" feel.

### COMPONENT LIBRARY (Use these inline styles)

**1. MAIN CARD (Container)**
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF; border-radius:12px; border:1px solid #E5E7EB; margin-bottom: 24px; overflow:hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
  <tr><td style="padding: 32px 24px;">
    <!-- Content goes here -->
  </td></tr>
</table>

**2. TYPOGRAPHY**
- **H1 (Main Title)**: font-size: 28px; font-weight: 800; color: #111827; letter-spacing: -0.5px; line-height: 1.2; margin-bottom: 16px; font-family: {{fontFamily}};
- **H2 (Section Header)**: font-size: 22px; font-weight: 700; color: {{primaryColor}}; margin-top: 0; margin-bottom: 12px; font-family: {{fontFamily}};
- **H3 (Subhead)**: font-size: 18px; font-weight: 600; color: #374151; margin-top: 20px; margin-bottom: 8px; font-family: {{fontFamily}};
- **Body Text**: font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 16px; font-family: {{fontFamily}};
- **Link**: color: {{accentColor}}; text-decoration: underline; font-weight: 500;

**3. FEATURED CALLOUT**
<div style="background: #F8FAFC; border-left: 4px solid {{accentColor}}; padding: 16px; border-radius: 0 8px 8px 0; margin: 24px 0;">
  <p style="margin: 0; font-size: 15px; color: #334155; font-style: italic; font-family: {{fontFamily}};">"Quote or key insight goes here"</p>
</div>

**4. CTA BUTTON (Primary)**
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding: 24px 0;">
  <a href="#" style="background: {{accentColor}}; color: #FFFFFF; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); font-family: {{fontFamily}};">
    Read More &rarr;
  </a>
</td></tr></table>

**5. DIVIDER**
<div style="height: 1px; background-color: #E5E7EB; margin: 32px 0;"></div>

## CONTENT TO RENDER
{{writerContent}}

## EXECUTION RULES
1. **Strict Table Structure**: Use nested tables for everything. No Div-only layouts (email client compatibility).
2. **Inline CSS**: All styling must be inline.
3. **Respect the Blueprint**: Follow the order and visual types defined in the 'LAYOUT REQUIREMENTS'.
4. **Use Custom Colors**: Use {{primaryColor}} for headers and {{accentColor}} for CTAs/links consistently.
5. **Use Custom Font**: IMPORTANT - Use {{fontFamily}} for ALL text elements (headings, paragraphs, links, buttons).
6. **Mobile Responsiveness**: Add 'class="mobile-full-width"' to main tables.
7. **No Placeholders**: Use the actual content provided. If an image is requested in the blueprint but no URL provided, use a solid color block with the alt text.
8. **NO HEADERS/FOOTERS**: ⛔ DO NOT generate a Header, Logo, Date line, or Footer (Address, Unsubscribe). These are already injected by the system wrapper. JUST generate the content sections (Intro -> Deep Dive -> ... -> CTA).
9. **NO HTML SHELL**: ⛔ DO NOT generate <head>, <body>, or <html> tags. Just the internal table structure.

GENERATE THE HTML BODY NOW:`;

export async function executeDesignerAgent(input: DesignerInput): Promise<DesignerOutput> {
  const { brand, content, colors, colorPalette, layoutBlueprint, fonts, borderRadius } = input;

  const dynamicColors = colorPalette || {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: '#10b981',
    text: '#1f2937',
    background: '#ffffff'
  };

  // Determine Font Stack
  const fontStack = fonts === 'serif' ? '"Georgia", "Times New Roman", serif'
    : fonts === 'mono' ? '"Courier New", Courier, monospace'
      : '"Helvetica Neue", Helvetica, Arial, sans-serif'; // Default Sans

  // Build the Layout String to inject into the prompt
  let layoutInstructions = "Follow the standard 9-section flow.";
  if (layoutBlueprint) {
    const sections = layoutBlueprint.sectionsOrder.map(s =>
      `- Section ${s.position}: Type="${s.type}", Visual="${s.visualType}" (Source: ${s.sourceSection})`
    ).join('\n');

    layoutInstructions = `
**CHOSEN LAYOUT**: ${layoutBlueprint.chosenLayout.name} (${layoutBlueprint.chosenLayout.id})
**MOBILE NOTES**: ${layoutBlueprint.mobileNotes}

**SECTION ORDER (Strictly Follow):**
${sections}

**DESIGN TOKENS**:
- Font: ${fonts ? fontStack : layoutBlueprint.designTokens.fontFamily}
- Radius: ${borderRadius || layoutBlueprint.designTokens.borderRadius || '8px'}
      `;
  }

  const randomHeader = HEADER_TEMPLATES[Math.floor(Math.random() * HEADER_TEMPLATES.length)];
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const headerHtml = randomHeader.html
    .replace(/\{\{brandName\}\}/g, brand.name)
    .replace(/\{\{primaryColor\}\}/g, dynamicColors.primary)
    .replace(/\{\{secondaryColor\}\}/g, dynamicColors.secondary)
    .replace(/\{\{accentColor\}\}/g, dynamicColors.accent)
    .replace(/\{\{date\}\}/g, currentDate)
    .replace(/\{\{subject\}\}/g, content.subjectLines[0] || `${brand.name} Newsletter`);

  const prompt = BODY_CONTENT_PROMPT
    .replace(/\{\{brandName\}\}/g, brand.name)
    .replace(/\{\{brandCategory\}\}/g, brand.category || 'General')
    .replace(/\{\{primaryColor\}\}/g, dynamicColors.primary)
    .replace(/\{\{accentColor\}\}/g, dynamicColors.accent)
    .replace(/\{\{fontFamily\}\}/g, fontStack)
    .replace(/\{\{writerContent\}\}/g, content.rawContent)
    .replace(/\{\{layoutInstructions\}\}/g, layoutInstructions);

  console.log("\n╔══════════════════════════════════════╗");
  console.log("║       AGENT 4: DESIGNER AGENT        ║");
  console.log("╚══════════════════════════════════════╝");
  console.log(`> 🎨 PREMIUM MODE`);
  console.log(`> Layout Pattern: ${layoutBlueprint?.chosenLayout?.id || 'Standard'}`);
  console.log(`> Primary Color: ${dynamicColors.primary}`);
  console.log(`> Generating body content...`);

  let bodyContent = await generateText(prompt);
  bodyContent = bodyContent.replace(/```html\s*/gi, '').replace(/```\s*/g, '').trim();

  const completeHtml = buildCompleteEmail(headerHtml, bodyContent, brand, dynamicColors);

  console.log(`> Design Complete. HTML size: ${completeHtml.length} chars.`);

  return {
    html: completeHtml,
    subject: content.subjectLines[0] || `${brand.name} Newsletter`,
    preheader: content.subjectLines[1] || 'Your latest updates'
  };
}

function buildCompleteEmail(
  headerHtml: string,
  bodyContent: string,
  brand: BrandData,
  colors: { primary: string; accent: string }
): string {
  const currentYear = new Date().getFullYear();
  const brandDomain = brand.domain || 'https://example.com';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${brand.name} Newsletter</title>
  <style>
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .mobile-padding { padding-left: 16px !important; padding-right: 16px !important; }
      .mobile-full-width { width: 100% !important; max-width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#F3F4F6;font-family:Arial,Helvetica,sans-serif;">
  <center style="width:100%;background-color:#F3F4F6;">
${headerHtml}
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#F3F4F6;">
      <tr>
        <td align="center" style="padding:24px 16px;" class="mobile-padding">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;margin:0 auto;">
            <tr>
              <td>
${bodyContent}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#F3F4F6;">
      <tr>
        <td align="center" style="padding:24px 16px 48px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;margin:0 auto;">
            <tr>
              <td style="padding:24px;background-color:#FFFFFF;border-radius:12px;border:1px solid #E5E7EB;text-align:center;">
                <p style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:20px;color:#6B7280;">
                  You're receiving this because you subscribed to ${brand.name}.
                </p>
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:18px;color:#9CA3AF;">
                  <a href="${brandDomain}" style="color:${colors.primary};text-decoration:underline;">${brandDomain}</a> &bull;
                  <a href="#" style="color:#9CA3AF;text-decoration:underline;">Unsubscribe</a> &bull;
                  <a href="#" style="color:#9CA3AF;text-decoration:underline;">Preferences</a>
                </p>
                <p style="margin:16px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#D1D5DB;">
                  © ${currentYear} ${brand.name}. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>`;
}
