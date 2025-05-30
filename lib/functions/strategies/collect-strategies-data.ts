import { dbToStrategy } from "@/lib/factories/strategy-item";
import { getStrategies } from "@/services/strategies.server";
import { Strategy } from "@/types/analytics/strategies";

export async function collectUserStrategiesData(): Promise<Strategy[]> {
    const userStrategies = await getStrategies();
    const dbStrategies = userStrategies.map(dbToStrategy);
    return dbStrategies;
}
