'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import AgentLoader from './ui/AgentLoader';

interface GenerateIssueButtonProps {
    brandId: string;
    generateAction: (formData: FormData) => Promise<void>;
}

export default function GenerateIssueButton({ brandId, generateAction }: GenerateIssueButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleGenerate = async () => {
        setIsGenerating(true);

        const formData = new FormData();
        formData.append('brandId', brandId);

        startTransition(async () => {
            try {
                await generateAction(formData);
            } catch (error) {
                console.error('Generation failed:', error);
                setIsGenerating(false);
            }
        });
    };

    return (
        <>
            <AgentLoader isVisible={isGenerating || isPending} />
            <button
                onClick={handleGenerate}
                className="btn btn-primary"
                disabled={isGenerating || isPending}
            >
                <span>✨</span> Generate New Issue
            </button>
        </>
    );
}
