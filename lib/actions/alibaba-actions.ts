import { scrapeAndParseAlibaba } from "../functions/alibaba/get-alibaba-data";
import { AlibabaProductsFactoryResponse } from "@/types/alibaba/alibaba-factory";
import { upsertNiche } from "@/services/client/niches.client";
import { dbToNiche, getNiche, upsertLocalNiche } from "../factories/niche-item";
import { AmazonConnection } from "@/types/amazon/amazon-connection";
import { getNicheByKeyword } from "@/services/niches.server";

export async function collectAlibabaProductsAction(term: string, connection: AmazonConnection): Promise<AlibabaProductsFactoryResponse> {
    const alibabaApiData = await scrapeAndParseAlibaba(term);

    const existingNicheDb = await getNicheByKeyword(term, connection.domain);

    let niche;
    if (existingNicheDb) {
        const existingNiche = dbToNiche(existingNicheDb);
        niche = upsertLocalNiche(existingNiche, term, connection.domain, alibabaApiData);
    } else {
        niche = getNiche(term, connection.domain, undefined, alibabaApiData);
    }

    await upsertNiche(niche, connection.domain);
    return alibabaApiData;
}