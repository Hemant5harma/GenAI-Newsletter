
import 'dotenv/config';
import { db } from "../lib/db";
import { generateNewsletterForBrand } from "../lib/generator";

async function main() {
    console.log("Starting verification...");

    // 1. Find a target brand
    const brand = await db.brand.findFirst();
    if (!brand) {
        console.error("No brand found! Please create a brand in the dashboard first.");
        process.exit(1);
    }
    console.log(`Found brand: ${brand.name} (${brand.id})`);

    // 2. Define Test Settings (Manual Mode)
    // We test: 'week' time range, 'Academic' tone, 1500 words, 'serif' font
    const testSettings = {
        // New Feature: Time Range
        timeRange: { mode: 'manual', value: 'week' },

        // New Feature: Tone of Voice
        tone: { mode: 'manual', value: 'Academic' },

        // New Feature: Word Count
        wordCount: { mode: 'manual', value: 1500 },

        // New Feature: Fonts
        fonts: { mode: 'manual', value: 'serif' },

        // New Feature: Images (Count 1)
        images: { mode: 'manual', count: 1, urls: [] },

        // Standard Required Fields
        linksCount: { mode: 'manual', count: 3 },
        categories: { mode: 'random', list: [] },
        content: { mode: 'random', text: '' },
        keywords: ['test', 'verification', 'AI'],
        colors: { mode: 'random', primary: '#333333', secondary: '#dddddd' },
        contentSize: 'medium',
        editorMode: 'html'
    };

    console.log("Updating brand settings to TEST values...");
    console.log(JSON.stringify(testSettings, null, 2));

    await db.brand.update({
        where: { id: brand.id },
        data: { settings: testSettings as any }
    });

    // 3. Trigger Generation
    console.log("\nTriggering generation... (This relies on external AI APIs)");
    try {
        const startTime = Date.now();
        const issueId = await generateNewsletterForBrand(brand.id);
        const duration = (Date.now() - startTime) / 1000;

        console.log(`\n✅ Generation Successful!`);
        console.log(`Issue ID: ${issueId}`);
        console.log(`Time taken: ${duration}s`);

        // 4. Verify Results
        const issue = await db.issue.findUnique({ where: { id: issueId } });

        if (issue) {
            console.log(`\n--- Verification Report ---`);
            console.log(`Status: ${issue.status}`);
            console.log(`Subject: ${issue.subject}`);
            console.log(`HTML Length: ${issue.htmlContent?.length} chars`);

            // Simple heuristic checks
            const html = issue.htmlContent || "";
            const isSerif = html.includes("Georgia") || html.includes("Times New Roman");
            const isLong = html.length > 5000; // Rough proxy for word count

            console.log(`Font Check (Serif): ${isSerif ? "PASS" : "FAIL (Check output)"}`);
            console.log(`Length Check (>5000 chars): ${isLong ? "PASS" : "FAIL (Check output)"}`);
        }

    } catch (e) {
        console.error("\n❌ Generation failed:", e);
        process.exit(1);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
