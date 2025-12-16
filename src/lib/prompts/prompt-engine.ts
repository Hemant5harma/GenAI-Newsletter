import { PromptContext, SectionType } from './types';
import { PROMPT_TEMPLATES, CHAIN_OF_THOUGHT_INSTRUCTIONS } from './templates';

export class PromptEngine {
    /**
     * Generates a specific prompt for a newsletter section.
     */
    public generateSectionPrompt(context: PromptContext): string {
        const baseTemplate = PROMPT_TEMPLATES[context.section];
        const filledTemplate = this.injectVariables(baseTemplate, context);
        const temperatureInstruction = this.getTemperatureInstruction(context.section);

        return `
${filledTemplate}

${CHAIN_OF_THOUGHT_INSTRUCTIONS}

${temperatureInstruction}

OUTPUT REQUIREMENTS:
- Return ONLY the content for this section.
- Use simple HTML for formatting (<b>, <i>, <br>, <h2>, <p>).
`;
    }

    /**
     * Injects dynamic context variables into the template.
     */
    private injectVariables(template: string, context: PromptContext): string {
        let prompt = template;

        // Brand Context
        prompt = prompt.replace(/{{audience}}/g, context.brand.audience || 'general readership');
        prompt = prompt.replace(/{{tone}}/g, context.brand.tone || 'professional');
        prompt = prompt.replace(/{{name}}/g, context.brand.name);

        // Dynamic Context Injection (Past Performance / Voice)
        // Placeholder for Week 2 integration
        if (context.brand.voiceProfile) {
            prompt += `\nVOICE PROFILE: Use the following vocabulary: ${JSON.stringify(context.brand.voiceProfile.vocabulary || [])}`;
        }

        if (context.pastPerformance && context.pastPerformance.length > 0) {
            const topMetric = context.pastPerformance[0];
            prompt += `\nPERFORMANCE CONTEXT: Your previous best performing content focused on "${topMetric.name}". Emulate that success.`;
        }

        return prompt;
    }

    /**
     * Returns temperature tuning instructions based on section type.
     */
    private getTemperatureInstruction(section: SectionType): string {
        switch (section) {
            case 'hook':
                return 'TEMPERATURE: 0.8 (Creative, unexpected, high variance).';
            case 'story':
                return 'TEMPERATURE: 0.7 (Engaging, narrative, variable).';
            case 'analysis':
                return 'TEMPERATURE: 0.3 (Precise, factual, consistent).';
            case 'cta':
                return 'TEMPERATURE: 0.5 (Clear, direct, balanced).';
            default:
                return 'TEMPERATURE: 0.5';
        }
    }

    /**
     * High-level method to construct a full newsletter prompt (Monolithic fallback or orchestrator).
     */
    public buildFullPrompt(brand: any, settings: any): string {
        // This can reuse the logic from the old generator but enhanced with the new engine's components
        const context: PromptContext = {
            section: 'story', // Defaulting to story/main body for the monolithic prompt for now
            brand: {
                name: brand.name,
                tone: brand.tone,
                audience: brand.audience,
                voiceProfile: brand.voiceProfile // Will be null for now
            }
        };

        return `
You are an advanced AI Newsletter Generator.
${this.generateSectionPrompt({ ...context, section: 'hook' })}

---
${this.generateSectionPrompt({ ...context, section: 'analysis' })}

---
${this.generateSectionPrompt({ ...context, section: 'cta' })}

Generate the full HTML newsletter combining these elements seamlessly.
    `;
    }
}
