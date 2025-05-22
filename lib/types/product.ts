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
  isFulfilledByAmazon?: boolean;
  buyBoxPrice?: number;
  buyBoxCurrency?: string;
  sellerId?: string;

  // Alibaba
  minOrder?: string;
  supplier?: string;
  years?: number;
  origin?: string;
  verified?: boolean;
  guaranteed?: boolean;
  description?: string;
  section?: string;

  // amazonGlobalLogisticsShippingCost?: number; // based on the product's weight, dimensions and port
  // amazonFees?: number; // based on the product's price, weight, dimensions and category
}