import { Product } from "../product";

interface AlibabaAPIResponse {
    minOrderQuantity?: number;
    shippingTime?: string;
    packagingDesc?: string;
    ownerMember?: string;
    paymentMethods?: string[];
    deliveryPort?: string;
    status?: string;
    weight?: string;
    dimensions?: string;
    unitType?: string;
    customizable?: boolean;
    bulk_discount_prices?: [
        {
            start_quantity: string;
            bulk_discount_price: string;
        }
    ];
}

export interface AlibabaFactoryResponse {
    totalProducts?: number,
    products: Product[]
}