'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PriceDistribution from './price-distribution';
import SalesTrends from './sales-trends';
import MarketSummary from './market-summary';
import { Skeleton } from '@/components/ui/skeleton';
import { AmazonItem } from '@/lib/types/amazon/amazonItem';
import { amazonResponseToProductCard } from '@/lib/factories/amazon-item';
import { AmazonResponse } from '@/lib/types/amazon/searchCatalogItems';
import CategoryDistribution from './category-distribution';

interface MarketInsightsProps {
  searchTerm: string;
  isLoading: boolean;
  amazonProducts?: AmazonResponse;
  alibabaProducts: any[];
}

export default function MarketInsights({ searchTerm, isLoading, amazonProducts, alibabaProducts }: MarketInsightsProps) {
  const amazonItems = amazonProducts?.items.map(amazonResponseToProductCard);
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        {searchTerm ? `Market Insights for "${searchTerm}"` : 'Market Insights'}
      </h2>

      <MarketSummary
        amazonProducts={amazonProducts}
        alibabaProducts={alibabaProducts || []}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Price Distribution</CardTitle>
            <CardDescription>
              Compare price ranges between marketplaces
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PriceDistribution
              amazonProducts={amazonItems}
              alibabaProducts={alibabaProducts || []}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>
              Analyze sales rankings and estimated monthly sales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SalesTrends amazonProducts={amazonItems} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Product Category Distribution</CardTitle>
          <CardDescription>
            Compare product categories across marketplaces
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryDistribution
            amazonProducts={amazonItems}
            alibabaProducts={alibabaProducts}
          />
        </CardContent>
      </Card>
    </div>
  );
}