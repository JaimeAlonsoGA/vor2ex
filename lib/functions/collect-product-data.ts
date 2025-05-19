import {
  fetchNextAmazonCatalogPage,
  fetchPreviousAmazonCatalogPage,
  getFeesEstimate,
  getItemOffers,
  searchCatalogItems,
} from "@/services/amazon.service";

export { collectAmazonCatalogData };

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function collectAmazonCatalogData(keyword: string, pagination?: 'next' | 'previous', token?: string) {
  let catalog;
  if (pagination === 'next') {
    catalog = await fetchNextAmazonCatalogPage(token!, keyword);
  }
  if (pagination === 'previous') {
    catalog = await fetchPreviousAmazonCatalogPage(token!, keyword);
  }
  else {
    catalog = await searchCatalogItems(keyword);
  }
  if (!catalog) {
    return null;
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
              await delay(2000); // Wait 2 seconds before retry
            } else {
              return { ...item, offers: null, error: e?.message || "Unknown error" };
            }
          }
        }
      })
    );
    catalog.items = itemsWithOffers;
  }
  return catalog;
}

// const lowestPrice =
//   offers?.Summary?.LowestPrices?.[0]?.ListingPrice?.Amount ?? 0;
// const fees = await getFeesEstimate(item.asin, lowestPrice);
// return { ...item, offers, fees };