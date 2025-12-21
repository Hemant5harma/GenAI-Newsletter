'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import AgentLoader from './ui/AgentLoader';
import { Sparkles } from 'lucide-react';

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
            <Button
                onClick={handleGenerate}
                disabled={isGenerating || isPending}
                className="gap-2"
            >
                <Sparkles size={16} />
                Generate New Issue
            </Button>
        </>
    );
}
