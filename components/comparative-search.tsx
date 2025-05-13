"use client";

import type React from "react";

import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { searchAlibaba } from "@/utils/search-service";
import { AmazonResultsTable } from "./amazon-results-table";
import { AlibabaResultsTable } from "./alibaba-results-table";
import { AlibabaResponse } from "@/lib/models/alibaba/alibaba-response";
import { AmazonResponse } from "@/lib/models/amazon/searchCatalogItems";
import { collectAmazonCatalogData } from "@/lib/functions/collect-product-data";

export default function ComparativeSearch() {
  const [keyword, setKeyword] = useState<string>("");
  const [amazonResults, setAmazonResults] = useState<AmazonResponse | null>(
    null
  );
  const [alibabaResults, setAlibabaResults] = useState<AlibabaResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("split");

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    setIsLoading(true);
    try {
      const data = await collectAmazonCatalogData(keyword);
      console.log("Amazon DATA:", data);

      const alibabaData = await searchAlibaba(keyword);

      setAmazonResults(data);
      setAlibabaResults(alibabaData);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Comparative Product Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2 mb-6">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Enter product keywords..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
              aria-label="Search keywords"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isLoading || !keyword.trim()}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Searching
              </span>
            ) : (
              <span className="flex items-center">
                <SearchIcon className="mr-2 h-4 w-4" />
                Search
              </span>
            )}
          </Button>
        </div>

        {(amazonResults || alibabaResults) && (
          <Tabs
            defaultValue="split"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="split">Split View</TabsTrigger>
              <TabsTrigger value="amazon">Amazon</TabsTrigger>
              <TabsTrigger value="alibaba">Alibaba</TabsTrigger>
            </TabsList>

            <TabsContent value="split" className="mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Amazon Results</h3>
                  {amazonResults && <AmazonResultsTable data={amazonResults} />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Alibaba Results
                  </h3>
                  {alibabaResults && (
                    <AlibabaResultsTable data={alibabaResults} />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="amazon" className="mt-4">
              <h3 className="text-lg font-semibold mb-3">Amazon Results</h3>
              {amazonResults && <AmazonResultsTable data={amazonResults} />}
            </TabsContent>

            <TabsContent value="alibaba" className="mt-4">
              <h3 className="text-lg font-semibold mb-3">Alibaba Results</h3>
              {alibabaResults && <AlibabaResultsTable data={alibabaResults} />}
            </TabsContent>
          </Tabs>
        )}

        {!amazonResults && !alibabaResults && !isLoading && (
          <div className="text-center py-12">
            <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Enter keywords and click search to compare products from Amazon
              and Alibaba
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
