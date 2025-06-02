import { getCardsConfig, renderCard } from "@/components/dashboard/analytics/cards";
import { Button } from "@/components/ui/button";
import { dbToNiche } from "@/lib/factories/niche-item";
import { getNicheById } from "@/services/niches.server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface NichePageProps {
    params: Promise<{ id: string }>;
};

export default async function NichePage({ params }: NichePageProps) {
    const id = await params;
    const niche = dbToNiche((await getNicheById(id.id)));
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-4">
                <Button variant="outline">
                    <Link href={`/insights`} className="flex items-center">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <span className="text-lg font-semibold">
                    <span className="text-primary">{niche.keyword}</span>
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 transition-all">
                {getCardsConfig(niche)
                    .map(card => renderCard(card, "other"))}
            </div>
        </section>
    );
}