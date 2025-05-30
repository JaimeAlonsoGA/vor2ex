import { sendPasswordReset, updateSettings } from "@/services/client/users.client";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { Button } from "../../ui/button";
import { KeyRound, Loader2, Save } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { useRouter } from "next/navigation";

export function UserForm({ settings, user }: { settings: Tables<'settings'>; user: User }) {
    const [form, setForm] = useState({
        name: settings.name,
        amazon_marketplace: settings.amazon_marketplace,
        language: settings.language,
    });
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSelect = (name: string, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        toast.promise(
            updateSettings({ ...form }).then(() => {
                setLoading(false);
                router.refresh();
            }),
            {
                loading: "Saving changes...",
                success: "Profile updated",
                error: "Error updating profile",
            }
        );
    };

    const handleResetPassword = async () => {
        setResetLoading(true);
        toast.promise(
            sendPasswordReset(user.email!).then(() => {
                setResetLoading(false);
            }),
            {
                loading: "Sending reset email...",
                success: "Reset email sent",
                error: "Error sending reset email",
            }
        );
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto justify-center bg-background rounded-xl shadow-lg p-6 space-y-6 border border-border"
            aria-label="User settings form"
        >
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="bg-muted cursor-not-allowed"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                    value={form.language.slice(0, 1).toUpperCase() + form.language.slice(1)}
                    onValueChange={value => handleSelect("language", value)}
                >
                    <SelectTrigger id="language" className="w-full">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="amazon_marketplace">Marketplace</Label>
                <Select
                    value={form.amazon_marketplace}
                    onValueChange={value => handleSelect("amazon_marketplace", value)}
                >
                    <SelectTrigger id="amazon_marketplace" className="w-full">
                        <SelectValue placeholder="Select marketplace" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="us">United States (us)</SelectItem>
                        <SelectItem value="eu">Europe (eu)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-2 pt-2">
                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                    aria-disabled={loading}
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    Save changes
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleResetPassword}
                    disabled={resetLoading}
                    aria-disabled={resetLoading}
                >
                    {resetLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <KeyRound className="w-4 h-4 mr-2" />
                    )}
                    Reset password
                </Button>
            </div>
        </form>
    );
}