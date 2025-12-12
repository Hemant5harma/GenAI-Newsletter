'use client'

import { deleteIssueAction } from "@/app/actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteIssueButton({ issueId, brandId }: { issueId: string; brandId: string }) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        startTransition(async () => {
            await deleteIssueAction(issueId, brandId);
            router.push(`/dashboard/brands/${brandId}`);
        });
    };

    if (!showConfirm) {
        return (
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirm(true);
                }}
                className="btn btn-ghost"
                style={{ padding: '0.5rem', color: 'var(--color-error)' }}
                title="Delete Issue"
            >
                🗑️
            </button>
        );
    }

    return (
        <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-error)' }}>Delete?</span>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleDelete();
                }}
                disabled={isPending}
                className="btn btn-ghost"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-error)' }}
            >
                {isPending ? '...' : 'Yes'}
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowConfirm(false);
                }}
                className="btn btn-ghost"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
            >
                No
            </button>
        </div>
    );
}
