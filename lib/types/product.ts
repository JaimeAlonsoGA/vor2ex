export interface Product {
  source: 'amazon' | 'alibaba';
  // Comunes
  id: string;
  name: string;
  brand?: string;
  price?: number;
  currency?: string;
  imageUrl?: string;
  url: string;
  rating?: number;
  reviews?: number;
  createdAt?: string;

  // Amazon
  asin?: string;
  category?: string;
  priceUpper?: number;
  priceStrikethrough?: number;
  salesVolume?: string;
  ranking?: number;
  offerCount?: number;
  shipping?: string;
  isPrime?: boolean;
  isBuyBoxWinner?: boolean;
  isAmazonsChoice?: boolean;
  bestSeller?: boolean;
  isSponsored?: boolean;
  fulfillmentChannel?: string;
  buyBoxPrice?: number;
  buyBoxCurrency?: string;
  sellerId?: string;

  // Alibaba
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

  // amazonGlobalLogisticsShippingCost?: number; // based on the product's weight, dimensions and port
  // amazonFees?: number; // based on the product's price, weight, dimensions and category
}