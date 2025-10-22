import { useAmazonProducts } from "@/queries/amazon.queries";
import { AmazonItem } from "@/types/amazon/sp-api/amazon-item";

export default function DashboardPage() {
    const { data: products, isLoading, error } = useAmazonProducts({ keywords: 'laptop' });

    return (
        <div>
            <h1>Dashboard</h1>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {products && (
                <ul>
                    {products.data.items.map((product: AmazonItem) => (
                        <li key={product.asin}>{product.summaries?.[0]?.itemName}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}