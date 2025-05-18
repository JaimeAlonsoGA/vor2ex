'use client';

import { useState } from 'react';
import SearchBar from './search-bar';
import ComparativeTable from './comparative-table';
import MarketInsights from '@/components/analytics/market-insights';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { collectAmazonCatalogData } from '@/lib/functions/collect-product-data';
import { searchAlibaba } from '@/utils/search-service';
import { AmazonResponse } from '@/lib/types/amazon/searchCatalogItems';
import { fetchNextAmazonCatalogPage, fetchPreviousAmazonCatalogPage } from '@/services/amazon.service';

export const PAGE_SIZE = 10;

export default function ProductComparison() {
  const [searchTerm, setSearchTerm] = useState('');
  const [amazonProducts, setAmazonProducts] = useState<AmazonResponse>();
  const [alibabaProducts, setAlibabaProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [amazonPage, setAmazonPage] = useState(1);
  const [alibabaPage, setAlibabaPage] = useState(1);

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    setSearchTerm(term);
    setIsLoading(true);
    try {
      const amazonData = await collectAmazonCatalogData(term);
      setAmazonProducts(amazonData);
      const alibabaData = await searchAlibaba(term);
      setAlibabaProducts(alibabaData?.result?.products || []);
    } catch (error) {
    } finally {
      setAmazonPage(1);
      setAlibabaPage(1);
      setIsLoading(false);
    }
  };

  const handleLoadNextAmazonPage = async () => {
    if (!amazonProducts?.pagination?.nextToken) return;
    setIsLoading(true);
    try {
      const nextPage = await fetchNextAmazonCatalogPage(amazonProducts.pagination.nextToken, searchTerm);
      setAmazonProducts(prev => {
        if (!prev) return nextPage;
        return {
          ...nextPage,
          items: [...(prev.items || []), ...(nextPage.items || [])],
          numberOfResults: nextPage.numberOfResults || prev.numberOfResults,
          pagination: nextPage.pagination,
        };
      });
    } catch (error) {
      console.error('Error fetching next Amazon page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadPreviousAmazonPage = async () => {
    if (!amazonProducts?.pagination?.previousToken) return;
    setIsLoading(true);
    try {
      const prevPage = await fetchPreviousAmazonCatalogPage(amazonProducts.pagination.previousToken, searchTerm);
      setAmazonProducts(prev => {
        if (!prev) return prevPage;
        return {
          ...prevPage,
          items: [...(prevPage.items || []), ...(prev.items || [])],
          numberOfResults: prevPage.numberOfResults || prev.numberOfResults,
          pagination: prevPage.pagination,
        };
      });
    } catch (error) {
      console.error('Error fetching previous Amazon page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <Card className="border-none shadow-sm bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold tracking-tight">
            Cross-Marketplace Product Research
          </CardTitle>
          <CardDescription>
            Compare products between Amazon and Alibaba to find market opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </CardContent>
      </Card>

      {(amazonProducts || alibabaProducts) && (
        <div className="mt-8 space-y-8">
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="table">Product Comparison</TabsTrigger>
              <TabsTrigger value="insights">Market Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="mt-0">
              <ComparativeTable
                searchTerm={searchTerm}
                isLoading={isLoading}
                amazonProducts={amazonProducts}
                alibabaProducts={alibabaProducts}
                onLoadNextAmazonPage={handleLoadNextAmazonPage}
                onLoadPreviousAmazonPage={handleLoadPreviousAmazonPage}
                amazonPage={amazonPage}
                alibabaPage={alibabaPage}
              />
            </TabsContent>

            <TabsContent value="insights" className="mt-0">
              <MarketInsights
                searchTerm={searchTerm} isLoading={isLoading}
                amazonProducts={amazonProducts}
                alibabaProducts={alibabaProducts}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}