import {
  fetchNextAmazonCatalogPage,
  fetchPreviousAmazonCatalogPage,
  getCatalogItem,
  getItemOffers,
  searchCatalogItems,
} from "@/services/amazon/sp-api/amazon.service";
import { AmazonItem, AmazonResponse } from "@/types/amazon/sp-api/amazon-item";
import { AmazonAPIFactoryResponse } from "@/types/amazon/amazon-factory";
import { validateAmazonTokens } from "./validate-tokens";

export { collectAmazonCatalogData, collectAmazonCatalogDataByAsin, collectAmazonCatalogDataAndOffers, collectAmazonCatalogDataAndOffersByAsin };

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function collectAmazonCatalogDataAndOffers(keyword: string, endpoint: string, marketplace: string, pagination?: 'next' | 'previous', paginationToken?: string): Promise<AmazonAPIFactoryResponse> {
  await validateAmazonTokens();

  let catalog: AmazonResponse;
  let catalogItems: AmazonItem[] = [];
  if (pagination === 'next') {
    catalog = await fetchNextAmazonCatalogPage(paginationToken!, keyword, endpoint, marketplace);
  }
  if (pagination === 'previous') {
    catalog = await fetchPreviousAmazonCatalogPage(paginationToken!, keyword, endpoint, marketplace);
  }
  else {
    catalog = await searchCatalogItems(keyword, endpoint, marketplace);
  }
  if (catalog.items) {
    const itemsWithOffers = await Promise.all(
      catalog.items.map(async (item: any) => {
        let retries = 3;
        while (retries > 0) {
          try {
            const offers = await getItemOffers(item.asin);
            return { ...item, offers };
          } catch (e: any) {
            if (e?.code === "QuotaExceeded" || e?.status === 429) {
              retries--;
              if (retries === 0) {
                return { ...item, offers: null, error: "QuotaExceeded" };
              }
              await delay(2500); // Wait 2.5 seconds before retry
            } else {
              return { ...item, offers: null, error: e?.message || "Unknown error" };
            }
          }
        }
      })
    );
    catalogItems = itemsWithOffers as AmazonItem[];
  }
  return { items: catalogItems, numberOfResults: catalog.numberOfResults, pagination: catalog.pagination, brands: catalog.refinements?.brands };
}

async function collectAmazonCatalogDataAndOffersByAsin(asin: string): Promise<AmazonItem | null> {
  try {
    const catalogItem = await getCatalogItem(asin);
    if (!catalogItem) return null;

    let offers = null;
    let error: string | undefined = undefined;
    let retries = 3;

    while (retries > 0) {
      try {
        offers = await getItemOffers(asin);
        break;
      } catch (e: any) {
        if (e?.code === "QuotaExceeded" || e?.status === 429) {
          retries--;
          if (retries === 0) {
            error = "QuotaExceeded";
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 2500));
        } else {
          error = e?.message || "Unknown error";
          break;
        }
      }
    }
    return { ...catalogItem, offers } as AmazonItem;
  } catch (err) {
    return null;
  }
}
async function collectAmazonCatalogData(
  keyword: string,
  endpoint: string,
  marketplace: string,
  pagination?: 'next' | 'previous',
  paginationToken?: string,
): Promise<AmazonAPIFactoryResponse> {
  let catalog: AmazonResponse;
  if (pagination === 'next') {
    catalog = await fetchNextAmazonCatalogPage(paginationToken!, keyword, endpoint, marketplace);
  } else if (pagination === 'previous') {
    catalog = await fetchPreviousAmazonCatalogPage(paginationToken!, keyword, endpoint, marketplace);
  } else {
    catalog = await searchCatalogItems(keyword, endpoint, marketplace);
  }
  return {
    items: catalog.items ?? [],
    numberOfResults: catalog.numberOfResults,
    pagination: catalog.pagination,
    brands: catalog.refinements?.brands,
  };
}

async function collectAmazonCatalogDataByAsin(asin: string): Promise<AmazonItem | null> {
  try {
    const catalogItem = await getCatalogItem(asin);
    if (!catalogItem) return null;
    return catalogItem as AmazonItem;
  } catch {
    return null;
  }
}