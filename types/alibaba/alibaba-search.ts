export interface AlibabaSearchProduct {
    title: string;
    url: string;
    imageUrl: string;
    price?: number;
    minOrder?: string;
    supplier?: string;
    years?: number;
    origin?: string;
    reviews?: number;
    rating?: number;
    verified?: boolean;
    guaranteed?: boolean;
    description?: string;
    section?: string;
}