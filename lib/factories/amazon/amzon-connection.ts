import { AMAZON_DOMAINS, AMAZON_ENDPOINTS, AMAZON_MARKETPLACES } from "@/lib/endpoints";
import { AmazonConnection } from "@/types/amazon/amazon-connection";

export function amazonToConnection(marketplace: string): AmazonConnection {
    let foundRegion: string | undefined;
    let foundCountry: string | undefined;

    // Buscar la región y país correspondiente al marketplace code
    outer: for (const [region, countries] of Object.entries(AMAZON_DOMAINS)) {
        for (const [country, domain] of Object.entries(countries)) {
            if (domain === marketplace) {
                foundRegion = region;
                foundCountry = country;
                break outer;
            }
        }
    }

    if (!foundRegion || !foundCountry) {
        throw new Error(`Marketplace code "${marketplace}" not found in AMAZON_DOMAINS.`);
    }

    // Obtener el endpoint adecuado según la región
    let endpoint: string;
    if (foundRegion === "North America") {
        endpoint = AMAZON_ENDPOINTS["us-east-1"];
    } else if (foundRegion === "Europe") {
        endpoint = AMAZON_ENDPOINTS["eu-west-1"];
    } else if (foundRegion === "Far East") {
        endpoint = AMAZON_ENDPOINTS["us-west-2"];
    } else {
        throw new Error(`No endpoint configured for region "${foundRegion}".`);
    }

    // Obtener el marketplace ID
    const regionMarketplaces = (AMAZON_MARKETPLACES as Record<string, Record<string, string>>)[foundRegion];
    const marketplaceId = regionMarketplaces?.[foundCountry];
    if (!marketplaceId) {
        throw new Error(`Marketplace ID not found for region "${foundRegion}" and country "${foundCountry}".`);
    }

    return {
        endpoint,
        domain: marketplace,
        marketplace: marketplaceId,
    };
}