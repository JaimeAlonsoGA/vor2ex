import { Product } from "@/types/product";
import { scrapeAndParseAlibaba } from "../functions/alibaba/get-alibaba-data";
import { AlibabaProductsFactoryResponse } from "@/types/alibaba/alibaba-factory";

export async function collectAlibabaProductsAction(term: string): Promise<AlibabaProductsFactoryResponse> {
    const alibabaApiData = await scrapeAndParseAlibaba(term);
    return alibabaApiData;
}