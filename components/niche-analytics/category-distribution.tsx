'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Product } from '@/lib/types/product';

interface CategoryDistributionProps {
    amazonProducts?: Product[];
    alibabaProducts?: Product[];
}

export default function CategoryDistribution({ amazonProducts = [], alibabaProducts = [] }: CategoryDistributionProps) {
    // Contar productos por categoría para Amazon y Alibaba
    const amazonCategoryCount: Record<string, number> = {};
    const alibabaCategoryCount: Record<string, number> = {};

    amazonProducts.forEach(p => {
        if (p.category) {
            amazonCategoryCount[p.category] = (amazonCategoryCount[p.category] || 0) + 1;
        }
    });
    alibabaProducts.forEach(p => {
        if (p.category) {
            alibabaCategoryCount[p.category] = (alibabaCategoryCount[p.category] || 0) + 1;
        }
    });

    // Unir todas las categorías únicas
    const allCategories = Array.from(new Set([
        ...Object.keys(amazonCategoryCount),
        ...Object.keys(alibabaCategoryCount),
    ]));

    // Preparar datos para la gráfica
    const chartData = allCategories.map(category => ({
        category,
        Amazon: amazonCategoryCount[category] || 0,
        Alibaba: alibabaCategoryCount[category] || 0,
    })).sort((a, b) => b.Amazon - a.Amazon);

    // Top y bottom categorías para resumen textual
    const topCategory = chartData[0];
    const bottomCategory = chartData[chartData.length - 1];

    if (!chartData.length) {
        return (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
                No category data available for analysis
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 ">
            <ResponsiveContainer width="100%" height={260}>
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis type="category" dataKey="category" width={120} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Amazon" fill="hsl(var(--chart-1))" name="Amazon" />
                    <Bar dataKey="Alibaba" fill="hsl(var(--chart-2))" name="Alibaba" />
                </BarChart>
            </ResponsiveContainer>
            <div className="text-xs text-muted-foreground px-2">
                <div>
                    <strong>Top category on Amazon:</strong> {topCategory?.category} ({topCategory?.Amazon} products)
                </div>
                <div>
                    <strong>Least saturated category:</strong> {bottomCategory?.category} ({bottomCategory?.Amazon} products)
                </div>
                <div>
                    <strong>Total categories:</strong> {chartData.length}
                </div>
            </div>
        </div>
    );
}