"use client";
import { useFormStatus } from "react-dom";
import { Button } from "../../ui/button";
import { Loader2, Save } from "lucide-react";

function SaveFormButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="w-full"
            disabled={pending}
            aria-disabled={pending}
        >
            {pending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
                <Save className="w-4 h-4 mr-2" />
            )}
            Save changes
        </Button>
    );
}

export default SaveFormButton;