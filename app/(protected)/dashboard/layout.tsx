import { ModulesCard } from "@/components/modules-cards";


export default async function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-12 mx-auto w-full px-2">
            {children}
            <ModulesCard products opportunities analytics />
        </div>
    );
}