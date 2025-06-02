"use server"

import { fetchAmazonSearch } from "@/services/amazon/amazon.service";
import { fetchCatalogItem, fetchCatalogItems, fetchNextAmazonCatalogPage } from "@/services/amazon/sp-api/amazon.service";
import { AmazonAPIFactoryResponse, AmazonScraperResponse } from "@/types/amazon/amazon-factory";
import { AmazonItem } from "@/types/amazon/sp-api/amazon-item";

export async function getAmazonProductsData(keyword: string, domain: string, page?: number): Promise<AmazonScraperResponse> {
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

export async function getAmazonNextPageData(
    keyword: string,
    endpoint: string,
    marketplace: string,
    paginationToken?: string,
): Promise<AmazonAPIFactoryResponse> {
    if (!paginationToken) {
        return { items: [], pagination: undefined, numberOfResults: 0 };
    }
    const catalog = await fetchNextAmazonCatalogPage(paginationToken, keyword, endpoint, marketplace);
    return {
        items: catalog.items ?? [],
        pagination: catalog.pagination,
        numberOfResults: catalog.numberOfResults,
    };
}

export async function getAmazonCatalog(
    keyword: string,
    endpoint: string,
    marketplace: string,
): Promise<AmazonAPIFactoryResponse> {
    const catalog = await fetchCatalogItems(keyword, endpoint, marketplace);
    return {
        items: catalog.items ?? [],
        numberOfResults: catalog.numberOfResults,
        pagination: catalog.pagination,
        brands: catalog.refinements?.brands,
    };
}

export async function getAmazonProductDetails(asin: string, endpoint: string, marketplace: string): Promise<AmazonItem | null> {
    try {
        const catalogItem = await fetchCatalogItem(asin, endpoint, marketplace);
        if (!catalogItem) return null;
        return catalogItem as AmazonItem;
    } catch {
        return null;
    }
}