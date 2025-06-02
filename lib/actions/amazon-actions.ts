import { AmazonProductsFactoryResponse } from "@/types/amazon/amazon-factory";
import { amazonToProduct } from "../factories/amazon/amazon-item";
import { getAmazonCatalog, getAmazonNextPageData, getAmazonProductDetails, getAmazonProductsData } from "../functions/amazon/get-amazon-data";
import { AmazonConnection } from "@/types/amazon/amazon-connection";
import { validateAmazonTokens } from "./validate-tokens";

export async function collectAmazonProductsAction(term: string, connection: AmazonConnection): Promise<AmazonProductsFactoryResponse> {
    validateAmazonTokens();
    // Lanza todas las promesas en paralelo para Amazon
    const [amazonApiData, scraperData] = await Promise.all([
        getAmazonCatalog(term, connection.endpoint, connection.marketplace),
        getAmazonProductsData(term, connection.domain),
    ]);

    // Paginación Amazon API
    const apiSecondPage = await getAmazonNextPageData(term, connection.endpoint, connection.marketplace, amazonApiData.pagination?.nextToken);
    const apiThirdPage = await getAmazonNextPageData(term, connection.endpoint, connection.marketplace, apiSecondPage.pagination?.nextToken);

    // Refina productos de Amazon (scraper)
    const refinedScrapedData = scraperData.items.map(item => amazonToProduct(item, connection.domain));
    const sponsoredProducts = refinedScrapedData.filter(item => item.isSponsored && item.asin);

    // Detecta productos sin categoría o brand
    const missingInfoProducts = refinedScrapedData.filter(
        item => (!item.category || !item.brand) && item.asin
    );

    const asinsToFetch = Array.from(new Set([
        ...sponsoredProducts.map(item => item.asin!),
        ...missingInfoProducts.map(item => item.asin!)
    ]));

    // Lanza en paralelo las peticiones por ASIN solo para los patrocinados
    const detailsData = asinsToFetch.length
        ? await Promise.all(
            asinsToFetch.map(asin =>
                getAmazonProductDetails(asin, connection.endpoint, connection.marketplace)
            )
        )
        : [];

    // Fusiona datos de API y patrocinados por ASIN
    const apiByAsin = new Map<string, any>();
    if (amazonApiData?.items?.length) {
        amazonApiData.items.forEach(apiItem => {
            if (apiItem.asin) apiByAsin.set(apiItem.asin, apiItem);
        });
        apiSecondPage.items.forEach(apiItem => {
            if (apiItem.asin) apiByAsin.set(apiItem.asin, apiItem);
        });
        apiThirdPage.items.forEach(apiItem => {
            if (apiItem.asin) apiByAsin.set(apiItem.asin, apiItem);
        });
    }
    detailsData.forEach(detail => {
        if (detail && detail.asin) {
            apiByAsin.set(detail.asin, detail);
        }
    });

    // Fusiona productos scraper + API
    const mergedProducts = scraperData.items.map(item =>
        apiByAsin.has(item.asin)
            ? amazonToProduct(item, connection.domain, apiByAsin.get(item.asin))
            : amazonToProduct(item, connection.domain)
    );

    return { ...amazonApiData, products: mergedProducts };
}

