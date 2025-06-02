'use client';

import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { startTransition, use, useActionState } from 'react';
import { deleteUserNicheByKeyword, saveNiche } from '@/services/client/users-niches.client';
import { cn } from '@/lib/utils';

interface SaveNicheButtonProps {
    savedNiches: string[];
    initialPromise?: Promise<any>;
    term?: string;
    variant?: 'short' | 'long';
}

type SaveNicheState = {
    saved: boolean;
    action: 'save' | 'forget' | null;
};

export default function SaveNicheButton({ term, savedNiches, initialPromise, variant }: SaveNicheButtonProps) {
    if (initialPromise) use(initialPromise);

    const initialState: SaveNicheState = {
        saved: savedNiches.includes(term ?? ""),
        action: null,
    };

    const [state, dispatch, isPending] = useActionState(
        async (
            prev: SaveNicheState,
            action: { type: 'save' | 'forget'; term: string }
        ): Promise<SaveNicheState> => {
            if (!action.term) return prev;
            if (action.type === 'save') {
                await toast.promise(
                    saveNiche(action.term),
                    {
                        loading: "Saving...",
                        success: "Niche saved",
                        error: "Error saving niche",
                    }
                );
                return { saved: true, action: 'save' };
            } else {
                await toast.promise(
                    deleteUserNicheByKeyword(action.term),
                    {
                        loading: "Removing...",
                        success: "Niche forgotten",
                        error: "Error removing niche",
                    }
                );
                return { saved: false, action: 'forget' };
            }
        },
        initialState
    );

    return (
        <Button
            variant="outline"
            disabled={!term || isPending}
            className={cn(
                "flex items-center gap-2 transition-colors duration-300",
                state.saved ? "bg-linear-to-br from-blue-600 to-purple-600" : ""
            )}
            onClick={() => {
                if (!term) return;
                startTransition(() => {
                    dispatch({ type: state.saved ? 'forget' : 'save', term });
                });
            }}
            aria-label={state.saved ? "Forget niche" : "Save niche"}
        >
            {state.saved ? (
                <>
                    <Bookmark className="h-4 w-4 fill-white text-white" />
                    {variant === "long" && (
                        <span className="text-white">
                            {isPending && state.action === 'forget' ? "Removing..." : "Niche saved"}
                        </span>
                    )}
                </>
            ) : (
                <>
                    <Bookmark className="h-4 w-4" />
                    {variant === "long" && (
                        <span>
                            {isPending && state.action === 'save' ? "Saving..." : "Save niche"}
                        </span>
                    )}
                </>
            )}
        </Button>
    );
}