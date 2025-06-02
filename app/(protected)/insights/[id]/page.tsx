import { getCardsConfig, renderCard } from "@/components/dashboard/analytics/cards";
import GoBack from "@/components/dashboard/ui/go-back";
import { dbToNiche } from "@/lib/factories/niche-item";
import { getNicheById } from "@/services/niches.server";

interface NichePageProps {
    params: Promise<{ id: string }>;
};

export default async function NichePage({ params }: NichePageProps) {
    const id = await params;
    if (!id || !id.id) {
        return <div className="text-center">Niche not found</div>;
    }
    const niche = dbToNiche((await getNicheById(id.id)));
    return (
        <section className="space-y-4">
            <div className="flex items-center gap-4">
                <GoBack routeName="Insights" />
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