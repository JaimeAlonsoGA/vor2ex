import { estimateMonthlySales } from "../functions/estimate-monthly-sales";
import { AmazonItem } from "../types/amazon/sp-api/amazonItem";
import { Product } from "../types/product";

export function amazonResponseToProductCard(item: AmazonItem): Product {
    const summary = item.summaries?.[0];
    const image = item.images?.[0]?.images?.[0];
    const lowestPrice = item.offers?.payload.Summary?.LowestPrices?.[0];
    const buyBox = item.offers?.payload.Summary?.BuyBoxPrices?.[0];
    const offerCount = item.offers?.payload.Summary?.TotalOfferCount;
    const primeEligible = item.offers?.payload.Offers?.some(o => o.PrimeInformation?.IsPrime);
    const buyBoxWinner = item.offers?.payload.Offers?.find(o => o.IsBuyBoxWinner);
    const fulfillmentChannel = lowestPrice?.fulfillmentChannel || buyBoxWinner?.IsFulfilledByAmazon ? "FBA" : "FBM";
    const shippingTime = buyBoxWinner?.ShippingTime
        ? `${buyBoxWinner.ShippingTime.minimumHours}-${buyBoxWinner.ShippingTime.maximumHours}h (${buyBoxWinner.ShippingTime.availabilityType})`
        : undefined;
    const salesRank = item.salesRanks?.[0]?.classificationRanks?.[0]?.rank;
    const estimatedSales = salesRank ? estimateMonthlySales(salesRank) : undefined;

    return {
        id: item.asin,
        name: summary?.itemName ?? "-",
        brand: summary?.brand ?? "-",
        imageUrl: image?.link ?? "",
        price: lowestPrice?.ListingPrice?.Amount ?? buyBox?.ListingPrice?.Amount ?? 0,
        currency: lowestPrice?.ListingPrice?.CurrencyCode ?? buyBox?.ListingPrice?.CurrencyCode ?? "USD",
        category: summary?.browseClassification?.displayName ?? "-",
        url: `https://www.amazon.es/dp/${item.asin}`,
        asin: item.asin,
        sales: salesRank,
        ranking: salesRank,
        estimatedSales,
        fulfillmentChannel,
        isBuyBoxWinner: !!buyBoxWinner,
        buyBoxPrice: buyBox?.ListingPrice?.Amount,
        buyBoxCurrency: buyBox?.ListingPrice?.CurrencyCode,
        offerCount,
        primeEligible,
        shippingTime,
        sellerId: buyBoxWinner?.SellerId,
        // rating and reviews would require additional API calls or data
    };
}