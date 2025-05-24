'use client';

import { useState } from 'react';
import SearchBar from './search-bar';
import { Product } from '@/types/product';
import { collectAmazonCatalogData, collectAmazonCatalogDataByAsin } from '@/lib/functions/amazon/collect-sp-api-data';
import { productFromAmazon } from '@/lib/factories/amazon-item';
import { amazonSearchData } from '@/lib/amazonSearchData';
import { AlibabaSearchData } from '@/lib/alibabaSearchData';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bookmark, Download, Filter, Grid3X3, LayoutGrid, Search, SlidersHorizontal } from "lucide-react"
import { Button } from '../../ui/button';
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCards from './product-cards';
import ProductTable from './product-table';
import { collectAlibabaSearchData } from '@/lib/functions/alibaba/collect-alibaba-data';
import { collectAmazonSearchData } from '@/lib/functions/amazon/collect-scraper-data';
import { StarRating } from './star-rating';
import { getNicheAnalytics } from '@/lib/factories/analytics';
import NicheQuickOverview from './analytics/quick-overview';
import { NicheAnalytics } from '@/types/niche-analytics';
import { insertAnalytics, saveAnalytics } from '@/services/client/analytics.client';
import { Tables } from '@/types/supabase';
import { deleteUserAnalyticByKeyword } from '@/services/client/users-analytics.client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const PAGE_SIZE = 10;

type ViewMode = "table" | "cards"
type SortField = "price" | "rating" | "reviews" | "name"
type SortOrder = "asc" | "desc"

export default function ProductComparison({ userAnalytics }: { userAnalytics: Tables<'analytics'>['keyword'][] }) {
  // let products: Product[] = [];
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [analytics, setAnalytics] = useState<NicheAnalytics>();
  const [isLoading, setIsLoading] = useState(false);
  const [amazonPage, setAmazonPage] = useState(1);
  const [alibabaPage, setAlibabaPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const [sortField, setSortField] = useState<SortField>("price")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [removedProductIds, setRemovedProductIds] = useState<string[]>([]);
  const [userAnalyticsState, setUserAnalyticsState] = useState<Tables<'analytics'>['keyword'][]>(userAnalytics);
  const [filters, setFilters] = useState({
    verifiedOnly: false,
    guaranteedOnly: false,
    minRating: 0,
    maxMOQ: "",
    amazonCategory: "",
  });

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    setAmazonPage(1);
    setAlibabaPage(1);
    setSearchTerm(term);
    setIsLoading(true);

    try {
      // testing: keyword "cello"
      // const scraperPromise = collectAmazonSearchData(term);
      const scraperPromise = amazonSearchData;
      const amazonApiPromise = collectAmazonCatalogData(term);
      // const alibabaApiPromise = collectAlibabaSearchData(term);
      const alibabaApiPromise = AlibabaSearchData;

      // Espera a que ambas terminen
      const [scraperData, apiData, alibabaApiData] = await Promise.all([scraperPromise, amazonApiPromise, alibabaApiPromise]);
      console.log('Scraper data:', scraperData);
      console.log('Alibaba complete data:', alibabaApiData);
      setProducts([...alibabaApiData.products]);
      // Refina los datos del scraper
      const refinedScrapedData = scraperData.items.map(item => productFromAmazon(item));
      const sponsoredProducts = refinedScrapedData.filter(item => item.isSponsored);

      // Obtiene datos API por ASIN solo para los patrocinados
      const sponsoredProductsPromise = sponsoredProducts.map(item =>
        collectAmazonCatalogDataByAsin(item.asin!)
      );
      const sponsoredProductsData = await Promise.all(sponsoredProductsPromise);

      // Crea un mapa de asin -> apiItem
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

      // Fusiona los datos de ambos orígenes
      const mergedProducts = scraperData.items.map(item =>
        apiByAsin.has(item.asin)
          ? productFromAmazon(item, apiByAsin.get(item.asin))
          : productFromAmazon(item)
      );
      console.log('Amazon complete data:', mergedProducts);
      setProducts(prev => [...prev, ...mergedProducts]);

      //Analíticas
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
    if (!keyword) return;
    if (userAnalyticsState.includes(keyword)) {
      toast.promise(
        deleteUserAnalyticByKeyword(keyword).then(res => {
          if (res.success) setUserAnalyticsState(prev => prev.filter(k => k !== keyword));
          return res;
        }),
        {
          loading: "Removing...",
          success: "Niche forgotten",
          error: "Error removing niche",
        }
      );
    } else {
      const res = await saveAnalytics(keyword);
      if (res) setUserAnalyticsState(prev => [...prev, keyword]);
      toast.promise(
        saveAnalytics(keyword).then(res => {
          if (res) setUserAnalyticsState(prev => [...prev, keyword]);
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
        return sortOrder === "asc" ? (a.price || 0) - (b.price || 0) : (b.price || 0) - (a.price || 0)
      } else if (sortField === "rating") {
        return sortOrder === "asc" ? (a.rating || 0) - (b.rating || 0) : (b.rating || 0) - (a.rating || 0)
      } else if (sortField === "reviews") {
        return sortOrder === "asc" ? (a.reviews || 0) - (b.reviews || 0) : (b.reviews || 0) - (a.reviews || 0)
      } else {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }
    })

  const filteredAlibabaProducts = visibleProducts.filter((product) => product.source === "alibaba")
    // .filter(
    //   (product) =>
    //     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     product.supplier?.toLowerCase().includes(searchTerm.toLowerCase()),
    // )
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
        return sortOrder === "asc" ? (a.price || 0) - (b.price || 0) : (b.price || 0) - (a.price || 0)
      } else if (sortField === "rating") {
        return sortOrder === "asc" ? (a.rating || 0) - (b.rating || 0) : (b.rating || 0) - (a.rating || 0)
      } else if (sortField === "reviews") {
        return sortOrder === "asc" ? (a.reviews || 0) - (b.reviews || 0) : (b.reviews || 0) - (a.reviews || 0)
      } else {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }
    })

  // Exportar a CSV
  const exportToCSV = () => {
    const headers = [
      "Fuente",
      "ID",
      "Nombre",
      "Marca/Proveedor",
      "Precio",
      "Rating",
      "Reviews",
      "ASIN",
      "Categoría",
      "Min. Orden",
      "Años",
      "Origen",
      "Verificado",
      "Garantizado",
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
        p.verified ? "Sí" : "No",
        p.guaranteed ? "Sí" : "No",
        p.url,
      ].join(","),
    )

    const csv = [headers, ...amazonRows, ...alibabaRows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "comparacion_productos.csv")
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
            disabled={!analytics || isLoading}
            size="sm"
            className="flex items-center gap-2"
            onClick={() => handleSaveNiche(analytics?.keyword)}
            aria-label="Guardar nicho"
          >
            {isAnalyticsSaved ? (
              <>
                <Bookmark className="h-4 w-4 fill-primary text-primary" />
                <span>Olvidar nicho</span>
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                <span>Guardar nicho</span>
              </>
            )}
          </Button>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSortField("price")
                  setSortOrder("asc")
                }}
              >
                Precio: Menor a Mayor
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortField("price")
                  setSortOrder("desc")
                }}
              >
                Precio: Mayor a Menor
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortField("rating")
                  setSortOrder("desc")
                }}
              >
                Mejor Valorados
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortField("reviews")
                  setSortOrder("desc")
                }}
              >
                Más Reseñas
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSortField("name")
                  setSortOrder("asc")
                }}
              >
                Nombre: A-Z
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <div className="space-y-2">
                  <Label htmlFor="min-rating">Rating mínimo</Label>
                  <StarRating
                    value={filters.minRating}
                    onChange={(val) => setFilters({ ...filters, minRating: val })}
                    aria-label="Seleccionar rating mínimo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-moq">MOQ máximo (Alibaba)</Label>
                  <input
                    id="max-moq"
                    type="number"
                    min={1}
                    placeholder="Ej: 1000"
                    className="w-full rounded border-gray-300 px-2 py-1 text-sm"
                    value={filters.maxMOQ}
                    onChange={e => setFilters({ ...filters, maxMOQ: e.target.value })}
                  />
                </div>
                {/* Filtro de categoría solo para Amazon */}
                <div className="space-y-2">
                  <Label htmlFor="amazon-category">Categoría (Amazon)</Label>
                  <Select
                    value={filters.amazonCategory || "all"}
                    onValueChange={value => setFilters({ ...filters, amazonCategory: value === "all" ? "" : value })}
                  >
                    <SelectTrigger className="w-full rounded border-gray-300 px-2 py-1 text-sm" id="amazon-category">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {amazonCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <input
                    type="checkbox"
                    id="verified-only"
                    checked={filters.verifiedOnly}
                    onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="verified-only">Solo verificados (Alibaba)</Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    id="guaranteed-only"
                    checked={filters.guaranteedOnly}
                    onChange={(e) => setFilters({ ...filters, guaranteedOnly: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="guaranteed-only">Solo garantizados (Alibaba)</Label>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="sr-only">Vista de tabla</span>
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="rounded-l-none"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Vista de tarjetas</span>
            </Button>
          </div>
        </div>
      </div>
      <NicheQuickOverview analytics={analytics} isLoading={isLoading} />
      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="comparison">Comparación</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <img src="/assets/amazon-icon.png" alt="Amazon logo" className="mr-2 h-6" />
                Amazon
              </h2>
              {viewMode === "table" ? (
                <div className="max-w-full overflow-x-auto">
                  <ProductTable products={filteredAmazonProducts} tableView='comparison' onRemove={handleRemoveProduct} />
                </div>
              ) : (
                <ProductCards products={filteredAmazonProducts} />
              )}
            </div>

            <div className="overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <img src="/assets/alibaba-icon.png" alt="Alibaba logo" className="mr-2 h-6" />
                Alibaba
              </h2>
              {viewMode === "table" ? (
                <div className="max-w-full overflow-x-auto">
                  <ProductTable products={filteredAlibabaProducts} tableView='comparison' onRemove={handleRemoveProduct} />
                </div>
              ) : (
                <ProductCards products={filteredAlibabaProducts} />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="individual">
          <Tabs defaultValue="amazon">
            <TabsList>
              <TabsTrigger value="amazon">Amazon</TabsTrigger>
              <TabsTrigger value="alibaba">Alibaba</TabsTrigger>
            </TabsList>

            <TabsContent value="amazon" className="pt-4 overflow-x-auto">
              {viewMode === "table" ? (
                <div className="max-w-full overflow-x-auto">
                  <ProductTable products={filteredAmazonProducts} tableView='detailed' onRemove={handleRemoveProduct} />
                </div>
              ) : (
                <ProductCards products={filteredAmazonProducts} />
              )}
            </TabsContent>

            <TabsContent value="alibaba" className="pt-4 overflow-x-auto">
              {viewMode === "table" ? (
                <div className="max-w-full overflow-x-auto">
                  <ProductTable products={filteredAlibabaProducts} tableView='detailed' onRemove={handleRemoveProduct} />
                </div>
              ) : (
                <ProductCards products={filteredAlibabaProducts} />
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
