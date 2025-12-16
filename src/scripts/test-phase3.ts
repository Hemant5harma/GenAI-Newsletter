import 'dotenv/config';
import { FactChecker } from "../lib/fact-checker/checker";

async function main() {
    console.log("Testing Phase 3: Fact-Checking Layer...");

    const checker = new FactChecker();

    const sampleHtml = `
      <html>
        <body>
          <h1>The Rise of AI Agents</h1>
          <p>
            Recent studies show that AI agents will automate 40% of coding tasks by 2026.
            (Source: <a href="https://research.mit.edu/ai-automation">MIT Research</a>).
          </p>
          <p>
            However, some claim that 99% of agents fail in production.
            This comes from a tweet by @random_dev on <a href="https://twitter.com/random_dev">Twitter</a>.
          </p>
          <p>
            Another statistic says 50% of developers use VS Code, but this has no source.
          </p>
        </body>
      </html>
    `;

    console.log("Analyzing Sample Content...");
    const report = await checker.checkNewsletter(sampleHtml);

    console.log("=== FACT CHECK REPORT ===");
    console.log("Overall Score:", report.score);
    console.log("Has Unverified Stats:", report.hasUnverifiedStats);

    console.log("\n--- Claims ---");
    report.claims.forEach(r => {
        console.log(`[${r.status.toUpperCase()}] Cred: ${r.credibilityScore} | Claim: "${r.claim.text.substring(0, 50)}..."`);
        if (r.claim.sourceUrl) console.log(`   Source: ${r.claim.sourceUrl}`);
        if (r.notes) console.log(`   Notes: ${r.notes}`);
    });
}

main();
