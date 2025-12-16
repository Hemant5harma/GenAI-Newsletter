'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmDialog from './ui/ConfirmDialog';

interface DeleteBrandButtonProps {
    brandId: string;
    brandName: string;
    deleteAction: (brandId: string) => Promise<{ success: boolean }>;
}

export default function DeleteBrandButton({ brandId, brandName, deleteAction }: DeleteBrandButtonProps) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteAction(brandId);
            router.push('/dashboard');
            router.refresh();
        } catch (error) {
            console.error('Delete failed:', error);
            setIsDeleting(false);
            setIsConfirmOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsConfirmOpen(true);
                }}
                className="delete-brand-btn"
                title="Delete brand"
                style={{
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-md)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.875rem',
                    opacity: 0,
                    transition: 'all var(--transition-fast)'
                }}
            >
                🗑️
            </button>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                title="Delete Brand"
                message={`Are you sure you want to delete "${brandName}"? This will permanently remove all newsletters and settings. This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                isLoading={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </>
    );
}
