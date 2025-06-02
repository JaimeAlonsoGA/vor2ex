import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Tables } from "@/types/supabase";
import { User } from "@supabase/supabase-js";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "../../ui/select";
import { AMAZON_DOMAINS } from "@/lib/endpoints";
import { flags } from "@/lib/flags";
import Image from "next/image";
import { updateUserSettingsAction } from "@/app/(protected)/settings/actions";
import ResetPassword from "./reset-password";
import SaveFormButton from "./save-form";

interface UserFormProps {
    settings: Promise<Tables<'settings'>>;
    user: Promise<User>;
}

export async function UserForm({ settings, user }: UserFormProps) {
    const settingsData = await settings as Tables<'settings'>;
    const userData = await user as User;
    return (
        <form
            action={updateUserSettingsAction}
            className="max-w-md mx-auto justify-center bg-background rounded-xl shadow-lg p-6 space-y-6 border border-border"
            aria-label="User settings form"
        >
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    value={userData.email || ""}
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
                    defaultValue={settingsData.name}
                    required
                    autoComplete="name"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                    name="language"
                    defaultValue={settingsData.language.charAt(0).toUpperCase() + settingsData.language.slice(1).toLowerCase() || "English"}
                >
                    <SelectTrigger id="language" className="w-full">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="amazon_marketplace">Marketplace</Label>
                <Select
                    name="amazon_marketplace"
                    defaultValue={settingsData.amazon_marketplace}
                >
                    <SelectTrigger id="amazon_marketplace" className="w-full">
                        <SelectValue placeholder="Select marketplace" />
                    </SelectTrigger>
                    <SelectContent className="gap-2">
                        <div className="px-2 py-1 text-xs text-muted-foreground font-semibold">North America</div>
                        {Object.entries(AMAZON_DOMAINS["North America"]).map(([country, domain]) => (
                            <SelectItem key={domain} value={domain}>
                                <span className="flex items-center gap-2">
                                    <Image
                                        src={flags[country as keyof typeof flags]}
                                        alt={`${country} flag`}
                                        className="w-4 h-3"
                                        loading="lazy"
                                        width={16}
                                        height={12}
                                    />
                                    <span>
                                        {country}
                                        <span className="text-muted-foreground text-xs ml-1">(.{domain})</span>
                                    </span>
                                </span>
                            </SelectItem>
                        ))}
                        <SelectSeparator />
                        <div className="px-2 py-1 text-xs text-muted-foreground font-semibold">Europe</div>
                        {Object.entries(AMAZON_DOMAINS["Europe"]).map(([country, domain]) => (
                            <SelectItem key={domain} value={domain}>
                                <span className="flex items-center gap-2">
                                    <Image
                                        src={flags[country as keyof typeof flags]}
                                        alt={`${country} flag`}
                                        className="w-4 h-3"
                                        loading="lazy"
                                        width={16}
                                        height={12}
                                    />
                                    <span>
                                        {country}
                                        <span className="text-muted-foreground text-xs ml-1">(.{domain})</span>
                                    </span>
                                </span>
                            </SelectItem>
                        ))}
                        <SelectSeparator />
                        <div className="px-2 py-1 text-xs text-muted-foreground font-semibold">Far East</div>
                        {Object.entries(AMAZON_DOMAINS["Far East"]).map(([country, domain]) => (
                            <SelectItem key={domain} value={domain} disabled>
                                <span className="flex items-center gap-2">
                                    <Image
                                        src={flags[country as keyof typeof flags]}
                                        alt={`${country} flag`}
                                        className="w-4 h-3"
                                        loading="lazy"
                                        width={16}
                                        height={12}
                                    />
                                    <span>
                                        {country}
                                        <span className="text-muted-foreground text-xs ml-1">(.{domain})</span>
                                    </span>
                                </span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-2 pt-2">
                <SaveFormButton />
                <ResetPassword email={userData.email!} />
            </div>
        </form>
    );
}