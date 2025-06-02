"use server"

import { dbToStrategy } from "@/lib/factories/strategy-item";
import { getStrategies } from "@/services/strategies.server";
import { Strategy } from "@/types/strategies";

export async function getStrategiesAction(): Promise<Strategy[]> {
    const userStrategies = await getStrategies();
    const dbStrategies = userStrategies.map(dbToStrategy);
    return dbStrategies;
}
