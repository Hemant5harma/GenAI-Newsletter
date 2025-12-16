export interface Claim {
    text: string;
    sourceUrl?: string;
    isStatistic: boolean;
    context: string;
}

export interface VerificationResult {
    claim: Claim;
    status: 'verified' | 'unverified' | 'suspicious';
    credibilityScore: number; // 0-10
    notes?: string;
}

export interface FactCheckReport {
    score: number; // 0-100 overall trust score
    claims: VerificationResult[];
    hasUnverifiedStats: boolean;
}
