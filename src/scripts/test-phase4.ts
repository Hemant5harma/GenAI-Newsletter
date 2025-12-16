import 'dotenv/config';
import { QualityScorer } from "../lib/quality/scorer";

async function main() {
    console.log("Testing Phase 4: Quality Scoring...");

    const scorer = new QualityScorer();
    const mockBrand = { name: "Antigravity", tone: "Professional" };

    const badContent = "<html><body>Hi. Buy this thing. It is good.</body></html>";
    const goodContent = `
      <html>
        <body>
          <!-- SUBJECT: The Future of Code -->
          <!-- PREHEADER: It's not what you think. -->
          <h1>The Shift is Here</h1>
          <p>Remember when we wrote every line? Those days are fading.</p>
          <ul>
             <li>Efficiency is up 10x</li>
             <li>Creativity is the new syntax</li>
          </ul>
          <p><strong>Antigravity</strong> captures this essence.</p>
        </body>
      </html>
    `;

    console.log("\n--- Testing Poor Content ---");
    const badReport = await scorer.scoreNewsletter(badContent, mockBrand);
    console.log("Score:", badReport.overallScore);
    console.log("Feedback:", badReport.feedback);

    console.log("\n--- Testing Good Content ---");
    const goodReport = await scorer.scoreNewsletter(goodContent, mockBrand);
    console.log("Score:", goodReport.overallScore);
    console.log("Metrics:", goodReport.metrics);
}

main();
