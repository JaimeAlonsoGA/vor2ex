"use server"

import { productFromAlibaba } from "@/lib/factories/alibaba-item";
import { AlibabaSearchProduct } from "@/types/alibaba/alibaba-search";
import { fetchAlibabaSearch } from "@/services/alibaba/alibaba.service";
import { AlibabaProductsFactoryResponse } from "@/types/alibaba/alibaba-factory";
import { scrapeAlibabaHtml } from "./alibaba-parser";

export async function scrapeAndParseAlibaba(keyword: string, verified?: boolean, guaranteed?: boolean): Promise<AlibabaProductsFactoryResponse> {
    const response = await fetchAlibabaSearch(keyword, verified, guaranteed);
    if (!response) {
        return { totalProducts: 0, products: [] };
    }
    const result = scrapeAlibabaHtml(response?.results[0]?.content);

    const items = result.products.map((item: AlibabaSearchProduct) => {
        return productFromAlibaba(item);
    });
    return { totalProducts: items.length || 0, products: items };
}