import { dbToStrategy } from "@/lib/factories/strategy-item";
import { getUserStrategies } from "@/services/strategies.server";
import { Strategy } from "@/types/analytics/strategies";

export async function collectUserStrategiesData(): Promise<Strategy[]> {
    const userStrategies = await getUserStrategies();
    const dbStrategies = userStrategies.map(dbToStrategy);
    return dbStrategies;
}
