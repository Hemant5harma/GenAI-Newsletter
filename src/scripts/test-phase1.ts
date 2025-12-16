import 'dotenv/config';
import { db } from "../lib/db";
import { generateNewsletterForBrand } from "../lib/generator";

async function main() {
    console.log("Testing Phase 1: Advanced Prompt Engineering...");

    // 0. Ensure User
    let user = await db.user.findFirst();
    if (!user) {
        user = await db.user.create({
            data: { email: 'test_phase1@example.com', name: 'Test User' }
        });
    }

    // 1. Create Mock Brand
    const brand = await db.brand.upsert({
        where: { id: 'test-brand-phase1' },
        update: {},
        create: {
            id: 'test-brand-phase1',
            name: "Antigravity Tech",
            domain: "https://antigravity.com",
            userId: user.id,
            tone: "Witty and Intellectual",
            audience: "Senior Engineers",
            category: "AI Trends",
            description: "A newsletter about agentic AI coding."
        }
    });

    console.log("Brand created/found:", brand.name);

    // 2. Trigger Generation
    try {
        console.log("Triggering generation...");
        const issueId = await generateNewsletterForBrand(brand.id);
        console.log("Generation Success! Issue ID:", issueId);

        // 3. Inspect Result
        const issue = await db.issue.findUnique({ where: { id: issueId } });
        // We can't see the prompt here, but the generator logs it to console.
        console.log("Issue Subject:", issue?.subject);
        console.log("Issue Preheader:", issue?.preheader);
        console.log("HTML Content Length:", issue?.htmlContent?.length);

    } catch (error) {
        console.error("Test Failed:", error);
    }
}

main();
