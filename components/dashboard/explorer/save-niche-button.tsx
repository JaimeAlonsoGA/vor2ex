'use client';

import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { Niche } from '@/types/niche';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { useActionState } from 'react';
import { deleteUserNicheByKeyword, saveNiche } from '@/services/client/users-niches.client';

interface SaveNicheButtonProps {
    savedNiches: string[];
    term?: string;
}

export default function SaveNicheButton({ term, savedNiches }: SaveNicheButtonProps) {
    const isSaved = term ? savedNiches.includes(term) : false;

    const [saveState, saveAction, isSaving] = useActionState(
        async (_prev: unknown, term: string) => {
            return toast.promise(
                saveNiche(term).then(res => {
                    return res;
                }),
                {
                    loading: "Saving...",
                    success: "Niche saved",
                    error: "Error saving niche",
                }
            );
        },
        null
    );

    const [forgetState, forgetAction, isForgetting] = useActionState(
        async (_prev: unknown, term: string) => {
            return toast.promise(
                deleteUserNicheByKeyword(term).then(res => {
                    return res;
                }),
                {
                    loading: "Removing...",
                    success: "Niche forgotten",
                    error: "Error removing niche",
                }
            );
        },
        null
    );

    return (
        <Button
            variant="outline"
            disabled={!term || isSaving || isForgetting}
            className="flex items-center gap-2"
            onClick={() =>
                term && (
                    isSaved
                        ? forgetAction(term)
                        : saveAction(term)
                )
            } aria-label="Save niche"
        >
            {isSaved ? (
                <>
                    <Bookmark className="h-4 w-4 fill-primary text-primary" />
                    <span>{isForgetting ? "Removing..." : "Forget niche"}</span>
                </>
            ) : (
                <>
                    <Bookmark className="h-4 w-4" />
                    <span>{isSaving ? "Saving..." : "Save niche"}</span>
                </>
            )}
        </Button>
    );
}