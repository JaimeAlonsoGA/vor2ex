import { AlibabaSearchProduct } from "../types/alibaba/alibaba-search";
import { Product } from "../types/product";

// Factoría para Alibaba: adapta AlibabaSearchProduct a Product
export function productFromAlibaba(item: AlibabaSearchProduct): Product {
    return {
        // Comunes
        id: item.url, // Usamos la URL como identificador único si no hay otro campo
        source: 'alibaba',
        name: item.title,
        brand: undefined,
        price: parseFloat(item.price.replace(/[^\d.,]/g, '').replace(',', '.')) || undefined,
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
        minOrder: item.minOrder,
        supplier: item.supplier,
        years: item.years,
        origin: item.origin,
        verified: item.verified,
        guaranteed: item.guaranteed,
        description: item.description,
        section: item.section,
    };
}