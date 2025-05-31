'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { upsertNiche } from '@/services/client/niches.client';
import { Niche } from '@/types/analytics/analytics';
import { Product } from '@/types/product';

interface SaveNicheButtonProps {
    niche?: Niche;
    products: Product[];
    isSaved: boolean;
    onSaveNiche: (keyword: string) => void;
    onRemoveNiche: (keyword: string) => void;
    isLoading: boolean;
    isNicheLoading: boolean;
}

export default function SaveNicheButton({ niche, isSaved, onSaveNiche, onRemoveNiche, isLoading, isNicheLoading, products }: SaveNicheButtonProps) {
    return (
        <Button
            variant="outline"
            disabled={!niche || isLoading || isNicheLoading || !products}
            className="flex items-center gap-2"
            onClick={() => isSaved ? onRemoveNiche(niche?.keyword!) : onSaveNiche(niche?.keyword!)}
            aria-label="Save niche"
        >
            {isSaved ? (
                <>
                    <Bookmark className="h-4 w-4 fill-primary text-primary" />
                    <span>Forget niche</span>
                </>
            ) : (
                <>
                    <Bookmark className="h-4 w-4" />
                    <span>Save niche</span>
                </>
            )}
        </Button>
    );
}