import { productFromAlibaba } from "@/lib/factories/alibaba-item";
import { AlibabaSearchProduct } from "@/lib/types/alibaba/alibaba-search";
import { Product } from "@/lib/types/product";
import { fetchAlibabaSearch } from "@/services/alibaba/alibaba.service";
import { scrapeAlibabaHtml } from "./alibaba-parser";

export { collectAlibabaSearchData };

async function collectAlibabaSearchData(keyword: string, verified?: boolean, guaranteed?: boolean): Promise<Product[]> {
    const response = await fetchAlibabaSearch(keyword, verified, guaranteed);
    if (!response) {
        return [];
    }
    const result = scrapeAlibabaHtml(response?.results[0]?.content);

    const items = result.products.map((item: AlibabaSearchProduct) => {
        return productFromAlibaba(item);
    });
    return items;
}
