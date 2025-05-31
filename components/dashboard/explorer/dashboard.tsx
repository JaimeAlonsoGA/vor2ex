"use client"

import { ProductsTable } from "./product-table";
import NicheQuickOverview from "../analytics/quick-overview";
import { Product } from "@/types/product";
import { Niche } from "@/types/analytics/analytics";
import SearchBar from "./search-bar";
import SaveNicheButton from "./save-niche-button";
import FilterDropdown from "./filter-dropdown";
import SortDropdown from "./sort-dropdown";
import SourceSelector from "./source-selector";
import { useState } from "react";
import { searchProducts } from "@/lib/functions/explorer/collect-explorer-data";
import { toast } from "sonner";
import { deleteUserNicheByKeyword, saveNiche } from "@/services/client/users-niches.client";

export default function ExplorerDashboard({ userNiches }: { userNiches: string[] }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [niche, setNiche] = useState<Niche>();
    const [saved, setSaved] = useState<string[]>(userNiches);
    const [keyword, setKeyword] = useState<string>('');
    const [isNicheLoading, setIsNicheLoading] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [sortField, setSortField] = useState("price");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [selected, setSelected] = useState<"amazon" | "alibaba">("amazon");
    const [filters, setFilters] = useState({
        verifiedOnly: false,
        guaranteedOnly: false,
        minRating: 0,
        maxRating: 5,
        maxMOQ: "",
        amazonCategory: "",
    });

    async function handleSearch(term: string) {
        setIsLoading(true);
        setNiche(undefined);
        await searchProducts(term).then((d) => {
            setProducts(d.products);
            setNiche(d.niche);
        }).finally(() =>
            setIsLoading(false)
        )
    }

    function handleRemoveProduct(id: string) {
        setProducts((prev) => prev.filter(p => p.id !== id))
    }

    function handleRemoveNiche(term: string) {
        setIsNicheLoading(true);
        toast.promise(
            deleteUserNicheByKeyword(term).then(res => {
                setSaved((prev) => prev.filter((niche) => niche !== term))
                setIsNicheLoading(false);
                return res;
            }),
            {
                loading: "Removing...",
                success: "Niche forgotten",
                error: "Error removing niche",
            }
        );
    }
    function handleSaveNiche(term: string) {
        setIsNicheLoading(true);
        toast.promise(
            saveNiche(term).then(res => {
                setSaved((prev) => [...prev, term])
                setIsNicheLoading(false);
                return res;
            }),
            {
                loading: "Saving...",
                success: "Niche saved",
                error: "Error saving niche",
            }
        );
    }

    const amazonCategories = Array.from(
        new Set(products.filter(p => p.source === "amazon" && p.category).map(p => p.category))
    ).filter(Boolean) as string[];

    const filteredAmazonProducts = products.filter((product) => product.source === "amazon")
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

    const filteredAlibabaProducts = products.filter((product) => product.source === "alibaba")
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between">
                <SearchBar
                    onSearch={handleSearch}
                    keyword={keyword}
                    onChange={setKeyword}
                    isLoading={isLoading}
                />
                <SaveNicheButton
                    isSaved={saved.includes(niche?.keyword ?? "")}
                    niche={niche}
                    products={products}
                    isNicheLoading={isNicheLoading}
                    isLoading={isLoading}
                    onSaveNiche={handleSaveNiche}
                    onRemoveNiche={handleRemoveNiche}
                />
                <div className="flex gap-2">
                    <SortDropdown
                        sortField={sortField}
                        sortOrder={sortOrder}
                        setSortField={setSortField}
                        setSortOrder={setSortOrder}
                    />
                    <FilterDropdown
                        filters={filters}
                        setFilters={setFilters}
                        amazonCategories={amazonCategories}
                    />
                </div>
            </div>
            <SourceSelector selected={selected} setSelected={setSelected} />
            <section className="w-full max-w-full pb-4">
                <div className="rounded-2xl border bg-background shadow-lg overflow-hidden">
                    {selected === "amazon" ? (
                        <ProductsTable products={filteredAmazonProducts} onRemove={handleRemoveProduct} type="amazon" isLoading={isLoading} />
                    ) : (
                        <ProductsTable products={filteredAlibabaProducts} onRemove={handleRemoveProduct} type="alibaba" isLoading={isLoading} />
                    )}
                </div>
            </section>
            <NicheQuickOverview niche={niche} isLoading={isLoading} />
        </div>
    );
}