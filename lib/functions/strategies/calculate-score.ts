import { NicheAnalytics } from "@/types/analytics/analytics";
import { Strategy } from "@/types/analytics/strategies";

export function getProfitScoreWithStrategy(a: NicheAnalytics, strategy: Strategy) {
    // Rating: optimal around strategy.ratingOptimum, penalizes the further it is
    const rating = a.avgAmazonRating ?? 0;
    const ratingScore = 1 - Math.abs(rating - strategy.ratingOptimum) / strategy.ratingOptimum;

    // Price: optimal between priceMin and priceMax, penalizes outside that range
    const price = a.avgAmazonPrice ?? 0;
    let priceScore = 0;
    if (price >= strategy.priceMin && price <= strategy.priceMax) {
        priceScore = 1;
    } else if (price > strategy.priceMax) {
        priceScore = Math.max(0, 1 - (price - strategy.priceMax) / strategy.priceMax);
    } else if (price > 0) {
        priceScore = Math.max(0, 1 - (strategy.priceMin - price) / strategy.priceMin);
    }

    // Reviews: thresholds from strategy
    const reviews = a.avgAmazonReviews ?? 0;
    let reviewsScore = 0.1;
    if (reviews < strategy.reviewsTop) reviewsScore = 1;
    else if (reviews < strategy.reviewsGood) reviewsScore = 0.7;
    else if (reviews < strategy.reviewsTense) reviewsScore = 0.4;

    // Sales volume: higher is better, normalized (optional: you can add normalization)
    const sales = a.totalAmazonSalesVolume ?? 0;

    // Weighted final score
    const finalScore =
        strategy.salesWeight * sales +
        strategy.ratingWeight * ratingScore +
        strategy.priceWeight * priceScore +
        strategy.reviewsWeight * reviewsScore;

    return { ratingScore, priceScore, reviewsScore, sales, finalScore };
}