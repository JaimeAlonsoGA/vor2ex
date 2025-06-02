import { Product } from "@/types/product";

export function getFiltersAndSort(searchParams: Record<string, string | string[] | undefined>, categories: string[]) {
    return {
        filters: {
            verifiedOnly: searchParams.verifiedOnly === 'false',
            guaranteedOnly: searchParams.guaranteedOnly === 'false',
            minRating: Number(searchParams.minRating) || 0,
            maxRating: Number(searchParams.maxRating) || 5,
            maxMOQ: searchParams.maxMOQ || '',
            amazonCategory: searchParams.amazonCategory || '',
            categories,
        },
        sortField: (searchParams.sortField as string) || 'price',
        sortOrder: (searchParams.sortOrder as string) || 'asc',
    };
}

export function getAmazonFiltered(products: Product[], filters: any, sortField: string, sortOrder: "asc" | "desc"): Product[] {
    if (!products || products.length === 0) return [];
    return products.filter((product) => product.source === "amazon")
        .filter((product, index, arr) =>
            product.asin
                ? arr.findIndex(p => p.asin === product.asin) === index
                : true
        )
        .filter((product) => product.rating && product.rating >= filters.minRating)
        .filter((product) => !filters.amazonCategory || product.category === filters.amazonCategory)
        .sort((a, b) => {
            if (sortField === "price") {
                return sortOrder === "asc"
                    ? (a.price || 0) - (b.price || 0)
                    : (b.price || 0) - (a.price || 0);
            } else if (sortField === "rating") {
                return sortOrder === "asc"
                    ? (a.rating || 0) - (b.rating || 0)
                    : (b.rating || 0) - (a.rating || 0);
            } else if (sortField === "reviews") {
                return sortOrder === "asc"
                    ? (a.reviews || 0) - (b.reviews || 0)
                    : (b.reviews || 0) - (a.reviews || 0);
            } else {
                return sortOrder === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            }
        })
}

export function getAlibabaFiltered(products: Product[], filters: any, sortField: string, sortOrder: "asc" | "desc"): Product[] {
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
        .sort((a, b) => {
            if (sortField === "price") {
                return sortOrder === "asc"
                    ? (a.price || 0) - (b.price || 0)
                    : (b.price || 0) - (a.price || 0);
            } else if (sortField === "rating") {
                return sortOrder === "asc"
                    ? (a.rating || 0) - (b.rating || 0)
                    : (b.rating || 0) - (a.rating || 0);
            } else if (sortField === "reviews") {
                return sortOrder === "asc"
                    ? (a.reviews || 0) - (b.reviews || 0)
                    : (b.reviews || 0) - (a.reviews || 0);
            } else {
                return sortOrder === "asc"
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            }
        })
}