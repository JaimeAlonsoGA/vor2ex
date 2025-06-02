// "use server";

// import { getNiche } from "@/lib/factories/niche-item";
// import { upsertNiche } from "@/services/client/niches.client";
// import { Product } from "@/types/product";
// import { Niche } from "@/types/analytics/analytics";
// import { amazonToProduct } from "../factories/amazon/amazon-item";
// import { getSettings } from "@/services/settings.server";
// import { amazonToConnection } from "@/lib/factories/amazon/amzon-connection";
// import { validateAmazonTokens } from "./validate-tokens";

// export async function searchProductsAction(term: string): Promise<{
//     products: Product[];
//     niche: Niche;
// }> {
//     if (!term.trim()) {
//         return { products: [], niche: {} as Niche };
//     }
//     await validateAmazonTokens();
//     const settings = await getSettings();
//     const connection = amazonToConnection(settings?.amazon_marketplace);
//     console.log("Collecting data for term:", term, "using connection:", connection);

//     // Lanza todas las promesas en paralelo
//     const [amazonApiData, scraperData, alibabaApiData] = await Promise.all([
//         getAmazonCatalogAction(term, connection.endpoint, connection.marketplace),
//         getAmazonProductsAction(term, connection.domain),
//         scrapeAndParseAlibaba(term),
//     ]);

//     const amazonApiDataNextPage = await getAmazonNextPageAction(term, connection.endpoint, connection.marketplace, amazonApiData.pagination?.nextToken);
//     const nextNextPage = await getAmazonNextPageAction(term, connection.endpoint, connection.marketplace, amazonApiDataNextPage.pagination?.nextToken);

//     // Refina productos de Amazon (scraper)
//     const refinedScrapedData = scraperData.items.map(item => amazonToProduct(item, connection.domain));
//     const sponsoredProducts = refinedScrapedData.filter(item => item.isSponsored && item.asin);

//     // Lanza en paralelo las peticiones por ASIN solo para los patrocinados
//     const sponsoredProductsData = sponsoredProducts.length
//         ? await Promise.all(
//             sponsoredProducts.map(item =>
//                 getAmazonProductDetailsAction(item.asin!)
//             )
//         )
//         : [];

//     // Fusiona datos de API y patrocinados por ASIN
//     const apiByAsin = new Map<string, any>();
//     if (amazonApiData?.items?.length) {
//         amazonApiData.items.forEach(apiItem => {
//             if (apiItem.asin) apiByAsin.set(apiItem.asin, apiItem);
//         });
//         amazonApiDataNextPage.items.forEach(apiItem => {
//             if (apiItem.asin) apiByAsin.set(apiItem.asin, apiItem);
//         });
//         nextNextPage.items.forEach(apiItem => {
//             if (apiItem.asin) apiByAsin.set(apiItem.asin, apiItem);
//         });
//     }
//     sponsoredProductsData.forEach(spData => {
//         if (spData && spData.asin) {
//             apiByAsin.set(spData.asin, spData);
//         }
//     });

//     // Fusiona productos scraper + API
//     const mergedProducts = scraperData.items.map(item =>
//         apiByAsin.has(item.asin)
//             ? amazonToProduct(item, connection.domain, apiByAsin.get(item.asin))
//             : amazonToProduct(item, connection.domain)
//     );

//     // Junta todos los productos (Alibaba + Amazon)
//     const allProducts: Product[] = [
//         ...(alibabaApiData.products || []),
//         ...mergedProducts,
//     ];

//     const uniqueProducts = allProducts.filter(
//         (product, index, self) =>
//             product.asin
//                 ? self.findIndex(p => p.asin === product.asin) === index
//                 : index === self.findIndex(p => !p.asin && p === product)
//     );

//     // Calcula analíticas del nicho
//     const niche = getNiche(term, amazonApiData, alibabaApiData, uniqueProducts, connection.domain);

//     // Upsert nicho en background (no bloquea el SSR)
//     upsertNiche(niche, connection.domain).catch(console.error);

//     return {
//         products: uniqueProducts,
//         niche,
//     };
// }