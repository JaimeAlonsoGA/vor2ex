export interface NicheAnalytics {
    keyword: string;
    searchedAt: string;

    // Amazon statistics
    totalAmazonProducts: number;
    minAmazonPrice?: number;
    maxAmazonPrice?: number;
    avgAmazonPrice?: number;
    minAmazonRatingCount?: number;
    maxAmazonRatingCount?: number;
    avgAmazonRatingCount?: number;
    minAmazonRating?: number;
    maxAmazonRating?: number;
    avgAmazonRating?: number;
    avgAmazonReviews?: number;
    totalAmazonReviews?: number;
    totalAmazonSalesVolume?: number;
    avgAmazonSalesVolume?: number;
    totalAmazonOfferCount?: number;
    primeCount?: number;
    uniqueAmazonBrands: number;
    topAmazonBrand?: string;
    minAmazonRanking?: number;
    maxAmazonRanking?: number;
    avgAmazonRanking?: number;
    avgAmazonBuyBoxPrice?: number;
    bestSellerCount?: number;
    amazonChoiceCount?: number;
    uniqueSellers?: number;
    oldestAmazonDate?: string;
    newestAmazonDate?: string;
    avgAmazonDate?: string;

    // Alibaba statistics
    totalAlibabaProducts: number;
    avgAlibabaRating?: number;
    minAlibabaPrice?: number;
    maxAlibabaPrice?: number;
    avgAlibabaPrice?: number;
    uniqueAlibabaSuppliers: number;
    minAlibabaMinOrderQuantity?: number;
    maxAlibabaMinOrderQuantity?: number;
    avgAlibabaMinOrderQuantity?: number;
    avgAlibabaMaxOrderQuantity?: number;
    minAlibabaWeight?: number;
    maxAlibabaWeight?: number;
    avgAlibabaWeight?: number;
    minAlibabaDimensions?: string;
    maxAlibabaDimensions?: string;
    avgAlibabaDimensions?: string;
    uniqueSuppliers?: number;
}