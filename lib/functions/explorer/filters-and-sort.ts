import { Product } from "@/types/product";

export const DEFAULT_FILTERS = {
    verifiedOnly: false,
    guaranteedOnly: false,
    minRating: 0,
    maxRating: 5,
    maxMOQ: "",
    category: "",
}

export function getFiltersAndSort(searchParams: Record<string, string | string[] | undefined>, categories: string[]) {
    return {
        filters: {
            verifiedOnly: searchParams.verifiedOnly === 'false',
            guaranteedOnly: searchParams.guaranteedOnly === 'false',
            minRating: Number(searchParams.minRating) || 0,
            maxRating: Number(searchParams.maxRating) || 5,
            maxMOQ: searchParams.maxMOQ || '',
            category: searchParams.category || '',
            categories,
        },
        sortField: (searchParams.sortField as string) || 'price',
        sortOrder: (searchParams.sortOrder as string) || 'asc',
    };
}

export function getAmazonFiltered(products: Product[], filters: any): Product[] {
    if (!products || products.length === 0) return [];
    return products.filter((product) => product.source === "amazon")
        .filter((product, index, arr) =>
            product.asin
                ? arr.findIndex(p => p.asin === product.asin) === index
                : true
        )
        .filter((product) => product.rating && product.rating >= filters.minRating)
        .filter((product) => !filters.category || product.category === filters.category);
}

export function getAlibabaFiltered(products: Product[], filters: any): Product[] {
    if (!products || products.length === 0) return [];
    return products.filter((product) => product.source === "alibaba")
        .filter((product) => {
            if (filters.verifiedOnly && !product.verified) return false
            if (filters.guaranteedOnly && !product.guaranteed) return false
            if (product.rating && product.rating < filters.minRating) return false
            if (filters.maxMOQ && product.minOrder) {
                const moq = parseInt(product.minOrder.toString().replace(/[^\d]/g, ""), 10)
                if (!isNaN(moq) && moq > Number(filters.maxMOQ)) return false
            }
            return true
        })
}