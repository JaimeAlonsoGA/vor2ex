import { Flame, Star, StarHalf, TrendingUp, Rocket, Trash2, Check, Shield, Megaphone } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductTableProps {
  products: Product[];
  onRemove?: (id: string) => void;
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
    { key: "image", label: "Image" },
    { key: "name", label: "Name" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "ranking", label: "Ranking" },
    { key: "price", label: "Price" },
    { key: "rating", label: "Rating" },
    { key: "reviews", label: "Reviews" },
    { key: "salesVolume", label: "Sales" },
    { key: "asin", label: "ASIN" },
    { key: "sponsored", label: "Sponsored" },
    { key: "createdAt", label: "Created" },
  ],
  alibaba: [
    { key: "image", label: "Image" },
    { key: "name", label: "Name" },
    { key: "supplier", label: "Supplier" },
    { key: "verified", label: "Verified" },
    { key: "moq", label: "MOQ" },
    { key: "price", label: "Price" },
    { key: "rating", label: "Rating" },
    { key: "reviews", label: "Reviews" },
    { key: "years", label: "Years" },
    { key: "guaranteed", label: "Guarantee" },
  ],
};

function renderStars(rating?: number) {
  if (!rating) rating = 0;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
        }
        if (i === fullStars && hasHalfStar) {
          return <StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />;
        }
        return <Star key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />;
      })}
      <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  );
}

export function ProductsTable({ products, onRemove, type, isLoading }: ProductTableProps) {
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

  return (
    <div className="overflow-scroll max-h-[500px] scrollbar-x-none scrollbar-y-none">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.key === "image" ? "w-[70px]" : ""}>
                {col.label}
              </TableHead>
            ))}
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 1 }).map((_, i) => (
              <TableSkeletonRow columns={columns} key={i} />
            ))
            : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <span className="text-muted-foreground">No products found</span>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="h-20 hover:bg-muted/40 transition">
                  {columns.map((col) => {
                    switch (col.key) {
                      case "image":
                        return (
                          <TableCell key="image" className="align-middle h-20">
                            <div className="w-14 h-14 relative rounded-lg overflow-hidden border bg-background">
                              <Image
                                src={product.imageUrl || "/placeholder.svg?height=64&width=64"}
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
                            <span className="text-sm">{product.category || "-"}</span>
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
                  <TableCell className="align-middle h-20 text-right">
                    {onRemove && (
                      <Button
                        variant="outline"
                        title="Remove product"
                        onClick={() => onRemove(product.id)}
                        className="border border-red-500"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )))}
        </TableBody>
      </Table>
    </div>
  );
}