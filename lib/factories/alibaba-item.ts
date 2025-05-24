import { AlibabaSearchProduct } from "../../types/alibaba/alibaba-search";
import { Product } from "../../types/product";

// Factoría para Alibaba: adapta AlibabaSearchProduct a Product
export function productFromAlibaba(item: AlibabaSearchProduct): Product {
    return {
        // Comunes
        id: item.url, 
        source: 'alibaba',
        name: item.title,
        brand: undefined,
        price: item.price,
        currency: undefined,
        imageUrl: item.imageUrl,
        url: item.url,
        rating: item.rating,
        reviews: item.reviews,
        createdAt: undefined,

        // Amazon (no aplica)
        asin: undefined,
        category: undefined,
        priceUpper: undefined,
        priceStrikethrough: undefined,
        salesVolume: undefined,
        ranking: undefined,
        offerCount: undefined,
        shipping: undefined,
        isPrime: undefined,
        isBuyBoxWinner: undefined,
        isAmazonsChoice: undefined,
        bestSeller: undefined,
        isSponsored: undefined,
        isFulfilledByAmazon: undefined,
        buyBoxPrice: undefined,
        buyBoxCurrency: undefined,
        sellerId: undefined,

        // Alibaba
        minOrder: item.minOrder ? Number(item.minOrder.replace(/[^\d]/g, '')) || undefined : undefined,
        supplier: item.supplier,
        years: item.years,
        origin: item.origin,
        verified: item.verified,
        guaranteed: item.guaranteed,
        description: item.description,
        section: item.section,
    };
}