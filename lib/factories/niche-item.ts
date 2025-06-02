import { Tables } from "@/types/supabase";
import { AlibabaProductsFactoryResponse } from "../../types/alibaba/alibaba-factory";
import { AmazonProductsFactoryResponse } from "../../types/amazon/amazon-factory";
import { Niche } from "../../types/niche";
import { Product } from "../../types/product";
import { median } from "./utils";

export function getNiche(
    keyword: string,
    marketplace: string,
    amazonProducts?: AmazonProductsFactoryResponse,
    alibabaProducts?: AlibabaProductsFactoryResponse,
): Niche {
    const now = new Date().toISOString();

    // Amazon analytics (filtra undefined, pero cuenta 0 como válido)
    const amazonBrands = amazonProducts?.products
        .map((p: Product) => p.brand)
        .filter((b): b is string => b !== undefined && b !== null && b !== "");

    const amazonPrices = amazonProducts?.products
        .map(p => p.price)
        .filter((v): v is number => v !== undefined && v !== null && v !== 0 && !isNaN(v));

    const amazonRatings = amazonProducts?.products
        .map(p => p.rating)
        .filter((v): v is number => v !== undefined && v !== null);

    const amazonReviews = amazonProducts?.products
        .map(p => p.reviews)
        .filter((v): v is number => v !== undefined && v !== null);

    const minAmazonReviews = amazonReviews?.length ? Math.min(...amazonReviews) : undefined;
    const maxAmazonReviews = amazonReviews?.length ? Math.max(...amazonReviews) : undefined;

    const amazonSalesVolumes = amazonProducts?.products
        .map(p => Number(p.salesVolume))
        .filter((v): v is number => v !== undefined && v !== null && !isNaN(v));

    const amazonOfferCounts = amazonProducts?.products
        .map(p => p.offerCount)
        .filter((v): v is number => v !== undefined && v !== null);

    const amazonBuyBoxPrices = amazonProducts?.products
        .map((p: Product) => p.buyBoxPrice)
        .filter((v: any): v is number => v !== undefined && v !== null);

    const amazonRankings = amazonProducts?.products
        .map(p => p.ranking)
        .filter((v): v is number => v !== undefined && v !== null);

    const amazonBestSellers = amazonProducts?.products.filter((p: Product) => p.bestSeller).length;
    const amazonChoiceCount = amazonProducts?.products.filter((p: Product) => p.isAmazonsChoice).length;
    const amazonPrimeCount = amazonProducts?.products.filter((p: Product) => p.isPrime).length;

    const amazonDates = amazonProducts?.products
        .map(p => p.createdAt)
        .filter((d): d is string => !!d)
        .map(d => new Date(d));

    const oldestAmazonDate = amazonDates?.length
        ? new Date(Math.min(...amazonDates.map(d => d.getTime()))).toISOString()
        : undefined;
    const newestAmazonDate = amazonDates?.length
        ? new Date(Math.max(...amazonDates.map(d => d.getTime()))).toISOString()
        : undefined;
    const avgAmazonDate = amazonDates?.length
        ? new Date(median(amazonDates.map(d => d.getTime()))!).toISOString()
        : undefined;

    const amazonCategories = amazonProducts?.products
        .map((p: Product) => p.category)
        .filter((c): c is string => c !== undefined && c !== null && c !== "");

    const uniqueCategories = amazonCategories?.length
        ? new Set(amazonCategories).size
        : undefined;

    let topCategory: string | undefined = undefined;
    if (amazonCategories?.length) {
        const freq: Record<string, number> = {};
        amazonCategories.forEach(cat => {
            freq[cat] = (freq[cat] || 0) + 1;
        });
        topCategory = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
    }

    let topAmazonBrand: string | undefined = undefined;
    if (amazonBrands?.length) {
        const freq: Record<string, number> = {};
        amazonBrands.forEach(brand => {
            freq[brand] = (freq[brand] || 0) + 1;
        });
        topAmazonBrand = Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
    }

    // Alibaba analytics (filtra undefined, pero cuenta 0 como válido)
    const alibabaPrices = alibabaProducts?.products
        .map(p => p.price)
        .filter((v): v is number => v !== undefined && v !== null);

    const alibabaRatings = alibabaProducts?.products
        .map(p => p.rating)
        .filter((v): v is number => v !== undefined && v !== null);

    const alibabaSuppliers = new Set(
        alibabaProducts?.products.map((p: Product) => p.supplier).filter((v) => v !== undefined && v !== null && v !== "")
    );

    const alibabaMinOrderQuantities = alibabaProducts?.products
        .map((p: Product) => p.minOrder)
        .filter((v: any): v is number => v !== undefined && v !== null);

    const totalAlibabaVerifiedSuppliers = alibabaProducts?.products.filter((p: Product) => p.verified).length;
    const totalAlibabaGuaranteedSuppliers = alibabaProducts?.products.filter((p: Product) => p.guaranteed).length;

    return {
        // Comunes
        keyword,
        searchedAt: now,
        marketplace,

        // Amazon statistics
        totalAmazonProducts: amazonProducts?.numberOfResults,
        totalAmazonSponsored: amazonProducts?.products.filter((p: Product) => p.isSponsored).length,
        minAmazonPrice: amazonPrices?.length ? Math.min(...amazonPrices) : undefined,
        maxAmazonPrice: amazonPrices?.length ? Math.max(...amazonPrices) : undefined,
        avgAmazonPrice: median(amazonPrices),
        minAmazonRating: amazonRatings?.length ? Math.min(...amazonRatings) : undefined,
        maxAmazonRating: amazonRatings?.length ? Math.max(...amazonRatings) : undefined,
        avgAmazonRating: median(amazonRatings),
        avgAmazonReviews: median(amazonReviews),
        minAmazonReviews,
        maxAmazonReviews,
        totalAmazonReviews: amazonReviews?.length
            ? amazonReviews.reduce((a, b) => a + b, 0)
            : undefined,
        totalAmazonSalesVolume: amazonSalesVolumes?.length
            ? amazonSalesVolumes.reduce((a, b) => a + b, 0)
            : undefined,
        avgAmazonSalesVolume: median(amazonSalesVolumes),
        totalAmazonOfferCount: amazonOfferCounts?.length
            ? amazonOfferCounts.reduce((a, b) => a + b, 0)
            : undefined,
        primeCount: amazonPrimeCount || undefined,
        uniqueCategories,
        topCategory,
        topAmazonBrand,
        uniqueAmazonBrands: amazonProducts?.brands ? amazonProducts.brands[0].numberOfResults || 0 : 0,
        minAmazonRanking: amazonRankings?.length ? Math.min(...amazonRankings) : undefined,
        maxAmazonRanking: amazonRankings?.length ? Math.max(...amazonRankings) : undefined,
        avgAmazonRanking: median(amazonRankings),
        avgAmazonBuyBoxPrice: median(amazonBuyBoxPrices),
        bestSellerCount: amazonBestSellers || undefined,
        amazonChoiceCount: amazonChoiceCount || undefined,
        oldestAmazonDate,
        newestAmazonDate,
        avgAmazonDate,

        // Alibaba statistics
        totalAlibabaProducts: alibabaProducts?.totalProducts,
        avgAlibabaRating: median(alibabaRatings),
        minAlibabaPrice: alibabaPrices?.length ? Math.min(...alibabaPrices) : undefined,
        maxAlibabaPrice: alibabaPrices?.length ? Math.max(...alibabaPrices) : undefined,
        avgAlibabaPrice: median(alibabaPrices),
        uniqueAlibabaSuppliers: alibabaSuppliers.size,
        minAlibabaMinOrderQuantity: alibabaMinOrderQuantities?.length
            ? Math.min(...alibabaMinOrderQuantities)
            : undefined,
        maxAlibabaMinOrderQuantity: alibabaMinOrderQuantities?.length
            ? Math.max(...alibabaMinOrderQuantities)
            : undefined,
        avgAlibabaMinOrderQuantity: median(alibabaMinOrderQuantities),
        totalAlibabaVerifiedSuppliers,
        totalAlibabaGuaranteedSuppliers,
    };
}


export function nicheToDb(data: Niche) {
    return {
        keyword: data.keyword,
        searched_at: data.searchedAt,
        amazon_marketplace: data.marketplace,
        total_amazon_products: data.totalAmazonProducts ?? null,
        min_amazon_price: data.minAmazonPrice ?? null,
        max_amazon_price: data.maxAmazonPrice ?? null,
        avg_amazon_price: data.avgAmazonPrice ?? null,
        total_amazon_sponsored: data.totalAmazonSponsored ?? null,
        min_amazon_rating: data.minAmazonRating ?? null,
        max_amazon_rating: data.maxAmazonRating ?? null,
        avg_amazon_rating: data.avgAmazonRating ?? null,
        min_amazon_reviews: data.minAmazonReviews ?? null,
        max_amazon_reviews: data.maxAmazonReviews ?? null,
        avg_amazon_reviews: data.avgAmazonReviews ?? null,
        total_amazon_reviews: data.totalAmazonReviews ?? null,
        total_amazon_sales_volume: data.totalAmazonSalesVolume ?? null,
        avg_amazon_sales_volume: data.avgAmazonSalesVolume ?? null,
        total_amazon_offer_count: data.totalAmazonOfferCount ?? null,
        prime_count: data.primeCount ?? null,
        unique_amazon_brands: data.uniqueAmazonBrands ?? null,
        top_amazon_brand: data.topAmazonBrand ?? null,
        min_amazon_ranking: data.minAmazonRanking ?? null,
        max_amazon_ranking: data.maxAmazonRanking ?? null,
        avg_amazon_ranking: data.avgAmazonRanking ?? null,
        avg_amazon_buy_box_price: data.avgAmazonBuyBoxPrice ?? null,
        best_seller_count: data.bestSellerCount ?? null,
        amazon_choice_count: data.amazonChoiceCount ?? null,
        oldest_amazon_date: data.oldestAmazonDate ?? null,
        newest_amazon_date: data.newestAmazonDate ?? null,
        avg_amazon_date: data.avgAmazonDate ?? null,
        total_alibaba_products: data.totalAlibabaProducts,
        avg_alibaba_rating: data.avgAlibabaRating ?? null,
        min_alibaba_price: data.minAlibabaPrice ?? null,
        max_alibaba_price: data.maxAlibabaPrice ?? null,
        avg_alibaba_price: data.avgAlibabaPrice ?? null,
        unique_alibaba_suppliers: data.uniqueAlibabaSuppliers ?? null,
        min_alibaba_min_order_quantity: data.minAlibabaMinOrderQuantity ?? null,
        max_alibaba_min_order_quantity: data.maxAlibabaMinOrderQuantity ?? null,
        avg_alibaba_min_order_quantity: data.avgAlibabaMinOrderQuantity ?? null,
        unique_categories: data.uniqueCategories ?? null,
        top_category: data.topCategory ?? null,
        total_verified_suppliers: data.totalAlibabaVerifiedSuppliers ?? null,
        total_guaranteed_suppliers: data.totalAlibabaGuaranteedSuppliers ?? null,
    };
}

export function dbToNiche(data: Tables<'niches'>): Niche {
    return {
        id: data.id ?? undefined,
        keyword: data.keyword ?? "",
        searchedAt: data.searched_at ?? "",
        marketplace: data.amazon_marketplace ?? "",

        totalAmazonProducts: data.total_amazon_products ?? 0,
        minAmazonPrice: data.min_amazon_price ?? undefined,
        maxAmazonPrice: data.max_amazon_price ?? undefined,
        avgAmazonPrice: data.avg_amazon_price ?? undefined,
        totalAmazonSponsored: data.total_amazon_sponsored ?? undefined,
        minAmazonRating: data.min_amazon_rating ?? undefined,
        maxAmazonRating: data.max_amazon_rating ?? undefined,
        avgAmazonRating: data.avg_amazon_rating ?? undefined,
        minAmazonReviews: data.min_amazon_reviews ?? undefined,
        maxAmazonReviews: data.max_amazon_reviews ?? undefined,
        avgAmazonReviews: data.avg_amazon_reviews ?? undefined,
        totalAmazonReviews: data.total_amazon_reviews ?? undefined,
        totalAmazonSalesVolume: data.total_amazon_sales_volume ?? undefined,
        avgAmazonSalesVolume: data.avg_amazon_sales_volume ?? undefined,
        totalAmazonOfferCount: data.total_amazon_offer_count ?? undefined,
        primeCount: data.prime_count ?? undefined,
        uniqueAmazonBrands: data.unique_amazon_brands || 0,
        uniqueCategories: data.unique_categories ?? undefined,
        topCategory: data.top_category ?? undefined,
        topAmazonBrand: data.top_amazon_brand ?? undefined,
        minAmazonRanking: data.min_amazon_ranking ?? undefined,
        maxAmazonRanking: data.max_amazon_ranking ?? undefined,
        avgAmazonRanking: data.avg_amazon_ranking ?? undefined,
        avgAmazonBuyBoxPrice: data.avg_amazon_buy_box_price ?? undefined,
        bestSellerCount: data.best_seller_count ?? undefined,
        amazonChoiceCount: data.amazon_choice_count ?? undefined,
        oldestAmazonDate: data.oldest_amazon_date ?? undefined,
        newestAmazonDate: data.newest_amazon_date ?? undefined,
        avgAmazonDate: data.avg_amazon_date ?? undefined,

        totalAlibabaProducts: data.total_alibaba_products || 0,
        avgAlibabaRating: data.avg_alibaba_rating ?? undefined,
        minAlibabaPrice: data.min_alibaba_price ?? undefined,
        maxAlibabaPrice: data.max_alibaba_price ?? undefined,
        avgAlibabaPrice: data.avg_alibaba_price ?? undefined,
        uniqueAlibabaSuppliers: data.unique_alibaba_suppliers || 0,
        totalAlibabaVerifiedSuppliers: data.total_verified_suppliers || 0,
        totalAlibabaGuaranteedSuppliers: data.total_guaranteed_suppliers || 0,
        minAlibabaMinOrderQuantity: data.min_alibaba_min_order_quantity ?? undefined,
        maxAlibabaMinOrderQuantity: data.max_alibaba_min_order_quantity ?? undefined,
        avgAlibabaMinOrderQuantity: data.avg_alibaba_min_order_quantity ?? undefined,
    }
}

export function upsertLocalNiche(
    existingNiche: Niche,
    keyword: string,
    marketplace: string,
    alibabaProducts: AlibabaProductsFactoryResponse
): Niche {
    const alibabaNiche = getNiche(keyword, marketplace, undefined, alibabaProducts);

    return {
        ...existingNiche,

        totalAlibabaProducts: alibabaNiche.totalAlibabaProducts,
        avgAlibabaRating: alibabaNiche.avgAlibabaRating,
        minAlibabaPrice: alibabaNiche.minAlibabaPrice,
        maxAlibabaPrice: alibabaNiche.maxAlibabaPrice,
        avgAlibabaPrice: alibabaNiche.avgAlibabaPrice,
        uniqueAlibabaSuppliers: alibabaNiche.uniqueAlibabaSuppliers,
        minAlibabaMinOrderQuantity: alibabaNiche.minAlibabaMinOrderQuantity,
        maxAlibabaMinOrderQuantity: alibabaNiche.maxAlibabaMinOrderQuantity,
        avgAlibabaMinOrderQuantity: alibabaNiche.avgAlibabaMinOrderQuantity,
        totalAlibabaVerifiedSuppliers: alibabaNiche.totalAlibabaVerifiedSuppliers,
        totalAlibabaGuaranteedSuppliers: alibabaNiche.totalAlibabaGuaranteedSuppliers,
    };
}