/**
 * LAYOUT AGENT (v3)
 * 
 * Purpose: Analyzes content, audience, and brand to create optimal newsletter structure.
 * Selects the best layout pattern, header type, footer type, section ordering, and design tokens.
 * 
 * Position in Pipeline: Writer → Layout → Designer
 * Output: Complete layout blueprint for Designer to render pixel-perfect HTML.
 */

import { generateText } from "../ai";
import { BrandData } from "../generator";
import { WriterOutput } from "./writer-agent";
import { generateValidatedPalette } from "../colors";

export interface LayoutInput {
    brand: BrandData;
    writerOutput: WriterOutput;
    audienceProfile?: string;
    contentGoals?: string;
}

export interface LayoutOutput {
    chosenLayout: {
        id: string;
        name: string;
        whyChosen: string;
        score: number;
        backupLayout: { id: string; score: number };
    };
    header: {
        type: string;
        elements: {
            logoUrl: string;
            newsletterTitle: string;
            issueNumber: number;
            date: string;
            heroImageUrl: string;
            personalization: string;
        };
        cssClass: string;
    };
    footer: {
        type: string;
        elements: {
            companyName: string;
            address: string;
            privacyUrl: string;
            socialLinks: { twitter: string; linkedin: string };
            replyTo: string;
        };
        cssClass: string;
    };
    sectionsOrder: Array<{
        position: number;
        type: string;
        sourceSection: string;
        wordLimit: number;
        visualType: string;
        cssClass: string;
    }>;
    cssFramework: string;
    designTokens: {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        textColor: string;
        bgColor: string;
        fontFamily: string;
        baseFontSize: number;
    };
    dynamicElements: Array<{
        type: string;
        position: string;
        source: string;
        cssClass: string;
    }>;
    mobileNotes: string;
    previewDescription: string;
    rawJson: string; // Original JSON response for debugging
}

const LAYOUT_PROMPT = `
You are LayoutAgent v3. You analyze content to create optimal NEWSLETTER structures (not blog layouts).

GOAL: Select newsletter layout pattern, header, footer, and structure. Output JSON blueprint.

CRITICAL: This is for EMAIL NEWSLETTERS, not websites or blogs.

RULES:
1. Vary layout based on content (avoid repetition)
2. Mobile-first responsive (single-column stack at 320px)
3. Email client compatibility (tables, inline CSS)
4. Score layouts (0-100) based on content fit

NEWSLETTER LAYOUT PATTERNS (Select one that fits content best):
1. "newsletter_digest": Multi-story cards with brief summaries (Morning Brew style)
2. "newsletter_magazine": Featured hero story + 2-3 sidebar items (The Hustle style)
3. "newsletter_curated": Hand-picked items with curator commentary (Dense Discovery style)
4. "newsletter_roundup": Quick hits organized by category with emoji headers (TLDR style)
5. "newsletter_timeline": Chronological event sequence + synthesis (Axios style)
6. "newsletter_framework": One deep concept + practical examples (First Round Review style)

AVOID generic blog-style patterns like "data_story" or "tool_showcase" - this is a NEWSLETTER.

NEWSLETTER HEADER TYPES (Pick one):
- "NEWSLETTER_MASTHEAD": Brand Name + Date + Issue # (classic newsletter header)
- "PERSONAL_SENDER": "From [Brand Name]" with personal touch
- "MINIMAL_BRAND": Just brand name with subtle date below
- "DATE_FIRST": Date prominently displayed, brand name as subtitle

FOOTER TYPES:
- "FULL_COMPLIANCE": Corporate/B2B with address, unsubscribe, privacy (default)
- "ENGAGEMENT_FOOTER": Personal/Creator with social links, reply CTA
- "MINIMAL_FOOTER": Simple unsubscribe link only

CSS FRAMEWORKS (Visual structure):
"newsletter_cards", "newsletter_blocks", "newsletter_list", "newsletter_magazine", "newsletter_minimalist"

DYNAMIC ELEMENTS (Newsletter-specific):
"section_divider", "emoji_header", "quick_summary_box", "pullquote", "cta_button", "numbered_list"

## BRAND CONTEXT
- Brand Name: {{brandName}}
- Category: {{brandCategory}}
- Audience: {{audience}}

## CONTENT SUMMARY
Word count: {{wordCount}}
Subject: {{subjectLines}}
Preview: {{contentPreview}}

## OUTPUT REQUIREMENTS
Output ONLY valid JSON:

{
  "chosen_layout": { "id": "newsletter_digest", "name": "Newsletter Digest", "score": 85, "why_chosen": "Multiple stories suit digest format" },
  "header": { "type": "NEWSLETTER_MASTHEAD", "elements": { "newsletter_title": "{{brandName}} Newsletter", "date": "{{currentDate}}", "issue_number": 1 }, "css_class": "newsletter-masthead" },
  "footer": { "type": "FULL_COMPLIANCE", "elements": { "company_name": "{{brandName}}", "unsubscribe_text": "Unsubscribe" }, "css_class": "newsletter-footer" },
  "sections_order": [ { "position": 1, "type": "hero", "source_section": "main_story", "visual_type": "card", "css_class": "hero-card" } ],
  "css_framework": "newsletter_cards",
  "design_tokens": { "primary_color": "[UNIQUE HEX]", "secondary_color": "[UNIQUE HEX]", "accent_color": "[UNIQUE HEX]", "text_color": "#111827", "bg_color": "#ffffff", "font_family": "[MATCH STYLE]", "border_radius": "[0px OR 4px OR 12px]" },
  "dynamic_elements": [ { "type": "cta_button", "position": "end", "source": "cta", "css_class": "cta-primary" } ],
  "mobile_notes": "All sections stack vertically on mobile, touch-friendly spacing"
}
`;

export async function executeLayoutAgent(input: LayoutInput): Promise<LayoutOutput> {
    const { brand, writerOutput, audienceProfile, contentGoals } = input;

    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // Calculate word count from raw content
    const wordCount = writerOutput.rawContent.split(/\s+/).length;

    const prompt = LAYOUT_PROMPT
        .replace(/{{brandName}}/g, brand.name)
        .replace(/{{brandCategory}}/g, brand.category || 'General')
        .replace(/{{audience}}/g, audienceProfile || brand.audience || 'General professionals')
        .replace(/{{brandDomain}}/g, brand.domain || 'https://example.com')
        .replace(/{{wordCount}}/g, String(wordCount))
        .replace(/{{subjectLines}}/g, writerOutput.subjectLines.join(', '))
        .replace(/{{contentPreview}}/g, writerOutput.rawContent.substring(0, 1500))
        .replace(/{{currentDate}}/g, currentDate);

    console.log("\\n╔══════════════════════════════════════╗");
    console.log("║       AGENT 3: LAYOUT AGENT          ║");
    console.log("╚══════════════════════════════════════╝");
    console.log(`> Analyzing content structure...`);
    console.log(`> Word count: ${wordCount}`);
    console.log(`> Selecting optimal layout pattern...`);

    let rawResponse = "";
    try {
        rawResponse = await generateText(prompt);
        console.log(`> Raw response received (${rawResponse.length} chars)`);
    } catch (error) {
        console.error("> Error generating layout:", error);
        // Fallback to empty string to trigger default json handling
        rawResponse = "{}";
    }

    // Extract JSON from response
    let layoutJson: any = null;
    try {
        // Try to find JSON in response
        const jsonMatch = rawResponse.match(/\\{[\\s\\S]*\\}/);
        if (jsonMatch) {
            layoutJson = JSON.parse(jsonMatch[0]);
        }
    } catch (error) {
        console.log("> Warning: Could not parse layout JSON, using defaults.");
    }

    // Generate fallback color palette based on brand category for uniqueness
    const fallbackPalette = generateValidatedPalette(brand.category || 'general');

    // Build output with defaults for any missing fields
    const output: LayoutOutput = {
        chosenLayout: {
            id: layoutJson?.chosen_layout?.id || 'cards_grid',
            name: layoutJson?.chosen_layout?.name || 'Card Grid Layout',
            whyChosen: layoutJson?.chosen_layout?.why_chosen || 'Default selection for content variety',
            score: layoutJson?.chosen_layout?.score || 75,
            backupLayout: layoutJson?.chosen_layout?.backup_layout || { id: 'morning_brew', score: 70 }
        },
        header: {
            type: layoutJson?.header?.type || 'LOGO_PILL',
            elements: {
                logoUrl: layoutJson?.header?.elements?.logo_url || '',
                newsletterTitle: layoutJson?.header?.elements?.newsletter_title || `${brand.name} Newsletter`,
                issueNumber: layoutJson?.header?.elements?.issue_number || 1,
                date: layoutJson?.header?.elements?.date || currentDate,
                heroImageUrl: layoutJson?.header?.elements?.hero_image_url || '',
                personalization: layoutJson?.header?.elements?.personalization || ''
            },
            cssClass: layoutJson?.header?.css_class || 'header-logo-pill'
        },
        footer: {
            type: layoutJson?.footer?.type || 'FULL_COMPLIANCE',
            elements: {
                companyName: layoutJson?.footer?.elements?.company_name || brand.name,
                address: layoutJson?.footer?.elements?.address || '',
                privacyUrl: layoutJson?.footer?.elements?.privacy_url || '',
                socialLinks: layoutJson?.footer?.elements?.social_links || { twitter: '', linkedin: '' },
                replyTo: layoutJson?.footer?.elements?.reply_to || ''
            },
            cssClass: layoutJson?.footer?.css_class || 'footer-full'
        },
        sectionsOrder: layoutJson?.sections_order || [
            { position: 1, type: 'hero', sourceSection: 'title', wordLimit: 50, visualType: 'none', cssClass: 'hero-block' },
            { position: 2, type: 'main_section', sourceSection: 'content', wordLimit: 800, visualType: 'none', cssClass: 'content-card' },
            { position: 3, type: 'cta', sourceSection: 'cta', wordLimit: 50, visualType: 'none', cssClass: 'cta-block' }
        ],
        cssFramework: layoutJson?.css_framework || 'cards_grid',
        designTokens: {
            primaryColor: layoutJson?.design_tokens?.primary_color || fallbackPalette.primary,
            secondaryColor: layoutJson?.design_tokens?.secondary_color || fallbackPalette.secondary,
            accentColor: layoutJson?.design_tokens?.accent_color || fallbackPalette.accent,
            textColor: layoutJson?.design_tokens?.text_color || fallbackPalette.text,
            bgColor: layoutJson?.design_tokens?.bg_color || fallbackPalette.background,
            fontFamily: layoutJson?.design_tokens?.font_family || "'Segoe UI', Roboto, sans-serif",
            baseFontSize: layoutJson?.design_tokens?.base_font_size || 16
        },
        dynamicElements: layoutJson?.dynamic_elements || [
            { type: 'cta_button', position: 'end', source: 'cta', cssClass: 'cta-primary' }
        ],
        mobileNotes: layoutJson?.mobile_notes || 'All sections stack vertically at 320px',
        previewDescription: layoutJson?.preview_description || 'Modern newsletter layout with cards',
        rawJson: rawResponse
    };

    console.log(`> Layout Selected: ${output.chosenLayout.id} (Score: ${output.chosenLayout.score})`);
    console.log(`> Header: ${output.header.type}`);
    console.log(`> Footer: ${output.footer.type}`);
    console.log(`> CSS Framework: ${output.cssFramework}`);
    console.log(`> Sections: ${output.sectionsOrder.length}`);
    console.log(`> Colors: ${output.designTokens.primaryColor}, ${output.designTokens.accentColor}`);

    return output;
}
