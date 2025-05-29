'use client';

import { useState } from 'react';
import SearchBar from './search-bar';
import { Product } from '@/types/product';
import { collectAmazonCatalogData, collectAmazonCatalogDataByAsin } from '@/lib/functions/amazon/collect-sp-api-data';
import { productFromAmazon } from '@/lib/factories/amazon-item';
import { amazonSearchData } from '@/lib/amazonSearchData';
import { AlibabaSearchData } from '@/lib/alibabaSearchData';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bookmark, Download, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from '../../ui/button';
import { Label } from "@/components/ui/label"
import { collectAlibabaSearchData } from '@/lib/functions/alibaba/collect-alibaba-data';
import { collectAmazonSearchData } from '@/lib/functions/amazon/collect-scraper-data';
import { StarRating } from './star-rating';
import { getNicheAnalytics } from '@/lib/factories/analytics';
import NicheQuickOverview from '../analytics/quick-overview';
import { NicheAnalytics } from '@/types/analytics/analytics';
import { insertAnalytics, saveAnalytics } from '@/services/client/analytics.client';
import { Tables } from '@/types/supabase';
import { deleteUserAnalyticByKeyword } from '@/services/client/users-analytics.client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ProductsTable } from './product-table';
export const PAGE_SIZE = 10;

type SortField = "price" | "rating" | "reviews" | "name"
type SortOrder = "asc" | "desc"

export default function ProductSearcherDashboard({ userAnalytics }: { userAnalytics: Tables<'analytics'>['keyword'][] }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<NicheAnalytics>();
  const [isLoading, setIsLoading] = useState(false);
  const [saveNicheLoading, setSaveNicheLoading] = useState(false);
  const [sortField, setSortField] = useState<SortField>("price")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [removedProductIds, setRemovedProductIds] = useState<string[]>([]);
  const [userAnalyticsState, setUserAnalyticsState] = useState<Tables<'analytics'>['keyword'][]>(userAnalytics);
  const [selected, setSelected] = useState<"amazon" | "alibaba">(
    products.length > 0 && products[0].source === "alibaba" ? "alibaba" : "amazon"
  );
  const [filters, setFilters] = useState({
    verifiedOnly: false,
    guaranteedOnly: false,
    minRating: 0,
    maxRating: 5,
    maxMOQ: "",
    amazonCategory: "",
  });

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    setIsLoading(true);

    try {
      const amazonApiPromise = collectAmazonCatalogData(term);
      const scraperPromise = collectAmazonSearchData(term);
      const alibabaApiPromise = collectAlibabaSearchData(term);

      const [scraperData, apiData, alibabaApiData] = await Promise.all([scraperPromise, amazonApiPromise, alibabaApiPromise]);
      setProducts([...alibabaApiData.products]);
      const refinedScrapedData = scraperData.items.map(item => productFromAmazon(item));
      const sponsoredProducts = refinedScrapedData.filter(item => item.isSponsored);

      const sponsoredProductsPromise = sponsoredProducts.map(item =>
        collectAmazonCatalogDataByAsin(item.asin!)
      );
      const sponsoredProductsData = await Promise.all(sponsoredProductsPromise);

      const apiByAsin = new Map<string, any>();
      if (apiData?.items?.length) {
        apiData.items.forEach(apiItem => {
          if (apiItem.asin) apiByAsin.set(apiItem.asin, apiItem);
        });
      }
      sponsoredProductsData.forEach(spData => {
        if (spData && spData.asin) {
          apiByAsin.set(spData.asin, spData);
        }
      });

      const mergedProducts = scraperData.items.map(item =>
        apiByAsin.has(item.asin)
          ? productFromAmazon(item, apiByAsin.get(item.asin))
          : productFromAmazon(item)
      );
      setProducts(prev => [...prev, ...mergedProducts]);

      // Analytics
      const allProducts = [...alibabaApiData.products, ...mergedProducts];
      const analytics = getNicheAnalytics(term, apiData, alibabaApiData, allProducts);
      setAnalytics(analytics);
      insertAnalytics(analytics);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveProduct = (id: string) => {
    setRemovedProductIds(prev => [...prev, id]);
  };

  const handleSaveNiche = async (keyword?: string) => {
    setSaveNicheLoading(true);
    if (!keyword) return;
    if (userAnalyticsState.includes(keyword)) {
      toast.promise(
        deleteUserAnalyticByKeyword(keyword).then(res => {
          if (res.success) setUserAnalyticsState(prev => prev.filter(k => k !== keyword));
          setSaveNicheLoading(false);
          return res;
        }),
        {
          loading: "Removing...",
          success: "Niche forgotten",
          error: "Error removing niche",
        }
      );
    } else {
      toast.promise(
        saveAnalytics(keyword).then(res => {
          if (res) setUserAnalyticsState(prev => [...prev, keyword]);
          setSaveNicheLoading(false);
          return res;
        }),
        {
          loading: "Saving...",
          success: "Niche saved",
          error: "Error saving niche",
        }
      );
    }
  };

  const isAnalyticsSaved = !!(analytics?.keyword && userAnalyticsState.includes(analytics.keyword));

  const amazonCategories = Array.from(
    new Set(products.filter(p => p.source === "amazon" && p.category).map(p => p.category))
  ).filter(Boolean) as string[];

  const visibleProducts = products.filter(p => !removedProductIds.includes(p.id));

  const filteredAmazonProducts = visibleProducts.filter((product) => product.source === "amazon")
    .filter((product, index, arr) =>
      product.asin
        ? arr.findIndex(p => p.asin === product.asin) === index
        : true
    )
    .filter((product) => product.rating && product.rating >= filters.minRating)
    .filter((product) => !filters.amazonCategory || product.category === filters.amazonCategory)
    .sort((a, b) => {
      if (sortField === "price") {
        return sortOrder === "asc"
          ? (a.price || 0) - (b.price || 0)
          : (b.price || 0) - (a.price || 0);
      } else if (sortField === "rating") {
        return sortOrder === "asc"
          ? (a.rating || 0) - (b.rating || 0)
          : (b.rating || 0) - (a.rating || 0);
      } else if (sortField === "reviews") {
        return sortOrder === "asc"
          ? (a.reviews || 0) - (b.reviews || 0)
          : (b.reviews || 0) - (a.reviews || 0);
      } else {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    })

  const filteredAlibabaProducts = visibleProducts.filter((product) => product.source === "alibaba")
    .filter((product) => {
      if (filters.verifiedOnly && !product.verified) return false
      if (filters.guaranteedOnly && !product.guaranteed) return false
      if (product.rating && product.rating < filters.minRating) return false
      if (filters.maxMOQ && product.minOrder) {
        const moq = parseInt(product.minOrder.toString().replace(/[^\d]/g, ""), 10)
        if (!isNaN(moq) && moq > Number(filters.maxMOQ)) return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortField === "price") {
        return sortOrder === "asc"
          ? (a.price || 0) - (b.price || 0)
          : (b.price || 0) - (a.price || 0);
      } else if (sortField === "rating") {
        return sortOrder === "asc"
          ? (a.rating || 0) - (b.rating || 0)
          : (b.rating || 0) - (a.rating || 0);
      } else if (sortField === "reviews") {
        return sortOrder === "asc"
          ? (a.reviews || 0) - (b.reviews || 0)
          : (b.reviews || 0) - (a.reviews || 0);
      } else {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    })

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Source",
      "ID",
      "Name",
      "Brand/Supplier",
      "Price",
      "Rating",
      "Reviews",
      "ASIN",
      "Category",
      "Min. Order",
      "Years",
      "Origin",
      "Verified",
      "Guaranteed",
      "URL",
    ].join(",")

    const amazonRows = filteredAmazonProducts.map((p) =>
      [
        p.source,
        p.id,
        `"${p.name}"`,
        `"${p.brand || ""}"`,
        p.price,
        p.rating,
        p.reviews,
        p.asin,
        `"${p.category || ""}"`,
        "",
        "",
        "",
        "",
        "",
        p.url,
      ].join(","),
    )

    const alibabaRows = filteredAlibabaProducts.map((p) =>
      [
        p.source,
        p.id,
        `"${p.name}"`,
        `"${p.brand || ""}"`,
        p.price,
        p.rating,
        p.reviews,
        "",
        "",
        p.minOrder,
        p.years,
        `"${p.origin || ""}"`,
        p.verified ? "Yes" : "No",
        p.guaranteed ? "Yes" : "No",
        p.url,
      ].join(","),
    )

    const csv = [headers, ...amazonRows, ...alibabaRows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "product_comparison.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!analytics || isLoading || saveNicheLoading}
            className="flex items-center gap-2"
            onClick={() => handleSaveNiche(analytics?.keyword)}
            aria-label="Save niche"
          >
            {isAnalyticsSaved ? (
              <>
                <Bookmark className="h-4 w-4 fill-primary text-primary" />
                <span>Forget niche</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                <span>Save niche</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => {
                    setSortField("price")
                    setSortOrder("asc")
                  }}
                  aria-checked={sortField === "price" && sortOrder === "asc"}
                  role="menuitemradio"
                >
                  Price: Low to High
                  {sortField === "price" && sortOrder === "asc" && (
                    <DropdownMenuShortcut>
                      <span className="text-xs text-muted-foreground">✓</span>
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortField("price")
                    setSortOrder("desc")
                  }}
                  aria-checked={sortField === "price" && sortOrder === "desc"}
                  role="menuitemradio"
                >
                  Price: High to Low
                  {sortField === "price" && sortOrder === "desc" && (
                    <DropdownMenuShortcut>
                      <span className="text-xs text-muted-foreground">✓</span>
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortField("rating")
                    setSortOrder("desc")
                  }}
                  aria-checked={sortField === "rating" && sortOrder === "desc"}
                  role="menuitemradio"
                >
                  Top Rated
                  {sortField === "rating" && sortOrder === "desc" && (
                    <DropdownMenuShortcut>
                      <span className="text-xs text-muted-foreground">✓</span>
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortField("reviews")
                    setSortOrder("desc")
                  }}
                  aria-checked={sortField === "reviews" && sortOrder === "desc"}
                  role="menuitemradio"
                >
                  Most Reviews
                  {sortField === "reviews" && sortOrder === "desc" && (
                    <DropdownMenuShortcut>
                      <span className="text-xs text-muted-foreground">✓</span>
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSortField("name")
                    setSortOrder("asc")
                  }}
                  aria-checked={sortField === "name" && sortOrder === "asc"}
                  role="menuitemradio"
                >
                  Name: A-Z
                  {sortField === "name" && sortOrder === "asc" && (
                    <DropdownMenuShortcut>
                      <span className="text-xs text-muted-foreground">✓</span>
                    </DropdownMenuShortcut>
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Minimum rating
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <div className="px-2 py-2">
                        <StarRating
                          value={filters.minRating}
                          onChange={(val) => setFilters({ ...filters, minRating: val })}
                          aria-label="Select minimum rating"
                        />
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Maximum rating
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <div className="px-2 py-2">
                        <StarRating
                          maximum
                          value={filters.maxRating}
                          onChange={(val) => setFilters({ ...filters, maxRating: val })}
                          aria-label="Select maximum rating"
                        />
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Max MOQ (Alibaba)
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <div className="px-2 py-2">
                        <input
                          id="max-moq"
                          type="number"
                          min={1}
                          placeholder="E.g. 1000"
                          className="w-full rounded border-gray-300 px-2 py-1 text-sm"
                          value={filters.maxMOQ}
                          onChange={e => setFilters({ ...filters, maxMOQ: e.target.value })}
                        />
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Category (Amazon)
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <div className="px-2 py-2">
                        <Select
                          value={filters.amazonCategory || "all"}
                          onValueChange={value => setFilters({ ...filters, amazonCategory: value === "all" ? "" : value })}
                        >
                          <SelectTrigger className="w-full rounded border-gray-300 px-2 py-1 text-sm" id="amazon-category">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {amazonCategories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem asChild>
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="checkbox"
                      id="verified-only"
                      checked={filters.verifiedOnly}
                      onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="verified-only" className="w-full cursor-pointer">Verified only (Alibaba)</Label>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <div className="flex items-center space-x-2 w-full">
                    <input
                      type="checkbox"
                      id="guaranteed-only"
                      checked={filters.guaranteedOnly}
                      onChange={(e) => setFilters({ ...filters, guaranteedOnly: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="guaranteed-only" className="w-full cursor-pointer">Guaranteed only (Alibaba)</Label>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      <section className="w-full max-w-full pb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <Button
            variant={selected === "amazon" ? "default" : "outline"}
            className={cn(
              "rounded-full font-semibold transition pl-1.5",
              selected === "amazon" && "shadow"
            )}
            onClick={() => setSelected("amazon")}
          >
            <img src="/assets/amazon-icon.png" alt="Amazon logo" className="h-7" />
            Amazon
          </Button>
          <Button
            variant={selected === "alibaba" ? "default" : "outline"}
            className={cn(
              "rounded-full px-4 py-1 font-semibold transition pl-1.5",
              selected === "alibaba" && "shadow"
            )}
            onClick={() => setSelected("alibaba")}
          >
            <img src="/assets/alibaba-icon.png" alt="Alibaba logo" className="h-7" />
            Alibaba
          </Button>
        </div>
        <div className="rounded-2xl border bg-background shadow-lg overflow-hidden">
          {selected === "amazon" ? (
            <ProductsTable products={filteredAmazonProducts} onRemove={handleRemoveProduct} type='amazon' isLoading={isLoading} />
          ) : (
            <ProductsTable products={filteredAlibabaProducts} onRemove={handleRemoveProduct} type='alibaba' isLoading={isLoading} />
          )}
        </div>
      </section>
      <NicheQuickOverview analytics={analytics} isLoading={isLoading} />
    </div>
  )
}