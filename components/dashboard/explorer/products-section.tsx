"use client";

import { ProductsTable } from "./product-table";
import { Product } from "@/types/product";
import SourceSelector from "./source-selector";
import { use, useEffect, useMemo, useState } from "react";
import { AmazonProductsFactoryResponse } from "@/types/amazon/amazon-factory";
import { AlibabaProductsFactoryResponse } from "@/types/alibaba/alibaba-factory";
import { DEFAULT_FILTERS, getAlibabaFiltered, getAmazonFiltered } from "@/lib/functions/explorer/filters-and-sort";
import FilterDropdown from "./filter-dropdown";
import { getCategories } from "@/lib/functions/explorer/get-categories";

interface ProductSectionProps {
    amazonProductsPromise: Promise<AmazonProductsFactoryResponse>;
    alibabaProductsPromise: Promise<AlibabaProductsFactoryResponse>;
}

export default function ProductSection({ amazonProductsPromise, alibabaProductsPromise }: ProductSectionProps) {
    const amazonProducts = use(amazonProductsPromise);
    const [products, setProducts] = useState<Product[]>(amazonProducts.products);
    const [filters, setFilters] = useState(DEFAULT_FILTERS);

    useEffect(() => {
        setProducts(amazonProducts.products);
    }, [amazonProducts.products]);

    useEffect(() => {
        let cancelled = false;
        alibabaProductsPromise.then(alibabaProducts => {
            if (!cancelled && alibabaProducts.products && alibabaProducts.products.length > 0) {
                setProducts([...amazonProducts.products, ...alibabaProducts.products]);
            }
        });
        return () => { cancelled = true; };
    }, [alibabaProductsPromise, amazonProducts.products]);

    const [selected, setSelected] = useState<"amazon" | "alibaba">("amazon");

    const filteredProducts = useMemo(() => {
        return selected === "amazon"
            ? getAmazonFiltered(products, filters)
            : getAlibabaFiltered(products, filters);
    }, [selected, products, filters]);

    const categories = useMemo(() => {
        return getCategories(products);
    }, [products]);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <SourceSelector selected={selected} setSelected={setSelected} />
                <FilterDropdown categories={categories} setFilters={setFilters} filters={filters} />
            </div>
            <section className="w-full max-w-full pb-4">
                <div className="rounded-2xl border bg-background shadow-lg overflow-hidden">
                    {selected === "amazon" ? (
                        <ProductsTable products={filteredProducts} type="amazon" />
                    ) : (
                        <ProductsTable products={filteredProducts} type="alibaba" />
                    )}
                </div>
            </section>
        </div>
    );
}