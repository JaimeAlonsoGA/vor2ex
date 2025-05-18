'use client';

import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/lib/types/product';

interface SalesTrendsProps {
  amazonProducts?: Product[];
}

export default function SalesTrends({ amazonProducts }: SalesTrendsProps) {
  // Filter out products without sales data
  const productsWithSales = amazonProducts?.filter(p => 
    p.ranking !== undefined && p.estimatedSales !== undefined
  );

  // Map products to chart data
  const salesData = productsWithSales?.map(product => ({
    name: product.name,
    salesRank: product.ranking,
    estimatedSales: product.estimatedSales,
    price: product.price,
    z: product.price, // Use price for size of the bubble
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border shadow-sm rounded">
          <p className="text-sm font-medium mb-1">{data.name}</p>
          <p className="text-xs text-muted-foreground">
            Rank: #{data.salesRank}
          </p>
          <p className="text-xs text-muted-foreground">
            Est. Sales: {data.estimatedSales}/month
          </p>
          <p className="text-xs text-muted-foreground">
            Price: {formatCurrency(data.price, 'USD')}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!productsWithSales?.length) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No sales data available for analysis
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="salesRank" 
            name="Rank" 
            domain={['dataMin', 'dataMax']}
            label={{ value: 'Sales Rank', position: 'bottom', offset: 0 }}
          />
          <YAxis 
            type="number" 
            dataKey="estimatedSales" 
            name="Sales" 
            label={{ value: 'Monthly Sales', angle: -90, position: 'left' }}
          />
          <ZAxis 
            type="number" 
            dataKey="z" 
            range={[40, 160]} 
            name="Price" 
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
          <Scatter name="Products" data={salesData}>
            {salesData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="hsl(var(--chart-1))" />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}