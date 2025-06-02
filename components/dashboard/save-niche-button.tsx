'use client';

import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { use, useActionState, useState } from 'react';
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
    initialPromise ? use(initialPromise) : null;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const initialState: SaveNicheState = {
        saved: savedNiches.includes(term ?? ""),
        action: null,
    };

    const [state, dispatch] = useActionState(
        async (
            prev: SaveNicheState,
            action: { type: 'save' | 'forget'; term: string }
        ): Promise<SaveNicheState> => {
            if (!action.term) return prev;
            setIsLoading(true);
            let response;
            if (action.type === 'save') {
                toast.promise(
                    response = saveNiche(action.term).then(() => {
                        setIsLoading(false);
                    }),
                    {
                        loading: "Saving...",
                        success: "Niche saved",
                        error: "Error saving niche",
                    }
                );
                if (!response) {
                    return prev;
                } else return { saved: true, action: 'save' };
            } else {
                toast.promise(
                    response = deleteUserNicheByKeyword(action.term).then(() => {
                        setIsLoading(false);
                    }),
                    {
                        loading: "Removing...",
                        success: "Niche forgotten",
                        error: "Error removing niche",
                    }
                );
                if (!response) {
                    return prev;
                } else return { saved: false, action: 'forget' };
            }
        },
        initialState
    );

    return (
        <Button
            variant="outline"
            disabled={!term || isLoading}
            className={cn("flex items-center gap-2 transition-colors duration-300",
                state.saved ? "bg-linear-to-br from-blue-600 to-purple-600" : "")}
            onClick={() => {
                if (!term) return;
                dispatch({ type: state.saved ? 'forget' : 'save', term });
            }}
            aria-label={state.saved ? "Forget niche" : "Save niche"}
        >
            {state.saved ? (
                <>
                    <Bookmark className="h-4 w-4 fill-white text-white" />
                    {variant === "long" && <span className='text-white'>{isLoading && state.action === 'forget' ? "Removing..." : "Niche saved"}</span>}
                </>
            ) : (
                <>
                    <Bookmark className="h-4 w-4" />
                    {variant === "long" && <span>{isLoading && state.action === 'save' ? "Saving..." : "Save niche"}</span>}
                </>
            )}
        </Button>
    );
}