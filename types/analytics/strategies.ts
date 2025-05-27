export type Strategy = {
    id?: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    ratingOptimum: number;
    salesVolumeOptimum: number;
    priceMin: number;
    priceMax: number;
    reviewsTop: number;
    reviewsGood: number;
    reviewsTense: number;
    salesWeight: number;
    ratingWeight: number;
    priceWeight: number;
    reviewsWeight: number;
    selected: boolean;
};