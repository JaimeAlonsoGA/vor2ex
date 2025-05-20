import { AlibabaProductResponse } from "../types/alibaba/alibaba-product-response";
import { AlibabaProduct } from "../types/alibaba/alibaba-response";
import { Product } from "../types/product";

// Factoría para Alibaba: adapta AlibabaProduct a Product
export function productFromAlibaba(item: AlibabaProduct): Product {
    return {
        // Comunes
        id: item.id,
        source: 'alibaba',
        name: item.subject,
        brand: item.owner_member_display_name,
        price: undefined,
        currency: undefined,
        imageUrl: Array.isArray(item.main_image?.images) && item.main_image.images.length > 0
            ? String(item.main_image.images[0])
            : undefined,
        url: item.pc_detail_url ?? '',
        rating: undefined,
        reviews: undefined,
        createdAt: item.gmt_create ?? item.gmt_modified,

        // Amazon (no aplica)
        asin: undefined,
        category: item.group_name,
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
        minOrderQuantity: undefined,
        shippingTime: undefined,
        packagingDesc: undefined,
        ownerMember: item.owner_member_display_name,
        paymentMethods: undefined,
        deliveryPort: undefined,
        status: item.status,
        weight: undefined,
        dimensions: undefined,
        unitType: undefined,
        customizable: undefined,
        bulk_discount_prices: undefined,
    };
}

export function productFromAlibabaDetail(res: AlibabaProductResponse): Product {
    const p = res.product;
    return {
        // Comunes
        id: p.product_sku?.skus?.[0]?.sku_id ?? p.keywords?.[0] ?? "",
        source: 'alibaba',
        name: p.subject,
        brand: p.owner_member_display_name,
        price: Number(p.wholesale_trade?.price ?? p.sourcing_trade?.fob_min_price) || undefined,
        currency: p.sourcing_trade?.fob_currency,
        imageUrl: Array.isArray(p.main_image?.images) && p.main_image.images.length > 0
            ? String(p.main_image.images[0])
            : undefined,
        url: p.pc_detail_url ?? '',
        rating: undefined,
        reviews: undefined,
        createdAt: p.gmt_modified,

        // Amazon (no aplica)
        asin: undefined,
        category: undefined,
        priceUpper: Number(p.sourcing_trade?.fob_max_price) || undefined,
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
        minOrderQuantity: Number(p.wholesale_trade?.min_order_quantity ?? p.sourcing_trade?.min_order_quantity_sourcing) || undefined,
        shippingTime: p.sourcing_trade?.delivery_time,
        packagingDesc: p.sourcing_trade?.packaging_desc,
        ownerMember: p.owner_member_display_name,
        paymentMethods: p.sourcing_trade?.payment_methods,
        deliveryPort: p.sourcing_trade?.delivery_port,
        status: p.status,
        weight: p.wholesale_trade?.weight,
        dimensions: p.wholesale_trade?.package_size,
        unitType: p.wholesale_trade?.unit_type,
        customizable: undefined,
        bulk_discount_prices: p.product_sku?.skus?.[0]?.bulk_discount_prices?.length
            ? [{
                start_quantity: p.product_sku.skus[0].bulk_discount_prices[0].start_quantity,
                bulk_discount_price: p.product_sku.skus[0].bulk_discount_prices[0].bulk_discount_price
            }]
            : undefined,
    };
}