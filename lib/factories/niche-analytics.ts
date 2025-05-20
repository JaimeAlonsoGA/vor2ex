import { NicheAnalytics } from "../types/niche-analytics";
import { Product } from "../types/product";

export function getNicheAnalytics(keyword: string, products: Product[]): NicheAnalytics {
    const now = new Date().toISOString();

    // Separar productos por fuente
    const amazonProducts = products.filter(p => p.source === "amazon");
    const alibabaProducts = products.filter(p => p.source === "alibaba");

    // Amazon analytics
    const amazonPrices = amazonProducts.map(p => p.price).filter((v): v is number => typeof v === "number");
    const amazonRatings = amazonProducts.map(p => p.rating).filter((v): v is number => typeof v === "number");
    const amazonReviews = amazonProducts.map(p => p.reviews).filter((v): v is number => typeof v === "number");
    const amazonSalesVolumes = amazonProducts.map(p => Number(p.salesVolume)).filter((v): v is number => !isNaN(v));
    const amazonOfferCounts = amazonProducts.map(p => p.offerCount).filter((v): v is number => typeof v === "number");
    const amazonBuyBoxPrices = amazonProducts.map((p: any) => p.buyBoxPrice).filter((v: any): v is number => typeof v === "number");
    const amazonRankings = amazonProducts.map(p => p.ranking).filter((v): v is number => typeof v === "number");
    const amazonBrands = new Set(amazonProducts.map(p => p.brand).filter(Boolean));
    const amazonSellers = new Set(amazonProducts.map((p: any) => p.sellerId).filter(Boolean));
    const amazonBestSellers = amazonProducts.filter((p: any) => p.bestSeller).length;
    const amazonChoiceCount = amazonProducts.filter((p: any) => p.isAmazonsChoice).length;
    const amazonPrimeCount = amazonProducts.filter((p: any) => p.isPrime).length;
    const amazonDates = amazonProducts.map(p => p.createdAt).filter(Boolean).map(d => new Date(d!));
    const oldestAmazonDate = amazonDates.length ? new Date(Math.min(...amazonDates.map(d => d.getTime()))).toISOString() : undefined;
    const newestAmazonDate = amazonDates.length ? new Date(Math.max(...amazonDates.map(d => d.getTime()))).toISOString() : undefined;
    const avgAmazonDate = amazonDates.length
        ? new Date(amazonDates.reduce((a, b) => a + b.getTime(), 0) / amazonDates.length).toISOString()
        : undefined;

    // Alibaba analytics
    const alibabaPrices = alibabaProducts.map(p => p.price).filter((v): v is number => typeof v === "number");
    const alibabaRatings = alibabaProducts.map(p => p.rating).filter((v): v is number => typeof v === "number");
    const alibabaSuppliers = new Set(alibabaProducts.map((p: any) => p.ownerMember).filter(Boolean));
    const alibabaMinOrderQuantities = alibabaProducts.map((p: any) => p.minOrderQuantity).filter((v: any): v is number => typeof v === "number");
    const alibabaWeights = alibabaProducts.map((p: any) => Number(p.weight)).filter((v: any): v is number => !isNaN(v));
    const alibabaDimensions = alibabaProducts.map((p: any) => p.dimensions).filter(Boolean);

    return {
        // Comunes
        keyword,
        searchedAt: now,

        // Amazon statistics
        totalAmazonProducts: amazonProducts.length,
        minAmazonPrice: amazonPrices.length ? Math.min(...amazonPrices) : undefined,
        maxAmazonPrice: amazonPrices.length ? Math.max(...amazonPrices) : undefined,
        avgAmazonPrice: amazonPrices.length ? amazonPrices.reduce((a, b) => a + b, 0) / amazonPrices.length : undefined,
        minAmazonRating: amazonRatings.length ? Math.min(...amazonRatings) : undefined,
        maxAmazonRating: amazonRatings.length ? Math.max(...amazonRatings) : undefined,
        avgAmazonRating: amazonRatings.length ? amazonRatings.reduce((a, b) => a + b, 0) / amazonRatings.length : undefined,
        avgAmazonReviews: amazonReviews.length ? amazonReviews.reduce((a, b) => a + b, 0) / amazonReviews.length : undefined,
        totalAmazonReviews: amazonReviews.length ? amazonReviews.reduce((a, b) => a + b, 0) : undefined,
        totalAmazonSalesVolume: amazonSalesVolumes.length ? amazonSalesVolumes.reduce((a, b) => a + b, 0) : undefined,
        avgAmazonSalesVolume: amazonSalesVolumes.length ? amazonSalesVolumes.reduce((a, b) => a + b, 0) / amazonSalesVolumes.length : undefined,
        totalAmazonOfferCount: amazonOfferCounts.length ? amazonOfferCounts.reduce((a, b) => a + b, 0) : undefined,
        primeCount: amazonPrimeCount || undefined,
        uniqueAmazonBrands: amazonBrands.size,
        minAmazonRanking: amazonRankings.length ? Math.min(...amazonRankings) : undefined,
        maxAmazonRanking: amazonRankings.length ? Math.max(...amazonRankings) : undefined,
        avgAmazonRanking: amazonRankings.length ? amazonRankings.reduce((a, b) => a + b, 0) / amazonRankings.length : undefined,
        avgAmazonBuyBoxPrice: amazonBuyBoxPrices.length ? amazonBuyBoxPrices.reduce((a, b) => a + b, 0) / amazonBuyBoxPrices.length : undefined,
        bestSellerCount: amazonBestSellers || undefined,
        amazonChoiceCount: amazonChoiceCount || undefined,
        uniqueSellers: amazonSellers.size || undefined,
        oldestAmazonDate,
        newestAmazonDate,
        avgAmazonDate,

        // Alibaba statistics
        totalAlibabaProducts: alibabaProducts.length,
        avgAlibabaRating: alibabaRatings.length ? alibabaRatings.reduce((a, b) => a + b, 0) / alibabaRatings.length : undefined,
        minAlibabaPrice: alibabaPrices.length ? Math.min(...alibabaPrices) : undefined,
        maxAlibabaPrice: alibabaPrices.length ? Math.max(...alibabaPrices) : undefined,
        avgAlibabaPrice: alibabaPrices.length ? alibabaPrices.reduce((a, b) => a + b, 0) / alibabaPrices.length : undefined,
        uniqueAlibabaSuppliers: alibabaSuppliers.size,
        minAlibabaMinOrderQuantity: alibabaMinOrderQuantities.length ? Math.min(...alibabaMinOrderQuantities) : undefined,
        maxAlibabaMinOrderQuantity: alibabaMinOrderQuantities.length ? Math.max(...alibabaMinOrderQuantities) : undefined,
        avgAlibabaMinOrderQuantity: alibabaMinOrderQuantities.length ? alibabaMinOrderQuantities.reduce((a, b) => a + b, 0) / alibabaMinOrderQuantities.length : undefined,
        avgAlibabaMaxOrderQuantity: undefined, // Puedes calcularlo si tienes el dato
        minAlibabaWeight: alibabaWeights.length ? Math.min(...alibabaWeights) : undefined,
        maxAlibabaWeight: alibabaWeights.length ? Math.max(...alibabaWeights) : undefined,
        avgAlibabaWeight: alibabaWeights.length ? alibabaWeights.reduce((a, b) => a + b, 0) / alibabaWeights.length : undefined,
        minAlibabaDimensions: alibabaDimensions.length ? alibabaDimensions.sort()[0] : undefined,
        maxAlibabaDimensions: alibabaDimensions.length ? alibabaDimensions.sort().reverse()[0] : undefined,
        avgAlibabaDimensions: undefined, // Puedes calcularlo si tienes el dato
        uniqueSuppliers: alibabaSuppliers.size || undefined,
    };
}