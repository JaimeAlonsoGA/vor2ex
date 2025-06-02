
import { parseSalesVolume } from "../../functions/amazon/utils";
import { AmazonSearchProduct } from "../../../types/amazon/amazon-search";
import { AmazonItem } from "../../../types/amazon/sp-api/amazon-item";
import { Product } from "../../../types/product";
import { Niche } from "@/types/niche";

export function amazonToProduct(
    item: AmazonSearchProduct,
    domain: string,
    spApiItem?: AmazonItem,
): Product {
    // SP-API helpers
    const summary = spApiItem?.summaries?.[0];
    const image = spApiItem?.images?.[0]?.images?.[0];

    //Offers helpers
    const offersPayload = spApiItem?.offers?.payload;
    const offers = offersPayload;
    const firstOffer = Array.isArray(offers?.Offers) ? offers.Offers[0] : undefined;
    const buyBox = Array.isArray(offers?.Summary?.BuyBoxPrices) ? offers.Summary.BuyBoxPrices[0] : undefined;
    const lowestPrice = Array.isArray(offers?.Summary?.LowestPrices) ? offers.Summary.LowestPrices[0] : undefined;

    // Amazon section
    const ranking =
        spApiItem?.salesRanks?.[0]?.classificationRanks?.[0]?.rank ??
        spApiItem?.salesRanks?.[0]?.displayGroupRanks?.[0]?.rank;

    const category =
        spApiItem?.salesRanks?.[0]?.classificationRanks?.[0]?.title ?? undefined;

    const offerCount =
        item.pricing_count ??
        offers?.Summary?.TotalOfferCount ??
        (Array.isArray(offers?.Offers) ? offers.Offers.length : undefined);

    const imageUrl = item.is_sponsored ? image?.link : item.url_image ?? image?.link;

    const url = item.is_sponsored ? `/dp/${item?.asin}` : item.url ?? `/dp/${item?.asin}`;

    return {
        // Comunes
        id: item.asin,
        source: "amazon",
        name: item.title ?? summary?.itemName ?? "",
        brand: summary?.brand,
        price: item.price ?? lowestPrice?.ListingPrice?.Amount,
        currency: item.currency ?? lowestPrice?.ListingPrice?.CurrencyCode,
        imageUrl: imageUrl,
        url: `https://amazon.${domain}${url}`,
        rating: item.rating,
        reviews: item.reviews_count,
        createdAt: summary?.releaseDate,

        // Amazon
        asin: item.asin,
        category: category,
        priceUpper: item.price_upper,
        priceStrikethrough: item.price_strikethrough,
        salesVolume: parseSalesVolume(item.sales_volume),
        ranking,
        offerCount,
        shipping: item.shipping_information ??
            (firstOffer?.Shipping?.Amount !== undefined
                ? `${firstOffer?.Shipping?.Amount} ${firstOffer?.Shipping?.CurrencyCode ?? ""}`.trim()
                : undefined),
        isPrime: item.is_prime ?? firstOffer?.PrimeInformation?.IsPrime ?? undefined,
        isBuyBoxWinner: firstOffer?.IsBuyBoxWinner ?? undefined,
        isAmazonsChoice: item.is_amazons_choice,
        bestSeller: item.best_seller,
        isSponsored: item.is_sponsored,
        isFulfilledByAmazon: firstOffer?.IsFulfilledByAmazon ?? undefined,
        buyBoxPrice: buyBox?.ListingPrice?.Amount,
        buyBoxCurrency: buyBox?.ListingPrice?.CurrencyCode,
        sellerId: firstOffer?.SellerId,

        // Alibaba (no aplica)
        minOrder: undefined,
        supplier: undefined,
        years: undefined,
        origin: undefined,
        verified: undefined,
        guaranteed: undefined,
        description: undefined,
        section: undefined,
    };
}

export function extractAmazonFields(niche: Niche): Partial<Niche> {
    return {
        // Claves comunes
        keyword: niche.keyword,
        searchedAt: niche.searchedAt,
        marketplace: niche.marketplace,

        // Amazon statistics
        totalAmazonProducts: niche.totalAmazonProducts,
        minAmazonPrice: niche.minAmazonPrice,
        maxAmazonPrice: niche.maxAmazonPrice,
        avgAmazonPrice: niche.avgAmazonPrice,
        totalAmazonSponsored: niche.totalAmazonSponsored,
        minAmazonRating: niche.minAmazonRating,
        maxAmazonRating: niche.maxAmazonRating,
        avgAmazonRating: niche.avgAmazonRating,
        minAmazonReviews: niche.minAmazonReviews,
        maxAmazonReviews: niche.maxAmazonReviews,
        avgAmazonReviews: niche.avgAmazonReviews,
        totalAmazonReviews: niche.totalAmazonReviews,
        totalAmazonSalesVolume: niche.totalAmazonSalesVolume,
        avgAmazonSalesVolume: niche.avgAmazonSalesVolume,
        totalAmazonOfferCount: niche.totalAmazonOfferCount,
        primeCount: niche.primeCount,
        uniqueAmazonBrands: niche.uniqueAmazonBrands,
        uniqueCategories: niche.uniqueCategories,
        topCategory: niche.topCategory,
        topAmazonBrand: niche.topAmazonBrand,
        minAmazonRanking: niche.minAmazonRanking,
        maxAmazonRanking: niche.maxAmazonRanking,
        avgAmazonRanking: niche.avgAmazonRanking,
        avgAmazonBuyBoxPrice: niche.avgAmazonBuyBoxPrice,
        bestSellerCount: niche.bestSellerCount,
        amazonChoiceCount: niche.amazonChoiceCount,
        oldestAmazonDate: niche.oldestAmazonDate,
        newestAmazonDate: niche.newestAmazonDate,
        avgAmazonDate: niche.avgAmazonDate,
    };
}