'use client';

import { useState } from 'react';
import SearchBar from './niche-table/search-bar';
import ComparativeTable from './niche-table/comparative-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/lib/types/product';
import { collectAmazonCatalogData } from '@/lib/functions/amazon/collect-sp-api-data';
import { collectAmazonSearchData } from '@/lib/functions/amazon/collect-scraper-data';
import { productFromAmazon } from '@/lib/factories/amazon-item';
import { scraperResponseData } from '@/lib/searchResponseData';

export const PAGE_SIZE = 10;

export default function ProductComparison() {
  const [keyword, setKeyword] = useState('');
  const [amazonProducts, setAmazonProducts] = useState<Product[]>([]);
  const [alibabaProducts, setAlibabaProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [amazonPage, setAmazonPage] = useState(1);
  const [alibabaPage, setAlibabaPage] = useState(1);

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    setAmazonPage(1);
    setAlibabaPage(1);
    setKeyword(term);
    setIsLoading(true);

    try {
      // const scraperPromise = collectAmazonSearchData(term);

      const apiPromise = collectAmazonCatalogData(term);
      // const scraperData = await scraperPromise;
      // console.log('Amazon Scraper data:', scraperData);

      //static data from keyword: yoga sexy
      const scraperData = scraperResponseData;
      const refinedScrapedData = scraperData.items.map(item => productFromAmazon(item));
      setAmazonProducts(refinedScrapedData);
      const sponsoredProducts = refinedScrapedData.filter(item => item.isSponsored);
      const sponsoredProductsPromise = sponsoredProducts.map(item =>
        collectAmazonCatalogData(item.asin!)
      );
      const sponsoredProductsData = await Promise.all(sponsoredProductsPromise);
      const apiData = await apiPromise;
      // console.log('Amazon API data:', apiData);
      const apiByAsin = new Map<string, any>();
      if (apiData?.items?.length) {
        apiData.items.forEach(apiItem => {
          if (apiItem.asin) apiByAsin.set(apiItem.asin, apiItem);
        });
      }
      sponsoredProductsData.forEach(spData => {
        if (spData?.items?.length) {
          spData.items.forEach(apiItem => {
            if (apiItem.asin) apiByAsin.set(apiItem.asin, apiItem);
          });
        }
      });
      const mergedProducts = scraperData.items.map(item =>
        apiByAsin.has(item.asin)
          ? productFromAmazon(item, apiByAsin.get(item.asin))
          : productFromAmazon(item)
      );
      setAmazonProducts(mergedProducts);
      console.log('Amazon complete data:', mergedProducts);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleLoadNextAmazonPage = async () => {
  //   if (!amazonProducts?.pagination?.nextToken) return;
  //   setIsLoading(true);
  //   try {
  //     const nextPage = await collectAmazonCatalogData(keyword, 'next', amazonProducts.pagination.nextToken);
  //     setAmazonProducts(prev => {
  //       if (!prev) return nextPage;
  //       return {
  //         ...nextPage,
  //         items: [...(prev.items || []), ...(nextPage.items || [])],
  //         numberOfResults: nextPage.numberOfResults || prev.numberOfResults,
  //         pagination: nextPage.pagination,
  //       };
  //     });
  //   } catch (error) {
  //     console.error('Error fetching next Amazon page:', error);
  //   } finally {
  //     setIsLoading(false);
  //     setAmazonPage(prev => prev + 1);
  //   }
  // };

  // const handleLoadPreviousAmazonPage = async () => {
  //   if (!amazonProducts?.pagination?.previousToken) return;
  //   setIsLoading(true);
  //   try {
  //     const prevPage = await collectAmazonCatalogData(keyword, 'previous', amazonProducts.pagination.previousToken);
  //     setAmazonProducts(prev => {
  //       if (!prev) return prevPage;
  //       return {
  //         ...prevPage,
  //         items: [...(prevPage.items || []), ...(prev.items || [])],
  //         numberOfResults: prevPage.numberOfResults || prev.numberOfResults,
  //         pagination: prevPage.pagination,
  //       };
  //     });
  //   } catch (error) {
  //     console.error('Error fetching previous Amazon page:', error);
  //   } finally {
  //     setIsLoading(false);
  //     setAmazonPage(prev => prev - 1);
  //   }
  // };

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
                searchTerm={keyword}
                isLoading={isLoading}
                amazonProducts={amazonProducts}
                alibabaProducts={alibabaProducts}
                // onLoadNextAmazonPage={handleLoadNextAmazonPage}
                // onLoadPreviousAmazonPage={handleLoadPreviousAmazonPage}
                amazonPage={amazonPage}
                alibabaPage={alibabaPage}
              />
            </TabsContent>

            <TabsContent value="insights" className="mt-0">
              {/* <MarketInsights
                searchTerm={keyword} isLoading={isLoading}
                amazonProducts={amazonProducts}
                alibabaProducts={alibabaProducts}
              /> */}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}