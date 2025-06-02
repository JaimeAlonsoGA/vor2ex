import GoBack from "@/components/dashboard/ui/go-back";

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-6">
            <GoBack routeName="strategies" />
            {children}
        </div>
    );
}