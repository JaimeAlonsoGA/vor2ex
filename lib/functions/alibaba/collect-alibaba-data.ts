import { productFromAlibaba } from "@/lib/factories/alibaba-item";
import { AlibabaSearchProduct } from "@/types/alibaba/alibaba-search";
import { Product } from "@/types/product";
import { fetchAlibabaSearch } from "@/services/alibaba/alibaba.service";
import { scrapeAlibabaHtml } from "./alibaba-parser";
import { AlibabaFactoryResponse } from "@/types/alibaba/alibaba-factory";

export { collectAlibabaSearchData };

async function collectAlibabaSearchData(keyword: string, verified?: boolean, guaranteed?: boolean): Promise<AlibabaFactoryResponse> {
    const response = await fetchAlibabaSearch(keyword, verified, guaranteed);
    if (!response) {
        return { totalProducts: undefined, products: [] };
    }
    const result = scrapeAlibabaHtml(response?.results[0]?.content);

    const items = result.products.map((item: AlibabaSearchProduct) => {
        return productFromAlibaba(item);
    });
    return { totalProducts: result.totalProducts, products: items };
}
