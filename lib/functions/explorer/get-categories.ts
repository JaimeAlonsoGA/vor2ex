import { Product } from "@/types/product";

export function getCategories(products: Product[]): string[] {
    return Array.from(
        new Set(products.filter(p => p.source === "amazon" && p.category).map(p => p.category))
    ).filter(Boolean) as string[];
}