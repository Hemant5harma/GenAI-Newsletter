import 'dotenv/config';
import { db } from "../lib/db";
import { VoiceAnalyzer } from "../lib/voice/analyzer";

async function main() {
    console.log("Testing Phase 2: Brand Voice Extraction...");

    // 0. Ensure User
    let user = await db.user.findFirst();
    if (!user) {
        user = await db.user.create({ data: { email: 'test_voice@example.com', name: 'Voice User' } });
    }

    // 1. Create/Get Brand
    const brand = await db.brand.upsert({
        where: { id: 'test-brand-voice' },
        update: {},
        create: {
            id: 'test-brand-voice',
            name: "Sarcastic Tech",
            domain: "https://sarcasm.tech",
            userId: user.id,
            tone: "Extremely Sarcastic and Cynical",
            audience: "Jaded Developers",
            category: "Tech Satire",
            description: "A newsletter making fun of AI hype."
        }
    });
    console.log("Brand:", brand.name);

    // 2. Test Voice Analyzer (Cold Start)
    const analyzer = new VoiceAnalyzer();
    console.log("Running Cold Start Analysis...");
    const profile = await analyzer.analyzeBrandVoice(brand.id);

    console.log("Generated Voice Profile:");
    console.log(JSON.stringify(profile, null, 2));

    // 3. Save Profile
    await analyzer.saveProfile(brand.id, profile);
    console.log("Profile Saved to DB.");

    // 4. Verify DB
    const saved = await db.brandVoice.findUnique({ where: { brandId: brand.id } });
    console.log("DB Verification:", saved ? "SUCCESS" : "FAILED");
}

main();
