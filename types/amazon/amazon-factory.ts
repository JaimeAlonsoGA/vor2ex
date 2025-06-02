import { Product } from "../product";
import { AmazonSearchProduct } from "./amazon-search";
import { AmazonItem } from "./sp-api/amazon-item";

export interface AmazonAPIFactoryResponse {
    numberOfResults: number;
    pagination?: {
        nextToken?: string;
        previousToken?: string;
    };
    brands?: Array<{
        numberOfResults?: number;
        brandName: string;
    }>;
    items: AmazonItem[];
}

export interface AmazonProductsFactoryResponse {
    numberOfResults: number;
    brands?: Array<{
        numberOfResults?: number;
        brandName: string;
    }>;
    products: Product[];
}


export interface AmazonScraperResponse {
    page: number;
    url: string;
    items: AmazonSearchProduct[];
}