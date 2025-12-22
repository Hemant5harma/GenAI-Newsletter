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
}

export interface DesignerOutput {
  html: string;
  subject: string;
  preheader: string;
}

const BODY_CONTENT_PROMPT = `You are a WORLD-CLASS email newsletter BODY designer.

⚠️ CRITICAL: You are generating ONLY the MIDDLE BODY CONTENT.
- A header with brand name and date is ALREADY added separately - DO NOT create one
- A footer with unsubscribe links is ALREADY added separately - DO NOT create one

BRAND: {{brandName}} | CATEGORY: {{brandCategory}}
PRIMARY: {{primaryColor}} | ACCENT: {{accentColor}}

CONTENT:
{{writerContent}}

## ⛔ FORBIDDEN ELEMENTS - NEVER INCLUDE THESE:
- NO masthead/header banners (no "THE WEEKLY DISPATCH", no brand name banner, no date header)
- NO footer sections (no copyright ©, no "you are receiving this", no unsubscribe, no address)
- NO full-width colored banners at start or end
- These are handled externally - you ONLY create body cards

## ✅ YOUR FIRST ELEMENT MUST BE:
A greeting card starting with "Hey [audience], 👋" - nothing before it

## DESIGN SYSTEM

### TYPOGRAPHY
- Section Title: font-family:Georgia,serif; font-size:26px; font-weight:700; color:{{primaryColor}};
- Subsection: font-family:Arial,sans-serif; font-size:18px; font-weight:700; color:{{accentColor}};
- Body: font-family:Arial,sans-serif; font-size:16px; line-height:1.75; color:#374151;

### CARD STRUCTURE
<tr><td style="padding:32px 28px;background:#FFFFFF;border-radius:16px;border:1px solid #E5E7EB;">
  ...content...
</td></tr>
<tr><td height="24"></td></tr>

### CALLOUT BOX
<table role="presentation" width="100%" style="margin:20px 0;"><tr>
  <td style="background:#F8FAFC;border-left:4px solid {{accentColor}};padding:16px 20px;border-radius:0 8px 8px 0;">
    <p style="margin:0;font-size:15px;color:#475569;"><strong style="color:{{primaryColor}};">💡 Key Insight:</strong> [text]</p>
  </td>
</tr></table>

### STAT HIGHLIGHT
<table role="presentation" width="100%" style="margin:24px 0;"><tr>
  <td align="center" style="padding:24px;background:linear-gradient(135deg,{{primaryColor}} 0%,{{accentColor}} 100%);border-radius:12px;">
    <p style="margin:0;font-size:42px;font-weight:800;color:#FFFFFF;">NUMBER</p>
    <p style="margin:8px 0 0 0;font-size:14px;color:rgba(255,255,255,0.9);">description</p>
  </td>
</tr></table>

### CTA BUTTON
<table role="presentation" align="center" style="margin:32px auto;"><tr>
  <td style="background:{{accentColor}};border-radius:10px;">
    <a href="#" style="display:block;padding:16px 40px;font-size:16px;font-weight:700;color:#FFFFFF;text-decoration:none;">Button →</a>
  </td>
</tr></table>

## BODY SECTIONS TO CREATE (7 cards total)

1. **Opening Card** - "Hey [audience], 👋" greeting, what's inside, hook
2. **Deep Dive Card** - Main article with subsections, 1 stat highlight, 1 callout box
3. **Quick Hits Card** - 3-5 news items with emoji prefixes
4. **Tip Card** - Actionable tip with steps
5. **Personal Note Card** - Conversational behind-the-scenes
6. **CTA Card** - Call to action with button
7. **Quick Links Card** - 2-3 resource links (THIS IS YOUR LAST ELEMENT)

## OUTPUT RULES
1. Table-based HTML only, inline CSS only
2. Start with <table> containing the greeting card
3. End with the quick links card - NOTHING AFTER IT
4. ⛔ NEVER add: header banner, footer, copyright, unsubscribe text

Generate body HTML now, starting directly with the greeting card:`;

export async function executeDesignerAgent(input: DesignerInput): Promise<DesignerOutput> {
  const { brand, content, colors, colorPalette } = input;

  const dynamicColors = colorPalette || {
    primary: colors.primary,
    secondary: colors.secondary,
    accent: '#10b981',
    text: '#1f2937',
    background: '#ffffff'
  };

  const randomHeader = HEADER_TEMPLATES[Math.floor(Math.random() * HEADER_TEMPLATES.length)];
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const headerHtml = randomHeader.html
    .replace(/\{\{brandName\}\}/g, brand.name)
    .replace(/\{\{primaryColor\}\}/g, dynamicColors.primary)
    .replace(/\{\{secondaryColor\}\}/g, dynamicColors.secondary)
    .replace(/\{\{accentColor\}\}/g, dynamicColors.accent)
    .replace(/\{\{date\}\}/g, currentDate)
    .replace(/\{\{subject\}\}/g, content.subjectLines[0] || `${brand.name} Newsletter`);

  // Strip markdown section headers to prevent AI from rendering them as duplicate headers
  const sanitizedContent = content.rawContent
    .replace(/^#\s*SECTION\s*\d+[:\s]+[^\n]+\n*/gim, '')
    .replace(/^#+\s+/gim, '**')  // Convert remaining markdown headers to bold
    .trim();

  const prompt = BODY_CONTENT_PROMPT
    .replace(/\{\{brandName\}\}/g, brand.name)
    .replace(/\{\{brandCategory\}\}/g, brand.category || 'General')
    .replace(/\{\{primaryColor\}\}/g, dynamicColors.primary)
    .replace(/\{\{accentColor\}\}/g, dynamicColors.accent)
    .replace(/\{\{writerContent\}\}/g, sanitizedContent);

  console.log("\n╔══════════════════════════════════════╗");
  console.log("║       AGENT 4: DESIGNER AGENT        ║");
  console.log("╚══════════════════════════════════════╝");
  console.log(`> 🎨 PREMIUM MODE`);
  console.log(`> Header Template: ${randomHeader.name}`);
  console.log(`> Primary Color: ${dynamicColors.primary}`);
  console.log(`> Accent Color: ${dynamicColors.accent}`);
  console.log(`> Generating body content...`);

  let bodyContent = await generateText(prompt);
  bodyContent = bodyContent.replace(/```html\s*/gi, '').replace(/```\s*/g, '').trim();

  // SAFETY NET: Strip any AI-generated headers/footers that slipped through
  bodyContent = bodyContent
    // Remove header banners with "weekly dispatch", "newsletter", or brand name in colored backgrounds
    .replace(/<table[^>]*>[\s\S]*?(?:weekly\s*dispatch|masthead|newsletter\s*header)[\s\S]*?<\/table>/gi, '')
    // Remove footer sections with copyright, unsubscribe, or "receiving this"
    .replace(/<table[^>]*>[\s\S]*?(?:©\s*\d{4}|copyright|unsubscribe|you\s*(?:are|\'re)\s*receiving|signed\s*up\s*for|all\s*rights\s*reserved)[\s\S]*?<\/table>/gi, '')
    .trim();

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
