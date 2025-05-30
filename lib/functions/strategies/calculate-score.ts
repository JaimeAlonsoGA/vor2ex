import { Niche } from "@/types/analytics/analytics";
import { Strategy } from "@/types/analytics/strategies";

function gaussianScore(value: number, optimum: number, sigma: number = 0.3) {
    return Math.exp(-0.5 * Math.pow((value - optimum) / sigma, 2));
}

/**
 * Calcula un score gaussiano entre 0 y 1, siendo 1 el óptimo.
 * @param value Valor a evaluar
 * @param optimum Valor óptimo definido por la estrategia
 * @param sigma Tolerancia (cuanto mayor, más permisivo)
 */
export function getProfitScoreWithStrategy(a: Niche, strategy: Strategy) {
    // Rating: score gaussiano respecto al óptimo definido en la estrategia
    const rating = a.avgAmazonRating ?? 0;
    const ratingScore = gaussianScore(rating, strategy.ratingOptimum, 0.3);

    // Price: score gaussiano respecto al centro del rango óptimo
    const price = a.avgAmazonPrice ?? 0;
    const priceOptimum = (strategy.priceMin + strategy.priceMax) / 2;
    const priceSigma = Math.max(0.1, (strategy.priceMax - strategy.priceMin) / 2 || 0.3);
    const priceScore = gaussianScore(price, priceOptimum, priceSigma);

    // Reviews: penalización por encima de los thresholds (no gaussiano, lógica de negocio)
    const reviews = a.avgAmazonReviews ?? 0;
    let reviewsScore = 0.1;
    if (reviews < strategy.reviewsTop) reviewsScore = 1;
    else if (reviews < strategy.reviewsGood) reviewsScore = 0.7;
    else if (reviews < strategy.reviewsTense) reviewsScore = 0.4;

    // Sales volume: score gaussiano respecto al óptimo definido en la estrategia
    const sales = a.totalAmazonSalesVolume ?? 0;
    const salesOptimum = strategy.salesVolumeOptimum ?? 0;
    // Sigma para ventas: 20% del óptimo o 1 si óptimo es 0
    const salesSigma = Math.max(1, Math.abs(salesOptimum * 0.2));
    const salesScore = gaussianScore(sales, salesOptimum, salesSigma);

    // Weighted final score
    const finalScore =
        (strategy.salesWeight ?? 0.4) * salesScore +
        (strategy.ratingWeight ?? 0.2) * ratingScore +
        (strategy.priceWeight ?? 0.2) * priceScore +
        (strategy.reviewsWeight ?? 0.2) * reviewsScore;

    return { ratingScore, priceScore, reviewsScore, salesScore, finalScore };
}