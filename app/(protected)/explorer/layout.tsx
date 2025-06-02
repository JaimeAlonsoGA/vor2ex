import { ModulesCard } from "@/components/modules-cards";
import { validateAmazonTokens } from "@/lib/actions/validate-tokens";

export default async function layout({ children }: { children: React.ReactNode }) {
    const amazonAccess = await validateAmazonTokens();
    if (!amazonAccess.success) {
        return <div className="text-center">Couldn't connect with data providers</div>;
    }

    return (
        <div className="flex flex-col gap-12 mx-auto w-full p-2 overflow-y-hidden">
            {children}
            <ModulesCard analytics opportunities tools />
        </div>
    );
}