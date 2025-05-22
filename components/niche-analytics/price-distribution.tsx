'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/lib/types/product';
import { calculatePriceStats } from '@/lib/functions/analytics-utils';

interface PriceDistributionProps {
  amazonProducts?: Product[];
  alibabaProducts: Product[];
}

export default function PriceDistribution({ amazonProducts, alibabaProducts }: PriceDistributionProps) {
  const [chartType, setChartType] = useState<'comparison' | 'distribution'>('comparison');

  const amazonStats = calculatePriceStats(amazonProducts ?? []);
  const alibabaStats = calculatePriceStats(alibabaProducts ?? []);

  // Prepare data for the comparison chart
  const comparisonData = [
    {
      name: 'Min Price',
      Amazon: amazonStats.min,
      Alibaba: alibabaStats.min,
    },
    {
      name: 'Average',
      Amazon: amazonStats.avg,
      Alibaba: alibabaStats.avg,
    },
    {
      name: 'Max Price',
      Amazon: amazonStats.max,
      Alibaba: alibabaStats.max,
    },
  ];

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border shadow-sm rounded">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value, 'USD')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!amazonProducts?.length && !alibabaProducts?.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No product data available for price analysis
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="comparison" onValueChange={(v) => setChartType(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comparison">Price Comparison</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={comparisonData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Amazon" fill="hsl(var(--chart-1))" name="Amazon" />
            <Bar dataKey="Alibaba" fill="hsl(var(--chart-2))" name="Alibaba" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <h4 className="text-sm font-medium mb-1">Amazon Price Range</h4>
          <p className="text-muted-foreground text-sm">
            {formatCurrency(amazonStats.min, 'USD')} - {formatCurrency(amazonStats.max, 'USD')}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-1">Alibaba Price Range</h4>
          <p className="text-muted-foreground text-sm">
            {formatCurrency(alibabaStats.min, 'USD')} - {formatCurrency(alibabaStats.max, 'USD')}
          </p>
        </div>
      </div>
    </div>
  );
}