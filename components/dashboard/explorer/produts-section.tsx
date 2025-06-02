"use client";

import { ProductsTable } from "./product-table";
import { Product } from "@/types/product";
import SourceSelector from "./source-selector";
import { use, useEffect, useState } from "react";
import { AmazonProductsFactoryResponse } from "@/types/amazon/amazon-factory";
import { AlibabaProductsFactoryResponse } from "@/types/alibaba/alibaba-factory";
import { getAlibabaFiltered, getAmazonFiltered } from "@/lib/functions/explorer/filters-and-sort";

interface ProductSectionProps {
    amazonProductsPromise: Promise<AmazonProductsFactoryResponse>;
    alibabaProductsPromise: Promise<AlibabaProductsFactoryResponse>;
}

export default function ProductSection({ amazonProductsPromise, alibabaProductsPromise }: ProductSectionProps) {
    const amazonProducts = use(amazonProductsPromise);
    const [products, setProducts] = useState<Product[]>(amazonProducts.products);

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
    const [sortField, setSortField] = useState("price");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [filters, setFilters] = useState({
        verifiedOnly: false,
        guaranteedOnly: false,
        minRating: 0,
        maxRating: 5,
        maxMOQ: "",
        amazonCategory: "",
    });

    function handleLocalRemoveProduct(id: string) {
        setProducts((prev) => prev.filter(p => p.id !== id))
    }

    return (
        <div className="space-y-6">
            <SourceSelector selected={selected} setSelected={setSelected} />
            <section className="w-full max-w-full pb-4">
                <div className="rounded-2xl border bg-background shadow-lg overflow-hidden">
                    {selected === "amazon" ? (
                        <ProductsTable products={getAmazonFiltered(products, filters, sortField, sortOrder)} onRemove={handleLocalRemoveProduct} type="amazon" />
                    ) : (
                        <ProductsTable products={getAlibabaFiltered(products, filters, sortField, sortOrder)} onRemove={handleLocalRemoveProduct} type="alibaba" />
                    )}
                </div>
            </section>
            {/* <NicheQuickOverview niche={niche} /> */}
        </div>
    );
}