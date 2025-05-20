'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, truncateText } from '@/lib/utils';
import ProductCard from './product-card';
import { ExternalLink, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { estimateMonthlySales } from '@/lib/functions/estimate-monthly-sales';
import { PAGE_SIZE } from '..';
import { Product } from '@/lib/types/product';
import TableSkeleton from './table-skeleton';

interface ComparativeTableProps {
  searchTerm: string;
  isLoading: boolean;
  amazonProducts?: Product[];
  alibabaProducts: Product[];
  onLoadNextAmazonPage?: () => void;
  onLoadPreviousAmazonPage?: () => void;
  amazonPage: number;
  alibabaPage: number;
}

export default function ComparativeTable({ searchTerm, isLoading, amazonProducts, alibabaProducts, onLoadNextAmazonPage, onLoadPreviousAmazonPage, amazonPage, alibabaPage }: ComparativeTableProps) {
  const [sortType, setSortType] = useState<'relevant' | 'price-low' | 'price-high' | 'sales'>('relevant');
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  // const totalAmazonPages = amazonProducts ? Math.ceil((amazonProducts.numberOfResults || 0) / PAGE_SIZE) : 1;
  // const totalAlibabaPages = alibabaProducts ? Math.ceil((alibabaProducts.length || 0) / PAGE_SIZE) : 1;

  // function renderAmazonPagination() {
  //   return (
  //     <div className="flex justify-center gap-2 mt-4">
  //       <Button
  //         variant="outline"
  //         size="sm"
  //         disabled={amazonPage === 1}
  //         onClick={() => {
  //           onLoadPreviousAmazonPage?.();
  //         }}
  //       >
  //         Previous
  //       </Button>
  //       <span className="text-xs flex items-center">
  //         Page {amazonPage} of {totalAmazonPages}
  //       </span>
  //       <Button
  //         variant="outline"
  //         size="sm"
  //         disabled={amazonPage === totalAmazonPages}
  //         onClick={() => {
  //           if (amazonProducts?.pagination?.nextToken) {
  //             onLoadNextAmazonPage?.();
  //           }
  //         }}
  //       >
  //         Next
  //       </Button>
  //     </div>
  //   );
  // }

  // const getSortedAmazonProducts = () => {
  //   if (!amazonProducts) return [];

  //   let sorted = [...amazonProducts.items];
  //   switch (sortType) {
  //     case 'price-low':
  //       sorted.sort((a, b) =>
  //         (a.offers?.payload.Summary?.LowestPrices?.[0]?.ListingPrice?.Amount ?? Infinity) -
  //         (b.offers?.payload.Summary?.LowestPrices?.[0]?.ListingPrice?.Amount ?? Infinity)
  //       );
  //       break;
  //     case 'price-high':
  //       sorted.sort((a, b) =>
  //         (b.offers?.payload.Summary?.LowestPrices?.[0]?.ListingPrice?.Amount ?? -Infinity) -
  //         (a.offers?.payload.Summary?.LowestPrices?.[0]?.ListingPrice?.Amount ?? -Infinity)
  //       );
  //       break;
  //     case 'sales':
  //       sorted.sort((a, b) =>
  //         (a.salesRanks?.[0]?.classificationRanks?.[0]?.rank ?? Infinity) -
  //         (b.salesRanks?.[0]?.classificationRanks?.[0]?.rank ?? Infinity)
  //       );
  //       break;
  //     case 'relevant':
  //     default:
  //       // No sorting, keep original order
  //       break;
  //   }
  //   return sorted.slice(-PAGE_SIZE);
  // };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{searchTerm ? `Results for "${searchTerm}"` : 'Product Comparison'}</h2>

        <div className="flex gap-2">
          <Select value={sortType} onValueChange={v => setSortType(v as typeof sortType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevant">Most Relevant</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="sales">Best Selling</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-4">
              <h3 className="font-medium mb-2">Visible Columns</h3>
              <div className="space-y-2">
                Filtro
                {/* {Object.entries(visibleColumns).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={`column-${key}`}
                      checked={value}
                      onCheckedChange={() => toggleColumn(key)}
                    />
                    <Label htmlFor={`column-${key}`} className="capitalize">
                      {key}
                    </Label>
                  </div>
                ))} */}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-0">
            {isLoading && (!amazonProducts || !amazonProducts.length) ? (
              <TableSkeleton />
            ) : (
              <>
                <div className="p-4 border-b bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-medium flex items-center">
                    <span className="text-xl">Amazon</span>
                    {/* <Badge variant="outline" className="ml-2">
                      {amazonProducts?.numberOfResults || 0} products
                    </Badge> */}
                    <span className="ml-2 text-xs text-muted-foreground">
                      Loaded: {amazonProducts?.length || 0}
                    </span>
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {/* {getSortedAmazonProducts().length ? (
                    getSortedAmazonProducts().map((product, index) => ( */}
                  {amazonProducts?.length ? (
                    amazonProducts.map((product, index) => (
                      <ProductCard
                        key={index}
                        product={product}
                        isExpanded={expandedProductId === product.id}
                        onExpand={() => setExpandedProductId(product.id)}
                      />
                    ))
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No Amazon products found for this search term
                    </div>
                  )}
                  <div className="flex justify-center gap-2 mt-4">
                    {/* {renderAmazonPagination()} */}
                    Pagination
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            {isLoading && (!alibabaProducts || !alibabaProducts.length) ? (
              <TableSkeleton />
            ) : (
              <>
                <div className="p-4 border-b bg-slate-50 dark:bg-slate-900">
                  <h3 className="font-medium flex items-center">
                    <span className="text-xl">Alibaba</span>
                    <Badge variant="outline" className="ml-2">
                      {alibabaProducts?.length || 0} products
                    </Badge>
                    <span className="ml-2 text-xs text-muted-foreground">
                      Loaded: {alibabaProducts?.length || 0}
                    </span>
                  </h3>
                </div>
                <div className="p-4 space-y-4">
                  {alibabaProducts?.length ? (
                    alibabaProducts.map((product, index) => (
                      <ProductCard
                        key={index}
                        product={product}
                        isExpanded={expandedProductId === product.id}
                      />
                    ))
                  ) : (
                    <div className="py-8 text-center text-muted-foreground">
                      No Alibaba products found for this search term
                    </div>
                  )}
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={alibabaPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-xs flex items-center">
                      {/* Page {alibabaPage} of {totalAlibabaPages} */}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                    // disabled={alibabaPage === totalAlibabaPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}