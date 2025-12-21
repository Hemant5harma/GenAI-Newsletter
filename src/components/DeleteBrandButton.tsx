'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import ConfirmDialog from './ui/ConfirmDialog';
import { Trash2 } from 'lucide-react';

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
            <Button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsConfirmOpen(true);
                }}
                variant="outline"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-destructive hover:border-destructive/50 hover:bg-destructive/5"
                title="Delete brand"
            >
                <Trash2 size={14} />
                <span className="hidden sm:inline">Delete</span>
            </Button>

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
