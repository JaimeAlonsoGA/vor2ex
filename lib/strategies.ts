import { strategyToDb } from "@/lib/factories/strategy-item";
import { Strategy } from "@/types/analytics/strategies";

export const REQUIRED_PARAMS: (keyof Strategy)[] = [
    "ratingOptimum",
    "priceMin",
    "priceMax",
    "reviewsTop",
    "reviewsGood",
    "reviewsTense",
    "salesWeight",
    "ratingWeight",
    "priceWeight",
    "reviewsWeight",
];

export const EMPTY_STRATEGY = {
    name: "",
    description: "",
    icon: "Sigma",
    color: "blue-500",
    ratingOptimum: 2.5,
    priceMin: 15,
    priceMax: 40,
    reviewsTop: 300,
    reviewsGood: 500,
    reviewsTense: 1000,
    salesWeight: 0.4,
    ratingWeight: 0.2,
    priceWeight: 0.2,
    reviewsWeight: 0.2,
    readonly: false,
    template: false,
}

export const DEFAULT_STRATEGY: Strategy =
{
    name: "Classic FBA",
    description: "Balanced for most FBA sellers. Good price, moderate reviews, average rating.",
    icon: "cylinder",
    color: "red-500",
    ratingOptimum: 2.5,
    priceMin: 15,
    priceMax: 40,
    reviewsTop: 300,
    reviewsGood: 500,
    reviewsTense: 1000,
    salesWeight: 0.4,
    ratingWeight: 0.2,
    priceWeight: 0.2,
    reviewsWeight: 0.2,
}

export const defaultUserStrategy = strategyToDb(DEFAULT_STRATEGY);

export const DEFAULT_TEMPLATES: Strategy[] = [
    {
        name: "Conservative",
        description: "Safer, prioritizes low competition and stable sales.",
        icon: "cuboid",
        color: "blue-500",
        ratingOptimum: 3,
        priceMin: 20,
        priceMax: 35,
        reviewsTop: 200,
        reviewsGood: 400,
        reviewsTense: 800,
        salesWeight: 0.3,
        ratingWeight: 0.2,
        priceWeight: 0.2,
        reviewsWeight: 0.3,
    },
    {
        name: "Greedy",
        description: "Aggressive, seeks high sales and tolerates more competition.",
        icon: "pyramid",
        color: "green-500",
        ratingOptimum: 2,
        priceMin: 10,
        priceMax: 50,
        reviewsTop: 500,
        reviewsGood: 800,
        reviewsTense: 1500,
        salesWeight: 0.6,
        ratingWeight: 0.1,
        priceWeight: 0.1,
        reviewsWeight: 0.2,
    },
]