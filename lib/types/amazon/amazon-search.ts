export interface AmazonSearchApiResponse {
    results: Array<{
        content: {
            results: {
                url: string;
                page: number;
                query: string;
                results: {
                    paid: AmazonSearchProduct[];
                    organic: AmazonSearchProduct[];
                    suggested: AmazonSearchProduct[];
                    amazons_choices: AmazonSearchProduct[];
                };
                last_visible_page: number;
                parse_status_code: number;
            };
            errors: any[];
            status_code: number;
            task_id: string;
        };
        headers: Record<string, string>;
        status_code: number;
        query: string;
        task_id: string;
        created_at: string;
        updated_at: string;
    }>;
}

export interface AmazonSearchProduct {
    url: string;
    asin: string;
    price: number;
    title: string;
    rating: number;
    rel_pos?: number; // Only for paid
    pos?: number;     // Only for organic, amazons_choices, suggested
    currency: string;
    is_video?: boolean;
    url_image: string;
    best_seller: boolean;
    price_upper: number;
    is_sponsored?: boolean;
    manufacturer: string;
    sales_volume?: string;
    pricing_count: number;
    reviews_count: number;
    is_amazons_choice: boolean;
    is_prime?: boolean;
    price_strikethrough?: number;
    shipping_information?: string;
}