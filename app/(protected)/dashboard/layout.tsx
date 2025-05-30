import { ModulesCard } from "@/components/modules-cards";


export default async function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-12 mx-auto max-w-2xl lg:max-w-4xl xl:max-w-5xl w-full px-2">
            {children}
            <ModulesCard products opportunities analytics />
        </div>
    );
}