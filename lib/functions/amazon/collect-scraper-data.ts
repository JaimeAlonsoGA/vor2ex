import { AmazonScraperResponse } from "@/types/amazon/amazon-factory";
import { fetchAmazonSearch } from "@/services/amazon/amazon.service";

export { collectAmazonSearchData };

async function collectAmazonSearchData(keyword: string, domain: string, page?: number): Promise<AmazonScraperResponse> {
    const response = await fetchAmazonSearch(keyword, domain, page || 1);
    if (!response) {
        return { page: 0, url: "", items: [] };
    }
    const items = Object.values(response?.results[0].content.results.results || {})
        .flat();
    const searchUrl = response?.results[0].content.results.url!;
    const searchPage = response?.results[0].content.results.page!;
    return { page: searchPage, url: searchUrl, items };
}
