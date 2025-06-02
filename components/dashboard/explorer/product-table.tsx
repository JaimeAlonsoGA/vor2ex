'use client';

import { useState, useMemo } from "react";
import { Flame, TrendingUp, Rocket, Trash2, Check, Shield, Megaphone, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { renderStars } from "../render-start";

interface ProductTableProps {
  products: Product[];
  type: "amazon" | "alibaba";
  isLoading?: boolean;
}

function TableSkeletonRow({ columns }: { columns: { key: string; label: string }[] }) {
  return (
    <TableRow>
      <TableCell colSpan={columns.length} className="h-20">
        <Skeleton className="h-5 w-full rounded" />
      </TableCell>
    </TableRow>
  );
}

const TABLE_COLUMNS = {
  amazon: [
    { key: "image", label: "Image", sortable: false },
    { key: "name", label: "Name", sortable: false },
    { key: "brand", label: "Brand", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "ranking", label: "Ranking", sortable: true },
    { key: "price", label: "Price", sortable: true },
    { key: "rating", label: "Rating", sortable: true },
    { key: "reviews", label: "Reviews", sortable: true },
    { key: "salesVolume", label: "Sales", sortable: true },
    { key: "asin", label: "ASIN", sortable: false },
    { key: "sponsored", label: "Sponsored", sortable: true },
    { key: "createdAt", label: "Created", sortable: true },
  ],
  alibaba: [
    { key: "image", label: "Image", sortable: false },
    { key: "name", label: "Name", sortable: false },
    { key: "supplier", label: "Supplier", sortable: true },
    { key: "verified", label: "Verified", sortable: true },
    { key: "moq", label: "MOQ", sortable: true },
    { key: "price", label: "Price", sortable: true },
    { key: "rating", label: "Rating", sortable: true },
    { key: "reviews", label: "Reviews", sortable: true },
    { key: "years", label: "Years", sortable: true },
    { key: "guaranteed", label: "Guarantee", sortable: true },
  ],
};

type SortDirection = "asc" | "desc";
type SortState = { column: string; direction: SortDirection };

function getDefaultSort(type: "amazon" | "alibaba"): SortState {
  if (type === "amazon") return { column: "ranking", direction: "asc" };
  return { column: "price", direction: "asc" };
}

function getCellValue(product: Product, key: string) {
  // Helper to get value for sorting
  switch (key) {
    case "price":
      return typeof product.price === "number" ? product.price : 0;
    case "ranking":
      return typeof product.ranking === "number" ? product.ranking : Number.MAX_SAFE_INTEGER;
    case "rating":
      return typeof product.rating === "number" ? product.rating : 0;
    case "reviews":
      return typeof product.reviews === "number" ? product.reviews : 0;
    case "salesVolume":
      return typeof product.salesVolume === "number" ? product.salesVolume : 0;
    case "createdAt":
      return product.createdAt ? new Date(product.createdAt).getTime() : 0;
    case "years":
      return typeof product.years === "number" ? product.years : 0;
    case "moq":
      return typeof product.minOrder === "number" ? product.minOrder : 0;
    case "verified":
    case "guaranteed":
    case "sponsored":
      return !!(product as any)[key];
    default:
      return (product as any)[key]?.toString().toLowerCase?.() ?? "";
  }
}

export function ProductsTable({ products, type, isLoading }: ProductTableProps) {
  // Amazon highlights
  const maxRankingByCategory: Record<string, number> = {};
  const maxReviewsByCategory: Record<string, number> = {};
  if (type === "amazon") {
    products.forEach((product) => {
      if (product.category) {
        if (
          typeof product.ranking === "number" &&
          (maxRankingByCategory[product.category] === undefined ||
            product.ranking > maxRankingByCategory[product.category])
        ) {
          maxRankingByCategory[product.category] = product.ranking;
        }
        if (
          typeof product.reviews === "number" &&
          (maxReviewsByCategory[product.category] === undefined ||
            product.reviews > maxReviewsByCategory[product.category])
        ) {
          maxReviewsByCategory[product.category] = product.reviews;
        }
      }
    });
  }

  const columns = TABLE_COLUMNS[type];

  const [sort, setSort] = useState<SortState>(getDefaultSort(type));

  const sortedProducts = useMemo(() => {
    if (!sort.column) return products;
    const sorted = [...products].sort((a, b) => {
      const aValue = getCellValue(a, sort.column);
      const bValue = getCellValue(b, sort.column);

      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        if (sort.direction === "asc") return (aValue === bValue) ? 0 : aValue ? -1 : 1;
        return (aValue === bValue) ? 0 : aValue ? 1 : -1;
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
      }
      return sort.direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
    return sorted;
  }, [products, sort]);

  function renderSortIcon(colKey: string) {
    if (sort.column !== colKey) return <ArrowUpDown className="inline h-3 w-3 text-muted-foreground ml-1" />;
    return sort.direction === "asc" ? (
      <ArrowUp className="inline h-3 w-3 text-blue-500 ml-1" />
    ) : (
      <ArrowDown className="inline h-3 w-3 text-blue-500 ml-1" />
    );
  }

  function handleSort(colKey: string) {
    setSort((prev) => {
      if (prev.column === colKey) {
        return { column: colKey, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { column: colKey, direction: "asc" };
    });
  }

  return (
    <div className="overflow-scroll max-h-[500px] scrollbar-x-none scrollbar-y-none">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={`
                  select-none
                  ${col.key === "image" ? "w-[70px] sticky left-0 z-20 bg-background" : ""}
                  ${col.sortable ? "cursor-pointer hover:bg-muted transition" : ""}
                  sticky top-0 z-10 bg-background
                `}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                aria-sort={
                  sort.column === col.key
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
                tabIndex={col.sortable ? 0 : -1}
                role={col.sortable ? "button" : undefined}
                onKeyDown={
                  col.sortable
                    ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSort(col.key);
                      }
                    }
                    : undefined
                }
              >
                <span className="flex items-center">
                  {col.label}
                  {col.sortable && renderSortIcon(col.key)}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 1 }).map((_, i) => (
              <TableSkeletonRow columns={columns} key={i} />
            ))
            : sortedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <span className="text-muted-foreground">No products found</span>
                </TableCell>
              </TableRow>
            ) : (
              sortedProducts.map((product) => (
                <TableRow key={product.id} className="h-20 hover:bg-muted/40 transition">
                  {columns.map((col) => {
                    switch (col.key) {
                      case "image":
                        return (
                          <TableCell key="image"
                            className="align-middle h-20 sticky left-0 z-10 bg-background"

                          >
                            <div className="w-14 h-14 relative rounded-lg overflow-hidden border bg-background">
                              <Image
                                src={product.imageUrl ?? "https://placehold.co/600x600?text=Vor2ex"}
                                alt={product.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                          </TableCell>
                        );
                      case "name":
                        return (
                          <TableCell key="name" className="align-middle h-20">
                            <div className="flex items-center gap-2">
                              {type === "amazon" && product.bestSeller && <Rocket className="h-3 w-3 text-red-500" />}
                              <a
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium hover:underline max-w-[180px] truncate"
                                title={product.name}
                                tabIndex={0}
                                aria-label={product.name}
                              >
                                {product.name}
                              </a>
                            </div>
                          </TableCell>
                        );
                      case "brand":
                        return (
                          <TableCell key="brand" className="align-middle h-20">
                            <div className="text-xs text-muted-foreground line-clamp-2">{product.brand || "-"}</div>
                          </TableCell>
                        );
                      case "category":
                        return (
                          <TableCell key="category" className="align-middle h-20">
                            <span className={`text-sm ${product.category && "text-blue-400"}`}>{product.category || "-"}</span>
                          </TableCell>
                        );
                      case "ranking":
                        return (
                          <TableCell key="ranking" className="align-middle h-20">
                            <div className="flex items-center gap-1">
                              {type === "amazon" &&
                                product.category &&
                                typeof product.ranking === "number" &&
                                product.ranking === maxRankingByCategory[product.category] && (
                                  <TrendingUp className="h-3 w-3 text-green-600" />
                                )}
                              <span className="font-medium">{product.ranking || "-"}</span>
                            </div>
                          </TableCell>
                        );
                      case "price":
                        return (
                          <TableCell key="price" className="align-middle h-20">
                            {product.price ? (
                              <span className="font-medium">
                                {product.price.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })}
                              </span>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                        );
                      case "rating":
                        return (
                          <TableCell key="rating" className="align-middle h-20">
                            {renderStars(product.rating)}
                          </TableCell>
                        );
                      case "reviews":
                        return (
                          <TableCell key="reviews" className="align-middle h-20">
                            <div className="flex items-center gap-1">
                              {type === "amazon" &&
                                product.category &&
                                typeof product.reviews === "number" &&
                                product.reviews === maxReviewsByCategory[product.category] && (
                                  <Flame className="h-3 w-3 text-orange-500" />
                                )}
                              <span className="text-sm">{product.reviews ? product.reviews.toLocaleString() : "-"}</span>
                            </div>
                          </TableCell>
                        );
                      case "salesVolume":
                        return (
                          <TableCell key="salesVolume" className="align-middle h-20">
                            {product.salesVolume
                              ? "+" + product.salesVolume.toLocaleString() + " / month"
                              : "-"}
                          </TableCell>
                        );
                      case "asin":
                        return (
                          <TableCell key="asin" className="align-middle h-20">
                            <span className="text-xs font-mono">{product.asin || "-"}</span>
                          </TableCell>
                        );
                      case "sponsored":
                        return (
                          <TableCell key="sponsored" className="align-middle h-20">
                            {product.isSponsored ? (
                              <Badge variant="secondary" className="text-xs"><Megaphone className="h-4 w-4 text-red-500" /></Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">No</span>
                            )}
                          </TableCell>
                        );
                      case "createdAt":
                        return (
                          <TableCell key="createdAt" className="align-middle h-20">
                            {product.createdAt
                              ? new Date(product.createdAt).toLocaleDateString("en-US")
                              : "-"}
                          </TableCell>
                        );
                      case "supplier":
                        return (
                          <TableCell key="supplier" className="align-middle h-20">
                            <div className="text-xs text-muted-foreground line-clamp-2">{product.supplier || "-"}</div>
                          </TableCell>
                        );
                      case "verified":
                        return (
                          <TableCell key="verified" className="align-middle h-20">
                            {product.verified ? (
                              <Badge variant="outline" className="text-xs flex items-center border-[#E88B00]">
                                <Check className="h-3 w-3" />
                                <span className="sr-only">Verified</span>
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">No</span>
                            )}
                          </TableCell>
                        );
                      case "moq":
                        return (
                          <TableCell key="moq" className="align-middle h-20">
                            <span className="text-sm">{product.minOrder || "-"}</span>
                          </TableCell>
                        );
                      case "years":
                        return (
                          <TableCell key="years" className="align-middle h-20">
                            {product.years ? (
                              <span className="text-xs">{product.years} years</span>
                            ) : (
                              <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        );
                      case "guaranteed":
                        return (
                          <TableCell key="guaranteed" className="align-middle h-20">
                            {product.guaranteed ? (
                              <Badge variant="outline" className="text-xs flex items-center border-blue-600">
                                <Shield className="h-3 w-3" />
                                <span className="ml-1">Guaranteed</span>
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">No</span>
                            )}
                          </TableCell>
                        );
                      default:
                        return null;
                    }
                  })}
                </TableRow>
              ))
            )}
        </TableBody>
      </Table>
    </div>
  );
}