import {
  getFeesEstimate,
  getItemOffers,
  searchCatalogItems,
} from "@/services/amazon.service";

export { collectAmazonCatalogData };

async function collectAmazonCatalogData(keyword: string) {
  const catalog = await searchCatalogItems(keyword);

  if (catalog.items) {
    const itemsWithOffers = await Promise.all(
      catalog.items.map(async (item: any) => {
        try {
          const offers = await getItemOffers(item.asin);
          // const lowestPrice =
          //   offers?.Summary?.LowestPrices?.[0]?.ListingPrice?.Amount ?? 0;
          // const fees = await getFeesEstimate(item.asin, lowestPrice);
          // return { ...item, offers, fees };
          return { ...item, offers };
        } catch (e) {
          // return { ...item, offers: null, fees: null };
          return { ...item, offers: null };
        }
      })
    );
    catalog.items = itemsWithOffers;
  }
  return catalog;
}
