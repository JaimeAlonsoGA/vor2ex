import { ProductsTable } from './product-table';
import { Product } from '@/types/product';

export default function ProductsSection({
    selectedSource,
    amazonProducts,
    alibabaProducts,
}: {
    selectedSource: "amazon" | "alibaba";
    amazonProducts: Product[];
    alibabaProducts: Product[];
}) {
    return (
        <div className="rounded-2xl border bg-background shadow-lg overflow-hidden">
            {selectedSource === "amazon" ? (
                <ProductsTable products={amazonProducts} type='amazon' isLoading={false} />
            ) : (
                <ProductsTable products={alibabaProducts} type='alibaba' isLoading={false} />
            )}
        </div>
    );
}