import { Strategy } from "@/types/analytics/strategies";
import { Tables } from "@/types/supabase";

export function strategyToDb(strategy: Strategy) {
    const dbStrategy = {
        name: strategy.name,
        description: strategy.description,
        icon: strategy.icon,
        color: strategy.color,
        rating_optimum: strategy.ratingOptimum,
        sales_volume_optimum: strategy.salesVolumeOptimum,
        price_min: strategy.priceMin,
        price_max: strategy.priceMax,
        reviews_top: strategy.reviewsTop,
        reviews_good: strategy.reviewsGood,
        reviews_tense: strategy.reviewsTense,
        sales_weight: strategy.salesWeight,
        rating_weight: strategy.ratingWeight,
        price_weight: strategy.priceWeight,
        reviews_weight: strategy.reviewsWeight,
        selected: strategy.selected,
    };
    if (strategy.id) {
        return {
            ...dbStrategy,
            id: strategy.id
        };
    } else {
        return {
            ...dbStrategy
        };
    }
};

export function dbToStrategy(db: Tables<'strategies'>): Strategy {
    return {
        name: db.name,
        description: db.description,
        icon: db.icon,
        color: db.color,
        ratingOptimum: db.rating_optimum,
        salesVolumeOptimum: db.sales_volume_optimum,
        priceMin: db.price_min,
        priceMax: db.price_max,
        reviewsTop: db.reviews_top,
        reviewsGood: db.reviews_good,
        reviewsTense: db.reviews_tense,
        salesWeight: db.sales_weight,
        ratingWeight: db.rating_weight,
        priceWeight: db.price_weight,
        reviewsWeight: db.reviews_weight,
        id: db.id ? db.id : undefined,
        selected: db.selected
    };
}