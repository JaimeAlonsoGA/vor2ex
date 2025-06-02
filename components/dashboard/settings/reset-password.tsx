"use client"

import { Button } from "@/components/ui/button";
import { sendPasswordReset } from "@/services/client/users.client";
import { KeyRound, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { toast } from "sonner";

function ResetPassword({ email }: { email: string }) {

    const [resetState, resetAction, isReseting] = useActionState(
        async (_prev: unknown, email: string) => {
            return toast.promise(
                sendPasswordReset(email).then(() => {
                }),
                {
                    loading: "Sending reset email...",
                    success: "Reset email sent",
                    error: "Error sending reset email",
                }
            );
        },
        null
    );

    return (
        <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => resetAction(email)}
            disabled={isReseting}
            aria-disabled={isReseting}
        >
            {isReseting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
                <KeyRound className="w-4 h-4 mr-2" />
            )}
            Reset password
        </Button>
    )
}

export default ResetPassword;