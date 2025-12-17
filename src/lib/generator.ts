/**
 * Newsletter Generator - 5-Agent Pipeline
 * 
 * Orchestrates the multi-agent workflow:
 * 1. Research Agent → Gathers content
 * 2. Writer Agent → Writes 1000+ word content
 * 3. Layout Agent → Selects optimal layout, header, footer, colors
 * 4. Designer Agent → Creates styled HTML
 * 5. Finalizer Agent → Quality analysis
 */

import { db } from "./db";
import {
    executeResearchAgent,
    executeWriterAgent,
    executeLayoutAgent,
    executeDesignerAgent,
    executeFinalizerAgent,
    ResearchInput,
    WriterInput,
    LayoutInput,
    DesignerInput,
    FinalizerInput
} from "./agents";

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

export interface BrandData {
    name: string;
    category: string | null;
    tone: string | null;
    audience: string | null;
    description: string | null;
    tagline: string | null;
    domain: string | null;
}

// Color palettes for random selection
const PALETTES = [
    { p: '#6366f1', s: '#8b5cf6' }, // Indigo
    { p: '#ef4444', s: '#f87171' }, // Red
    { p: '#10b981', s: '#34d399' }, // Emerald
    { p: '#f59e0b', s: '#fbbf24' }, // Amber
    { p: '#3b82f6', s: '#60a5fa' }, // Blue
    { p: '#ec4899', s: '#f472b6' }, // Pink
    { p: '#111827', s: '#374151' }, // Dark Mode
];

// ============================================================================
// MAIN GENERATION FUNCTION - 4-AGENT PIPELINE
// ============================================================================
export async function generateNewsletterForBrand(brandId: string): Promise<string> {
    const brand = await db.brand.findUnique({
        where: { id: brandId },
        include: { brandVoice: true }
    });
    if (!brand) throw new Error("Brand not found");

    console.log("\n╔════════════════════════════════════════════════════════╗");
    console.log("║         5-AGENT NEWSLETTER GENERATION PIPELINE         ║");
    console.log("╚════════════════════════════════════════════════════════╝");
    console.log(`\n🏢 Brand: ${brand.name}`);
    console.log(`📂 Category: ${brand.category || 'General'}`);
    console.log(`🎯 Audience: ${brand.audience || 'General'}`);

    const settings = brand.settings ? (brand.settings as unknown as GenerationSettings) : defaultSettings;

    // Get colors
    const randomPalette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    const primaryColor = settings.colors.mode === 'manual' ? settings.colors.primary : randomPalette.p;
    const secondaryColor = settings.colors.mode === 'manual' ? settings.colors.secondary : randomPalette.s;

    // Get images
    const images = settings.images.mode === 'manual' ? settings.images.urls : [];

    // Get categories and keywords
    const categories = settings.categories.mode === 'manual' ? settings.categories.list : [];
    const keywords = settings.keywords || [];

    const issue = await db.issue.create({
        data: { brandId: brand.id, status: "GENERATING" }
    });

    try {
        // ═══════════════════════════════════════════════════════════════
        // AGENT 1: RESEARCH
        // ═══════════════════════════════════════════════════════════════
        const researchInput: ResearchInput = {
            brand,
            categories,
            keywords,
            customTopic: settings.content.mode === 'manual' ? settings.content.text : undefined
        };

        const researchOutput = await executeResearchAgent(researchInput);

        // ═══════════════════════════════════════════════════════════════
        // AGENT 2: WRITER
        // ═══════════════════════════════════════════════════════════════
        const writerInput: WriterInput = {
            brand,
            research: researchOutput,
            tone: brand.tone || 'witty, smart, and conversational',
            wordCountMin: 1000
        };

        const writerOutput = await executeWriterAgent(writerInput);

        // ═══════════════════════════════════════════════════════════════
        // AGENT 3: LAYOUT
        // ═══════════════════════════════════════════════════════════════
        const layoutInput: LayoutInput = {
            brand,
            writerOutput,
            audienceProfile: brand.audience || undefined,
            contentGoals: undefined
        };

        const layoutOutput = await executeLayoutAgent(layoutInput);

        // Use colors from Research Agent (dynamic based on content)
        const finalColors = {
            primary: researchOutput.colorPalette.primary,
            secondary: researchOutput.colorPalette.secondary,
            accent: researchOutput.colorPalette.accent,
            text: researchOutput.colorPalette.text,
            background: researchOutput.colorPalette.background
        };

        // ═══════════════════════════════════════════════════════════════
        // AGENT 4: DESIGNER
        // ═══════════════════════════════════════════════════════════════
        const designerInput: DesignerInput = {
            brand,
            content: writerOutput,
            colors: { primary: finalColors.primary, secondary: finalColors.secondary },
            images,
            layoutBlueprint: layoutOutput,
            colorPalette: finalColors
        };

        const designerOutput = await executeDesignerAgent(designerInput);

        // ═══════════════════════════════════════════════════════════════
        // AGENT 5: FINALIZER
        // ═══════════════════════════════════════════════════════════════
        const finalizerInput: FinalizerInput = {
            brand,
            design: designerOutput
        };

        const finalOutput = await executeFinalizerAgent(finalizerInput);

        // ═══════════════════════════════════════════════════════════════
        // SAVE TO DATABASE
        // ═══════════════════════════════════════════════════════════════
        await db.issue.update({
            where: { id: issue.id },
            data: {
                subject: finalOutput.subject,
                preheader: finalOutput.preheader,
                htmlContent: finalOutput.html,
                status: "DRAFT"
            }
        });

        console.log("\n╔════════════════════════════════════════════════════════╗");
        console.log("║              ✅ GENERATION COMPLETE                    ║");
        console.log("╚════════════════════════════════════════════════════════╝");
        console.log(`📧 Subject: ${finalOutput.subject}`);
        console.log(`📊 Spam Score: ${finalOutput.qualityReport.spamScore}/100`);
        console.log(`📝 HTML Size: ${finalOutput.html.length} chars`);

        return issue.id;

    } catch (error) {
        console.error("\n❌ Generation failed:", error);
        await db.issue.update({ where: { id: issue.id }, data: { status: "FAILED" } });
        throw error;
    }
}


