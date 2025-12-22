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

const BODY_CONTENT_PROMPT = `You are a WORLD-CLASS email newsletter designer. Create a visually stunning Morning Brew / The Hustle style newsletter.

BRAND: {{brandName}} | CATEGORY: {{brandCategory}}
PRIMARY: {{primaryColor}} | ACCENT: {{accentColor}}

CONTENT:
{{writerContent}}

## DESIGN SYSTEM

### TYPOGRAPHY
- Section Title: font-family:Georgia,serif; font-size:26px; font-weight:700; color:{{primaryColor}}; line-height:1.3;
- Subsection: font-family:Arial,sans-serif; font-size:18px; font-weight:700; color:{{accentColor}}; margin:24px 0 12px 0;
- Body: font-family:Arial,sans-serif; font-size:16px; line-height:1.75; color:#374151;
- Label: font-family:Arial,sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#9CA3AF;

### CARDS (Each section is a card)
<tr><td style="padding:32px 28px;background:#FFFFFF;border-radius:16px;border:1px solid #E5E7EB;margin-bottom:24px;">
  ...content...
</td></tr>
<tr><td height="24"></td></tr>

### CALLOUT BOX (Use for key insights)
<table role="presentation" width="100%" style="margin:20px 0;"><tr>
  <td style="background:#F8FAFC;border-left:4px solid {{accentColor}};padding:16px 20px;border-radius:0 8px 8px 0;">
    <p style="margin:0;font-size:15px;line-height:1.6;color:#475569;"><strong style="color:{{primaryColor}};">💡 Key Insight:</strong> [insight text]</p>
  </td>
</tr></table>

### STAT HIGHLIGHT (Use for big numbers)
<table role="presentation" width="100%" style="margin:24px 0;"><tr>
  <td align="center" style="padding:24px;background:linear-gradient(135deg,{{primaryColor}} 0%,{{accentColor}} 100%);border-radius:12px;">
    <p style="margin:0;font-size:42px;font-weight:800;color:#FFFFFF;line-height:1;">85%</p>
    <p style="margin:8px 0 0 0;font-size:14px;color:rgba(255,255,255,0.9);">of users reported improvement</p>
  </td>
</tr></table>

### IMAGE PLACEHOLDER
<table role="presentation" width="100%" style="margin:24px 0;"><tr><td>
  <div style="background:linear-gradient(135deg,#1e293b 0%,#334155 100%);border-radius:12px;padding:48px 24px;text-align:center;">
    <p style="margin:0 0 8px 0;font-size:14px;font-weight:600;color:#94a3b8;letter-spacing:1px;">📷 IMAGE PLACEHOLDER</p>
    <p style="margin:0;font-size:13px;color:#64748b;">[Description] • 560×320px recommended</p>
  </div>
</td></tr></table>

### DIVIDER
<table role="presentation" width="100%" style="margin:24px 0;"><tr>
  <td height="1" style="background:linear-gradient(90deg,transparent 0%,#E5E7EB 20%,#E5E7EB 80%,transparent 100%);"></td>
</tr></table>

### BULLET LIST
<table role="presentation" width="100%" style="margin:16px 0;"><tr>
  <td width="24" valign="top" style="color:{{accentColor}};font-size:18px;line-height:1.6;">•</td>
  <td style="font-size:16px;line-height:1.6;color:#374151;padding-left:8px;">[List item text]</td>
</tr></table>

### CTA BUTTON
<table role="presentation" align="center" style="margin:32px auto;"><tr>
  <td style="background:{{accentColor}};border-radius:10px;box-shadow:0 4px 14px rgba(0,0,0,0.12);">
    <a href="#" style="display:block;padding:16px 40px;font-family:Arial,sans-serif;font-size:16px;font-weight:700;color:#FFFFFF;text-decoration:none;">Explore Now →</a>
  </td>
</tr></table>

## SECTIONS TO CREATE

**SECTION 4 - Opening** (120-150 words)
- Light greeting with emoji
- What's in this issue (bullets)
- Hook sentence

**SECTION 5 - Deep Dive** (550-700 words)
- Compelling title with emoji prefix
- 3-4 subsections with subheaders
- Include 1 STAT HIGHLIGHT
- Include 1 CALLOUT BOX
- Include 1 IMAGE PLACEHOLDER
- End with Key Takeaways (bullet list)

**SECTION 6 - Quick Hits** (280-350 words)
- 3-5 news items with emoji prefix
- Each: Bold title + 2-3 sentence summary
- Include 1 IMAGE PLACEHOLDER

**SECTION 7 - Tip of Week** (150-200 words)
- Practical, actionable tip
- Why it matters
- How to implement

**SECTION 8 - Personal Note** (120-150 words)
- Conversational tone
- Behind-the-scenes insight
- Question to readers

**SECTION 9 - CTA** 
- Compelling 1-line headline
- Value prop sentence
- Premium CTA button

**SECTION 10 - Quick Links**
- 2-3 resource links

## RULES
1. Output ONLY table-based HTML
2. Every element has inline CSS
3. Use patterns from Design System above
4. Minimum 1000 words
5. 2 image placeholders
6. 1 stat highlight
7. 1 callout box
8. No DOCTYPE/html/head/body tags
9. Start with <table>

Generate premium body HTML now:`;

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

  const prompt = BODY_CONTENT_PROMPT
    .replace(/\{\{brandName\}\}/g, brand.name)
    .replace(/\{\{brandCategory\}\}/g, brand.category || 'General')
    .replace(/\{\{primaryColor\}\}/g, dynamicColors.primary)
    .replace(/\{\{accentColor\}\}/g, dynamicColors.accent)
    .replace(/\{\{writerContent\}\}/g, content.rawContent);

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
