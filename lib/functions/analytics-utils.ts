'use client';

import { Product } from "../types/product";

export function calculatePriceStats(products: Product[]) {
  if (!products.length) {
    return {
      min: 0,
      max: 0,
      avg: 0,
      median: 0,
    };
  }

  const prices = products.map(p => p.price).filter(Boolean) as number[];

  if (!prices.length) {
    return {
      min: 0,
      max: 0,
      avg: 0,
      median: 0,
    };
  }

  // Sort prices for median calculation
  const sortedPrices = [...prices].sort((a, b) => a - b);

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  // Calculate median
  const mid = Math.floor(sortedPrices.length / 2);
  const median = sortedPrices.length % 2 === 0
    ? (sortedPrices[mid - 1] + sortedPrices[mid]) / 2
    : sortedPrices[mid];

  return {
    min,
    max,
    avg,
    median,
  };
}

export function calculatePriceDistribution(products: Product[], buckets: number = 5) {
  if (!products.length) return [];

  const prices = products.map(p => p.price).filter(Boolean) as number[];
  if (!prices.length) return [];

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min;
  const bucketSize = range / buckets;

  // Initialize buckets
  const distribution = Array(buckets).fill(0).map((_, i) => ({
    range: `${(min + i * bucketSize).toFixed(2)} - ${(min + (i + 1) * bucketSize).toFixed(2)}`,
    count: 0,
    min: min + i * bucketSize,
    max: min + (i + 1) * bucketSize,
  }));

  // Count products in each bucket
  prices.forEach(price => {
    for (let i = 0; i < buckets; i++) {
      if (price >= distribution[i].min && (price < distribution[i].max || (i === buckets - 1 && price <= distribution[i].max))) {
        distribution[i].count++;
        break;
      }
    }
  });

  return distribution;
}

export function getSalesTrends(products: Product[]) {
  const productsWithSales = products.filter(p =>
    p.sales !== undefined && p.estimatedSales !== undefined
  );

  if (!productsWithSales.length) return [];

  // Sort by sales
  return [...productsWithSales].sort((a, b) =>
    (a.estimatedSales || 0) - (b.estimatedSales || 0)
  );
}

export function getCategoryDistribution(products: Product[]) {
  const categories: Record<string, number> = {};

  products.forEach(product => {
    if (product.category) {
      categories[product.category] = (categories[product.category] || 0) + 1;
    }
  });

  return Object.entries(categories).map(([name, count]) => ({
    name,
    count
  }));
}