export interface Product {
  id: string;
  name: string;
  price: number;
  currency?: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  url: string;

  // Amazon specific properties
  asin: string;
  sales?: number;
  ranking?: number;
  estimatedSales?: number;
  fulfillmentChannel?: string; // FBA, FBM, etc.
  isBuyBoxWinner?: boolean;
  buyBoxPrice?: number;
  buyBoxCurrency?: string;
  offerCount?: number;
  primeEligible?: boolean;
  shippingTime?: string;
  sellerId?: string;
  rating?: number;
  reviews?: number;

  // Alibaba specific properties
  minOrder?: number;
  createdAt?: string;

  // Common properties
  shipping?: string;
}