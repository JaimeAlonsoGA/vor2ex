export interface NicheAnalytics {
    id?: string;
    keyword: string;
    searchedAt: string;

    // Amazon statistics
    totalAmazonProducts: number;
    minAmazonPrice?: number;
    maxAmazonPrice?: number;
    avgAmazonPrice?: number;
    totalAmazonSponsored?: number;
    minAmazonRating?: number;
    maxAmazonRating?: number;
    avgAmazonRating?: number;
    minAmazonReviews?: number;
    maxAmazonReviews?: number;
    avgAmazonReviews?: number;
    totalAmazonReviews?: number;
    totalAmazonSalesVolume?: number;
    avgAmazonSalesVolume?: number;
    totalAmazonOfferCount?: number;
    primeCount?: number;
    uniqueAmazonBrands: number;
    uniqueCategories?: number;
    topCategory?: string;
    topAmazonBrand?: string;
    minAmazonRanking?: number;
    maxAmazonRanking?: number;
    avgAmazonRanking?: number;
    avgAmazonBuyBoxPrice?: number;
    bestSellerCount?: number;
    amazonChoiceCount?: number;
    // uniqueSellers?: number;
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
    totalAlibabaVerifiedSuppliers?: number;
    totalAlibabaGuaranteedSuppliers?: number;
    minAlibabaMinOrderQuantity?: number;
    maxAlibabaMinOrderQuantity?: number;
    avgAlibabaMinOrderQuantity?: number;
    //Alibaba API
    // minAlibabaWeight?: number;
    // maxAlibabaWeight?: number;
    // avgAlibabaWeight?: number;
    // minAlibabaDimensions?: string;
    // maxAlibabaDimensions?: string;
    // avgAlibabaDimensions?: string;
}