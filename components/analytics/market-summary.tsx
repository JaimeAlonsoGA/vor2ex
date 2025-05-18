'use client';

import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  PackageCheck,
  Users,
  Tag
} from 'lucide-react';
import { Product } from '@/lib/types/product';
import { AmazonResponse } from '@/lib/types/amazon/searchCatalogItems';
import { amazonResponseToProductCard } from '@/lib/factories/amazon-item';

interface MarketSummaryProps {
  amazonProducts?: AmazonResponse;
  alibabaProducts: Product[];
}

export default function MarketSummary({ amazonProducts, alibabaProducts }: MarketSummaryProps) {
  // Productos cargados actualmente (acumulados)
  const amazonLoadedCount = amazonProducts?.items.length || 0;
  const alibabaLoadedCount = alibabaProducts.length;

  // Total de productos reportados por la API (pueden no estar todos cargados)
  const amazonTotalCount = amazonProducts?.numberOfResults || 0;
  const alibabaTotalCount = alibabaProducts.length; // Si tienes el total real de Alibaba, cámbialo aquí

  const amazonItems = amazonProducts?.items.map(amazonResponseToProductCard);

  // Estadísticas solo sobre los productos cargados
  const amazonAvgPrice = amazonItems?.length
    ? amazonItems.reduce((sum, p) => sum + p.price, 0) / amazonItems.length
    : 0;

  const alibabaAvgPrice = alibabaProducts.length
    ? alibabaProducts.reduce((sum, p) => sum + p.price, 0) / alibabaProducts.length
    : 0;

  const priceDiffPercentage = amazonAvgPrice && alibabaAvgPrice
    ? ((amazonAvgPrice - alibabaAvgPrice) / amazonAvgPrice) * 100
    : 0;

  const uniqueAmazonBrands = new Set(amazonItems?.map(p => p.brand)).size;
  const uniqueAlibabaSuppliers = new Set(alibabaProducts.map(p => p.brand)).size;

  const allCategories = new Set([
    ...(amazonItems ?? []).map(p => p.category),
    ...alibabaProducts.map(p => p.category)
  ].filter(Boolean) as string[]);

  const summaryCards = [
    {
      title: 'Total Products',
      value: `${amazonTotalCount + alibabaTotalCount}`,
      icon: <PackageCheck className="h-4 w-4" />,
      description: (
        <>
          {amazonTotalCount} on Amazon, {alibabaTotalCount} on Alibaba
          <br />
          <span className="text-xs text-muted-foreground">
            Loaded: {amazonLoadedCount} Amazon, {alibabaLoadedCount} Alibaba
          </span>
        </>
      ),
    },
    {
      title: 'Avg. Price Difference',
      value: `${Math.abs(priceDiffPercentage).toFixed(1)}%`,
      icon: <Percent className="h-4 w-4" />,
      description: priceDiffPercentage > 0
        ? 'Amazon prices higher on average'
        : 'Alibaba prices higher on average',
      trend: priceDiffPercentage > 0 ? 'up' : 'down',
    },
    {
      title: 'Amazon Avg. Price',
      value: formatCurrency(amazonAvgPrice, 'USD'),
      icon: <DollarSign className="h-4 w-4" />,
      description: `Range: ${formatCurrency(
        Math.min(...(amazonItems?.map(p => p.price || 0) ?? [])), 'USD'
      )} - ${formatCurrency(
        Math.max(...(amazonItems?.map(p => p.price || 0) ?? [])), 'USD'
      )}`,
    },
    {
      title: 'Alibaba Avg. Price',
      value: formatCurrency(alibabaAvgPrice, 'USD'),
      icon: <DollarSign className="h-4 w-4" />,
      description: `Range: ${formatCurrency(
        Math.min(...(alibabaProducts?.map(p => p.price || 0) ?? [])), 'USD'
      )} - ${formatCurrency(
        Math.max(...(alibabaProducts?.map(p => p.price || 0) ?? [])), 'USD'
      )}`,
    },
    {
      title: 'Unique Sellers',
      value: (uniqueAmazonBrands + uniqueAlibabaSuppliers).toString(),
      icon: <Users className="h-4 w-4" />,
      description: `${uniqueAmazonBrands} brands, ${uniqueAlibabaSuppliers} suppliers`,
    },
    {
      title: 'Product Categories',
      value: allCategories.size.toString(),
      icon: <Tag className="h-4 w-4" />,
      description: 'Unique categories across marketplaces',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {summaryCards.map((card, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <h3 className="text-2xl font-bold mt-1 flex items-center">
                  {card.value}
                  {card.trend && (
                    <span className="ml-1">
                      {card.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-destructive" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-500" />
                      )}
                    </span>
                  )}
                </h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-full">
                {card.icon}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}