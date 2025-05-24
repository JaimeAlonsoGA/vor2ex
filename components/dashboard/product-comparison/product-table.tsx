import { ChartLine, Flame, Star, StarHalf, TrendingUp, Filter, Rocket, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Check, Shield } from "lucide-react"
import { Product } from "@/types/product"
import { useState } from "react"

// Define all possible columns
const ALL_COLUMNS = [
  { key: "image", label: "Imagen", always: true },
  { key: "name", label: "Nombre", always: false },
  { key: "brand", label: "Marca", only: "amazon" },
  { key: "supplier", label: "Proveedor", only: "alibaba" },
  { key: "ranking", label: "Ranking", only: "amazon" },
  { key: "verified", label: "Verificado", only: "alibaba" },
  { key: "category", label: "Categoría", only: "amazon" },
  { key: "moq", label: "MOQ", only: "alibaba" },
  { key: "price", label: "Precio", always: false },
  { key: "rating", label: "Rating", always: false },
  { key: "reviews", label: "Reviews", always: false },
  { key: "salesVolume", label: "Sales Volume", only: "amazon" },
  { key: "asin", label: "ASIN", only: "amazon" },
  { key: "sponsored", label: "Sponsored", only: "amazon" },
  { key: "createdAt", label: "Creado", only: "amazon" },
  { key: "years", label: "Years", only: "alibaba" },
  { key: "guaranteed", label: "Guaranteed", only: "alibaba" },
];

interface ProductTableProps {
  products: Product[]
  tableView: 'comparison' | 'detailed',
  onRemove?: (id: string) => void
}

type HoveredImage = {
  url: string
  name: string
  cellIndex: number | null
}

export default function ProductTable({ products, tableView, onRemove }: ProductTableProps) {
  const [hoveredImage, setHoveredImage] = useState<HoveredImage | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Default columns to show
  const defaultColumns = [
    "image",
    "name",
    "brand",
    "supplier",
    "ranking",
    "verified",
    "category",
    "moq",
    "price",
    "rating",
    "reviews",
  ];

  // Allow user to toggle columns
  const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultColumns);

  // Detect source
  const source = products.length > 0 ? products[0].source : "amazon";

  // Add source-specific columns if not present
  const sourceColumns = ALL_COLUMNS.filter(
    c =>
      (c.always || visibleColumns.includes(c.key)) &&
      (!c.only || c.only === source)
  );

  // Max values for highlighting
  const maxRankingByCategory: Record<string, number> = {};
  const maxReviewsByCategory: Record<string, number> = {};

  products.forEach((product) => {
    if (product.source === "amazon" && product.category) {
      if (
        typeof product.ranking === "number" &&
        (
          maxRankingByCategory[product.category] === undefined ||
          product.ranking > maxRankingByCategory[product.category]
        )
      ) {
        maxRankingByCategory[product.category] = product.ranking;
      }
      if (
        typeof product.reviews === "number" &&
        (
          maxReviewsByCategory[product.category] === undefined ||
          product.reviews > maxReviewsByCategory[product.category]
        )
      ) {
        maxReviewsByCategory[product.category] = product.reviews;
      }
    }
  });

  const renderStars = (rating?: number) => {
    if (!rating) rating = 0
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    return (
      <div className="flex items-center">
        {tableView === 'detailed' && [...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          }
          if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          }
          return <Star key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
        })}
        <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead colSpan={7} className="text-center py-8">
              No se encontraron productos que coincidan con los criterios de búsqueda.
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    )
  }

  return (
    <div className="border rounded-lg max-h-[70vh] overflow-y-auto">
      {/* Filter toggle */}
      <div className="flex items-center gap-2 px-4 py-2 bg-muted border-b sticky top-0 z-10">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setShowFilters(v => !v)}
        >
          <Filter className="w-4 h-4" />
          Filtrar columnas
        </Button>
        {showFilters && (
          <div className="flex flex-wrap gap-2 ml-4">
            {ALL_COLUMNS.filter(c => !c.always && (!c.only || c.only === source)).map(col => (
              <label key={col.key} className="flex items-center gap-1 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={visibleColumns.includes(col.key)}
                  onChange={e => {
                    setVisibleColumns(cols =>
                      e.target.checked
                        ? [...cols, col.key]
                        : cols.filter(k => k !== col.key)
                    );
                  }}
                  className="accent-blue-600"
                />
                {col.label}
              </label>
            ))}
          </div>
        )}
      </div>
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow>
              {sourceColumns.map(col => (
                <TableHead key={col.key} className={col.key === "image" ? "w-[80px]" : ""}>
                  {col.label}
                </TableHead>
              ))}
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, rowIdx) => (
              <TableRow key={product.id} className="h-20">
                {sourceColumns.map(col => {
                  switch (col.key) {
                    case "image":
                      return (
                        <TableCell key="image" className="align-middle h-20">
                          <div
                            className="w-16 h-16 relative cursor-pointer"
                            onMouseEnter={() => {
                              setHoveredImage({
                                url: product.imageUrl || "/placeholder.svg?height=256&width=256",
                                name: product.name,
                                cellIndex: rowIdx,
                              });
                            }}
                            onMouseLeave={() => setHoveredImage(null)}
                          >
                            <Image
                              src={product.imageUrl || "/placeholder.svg?height=64&width=64"}
                              alt={product.name}
                              fill
                              className="object-contain"
                            />
                            {hoveredImage &&
                              hoveredImage.url === (product.imageUrl || "/placeholder.svg?height=256&width=256") &&
                              hoveredImage.cellIndex === rowIdx && (
                                <div
                                  className="absolute z-50 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg shadow-xl p-2 transition-all pointer-events-auto"
                                  style={{
                                    top: 0,
                                    left: "110%",
                                    minWidth: 200,
                                    minHeight: 200,
                                    maxWidth: 320,
                                    maxHeight: 320,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.25)",
                                    pointerEvents: "auto",
                                    position: "absolute",
                                    whiteSpace: "nowrap"
                                  }}
                                  onMouseLeave={() => setHoveredImage(null)}
                                >
                                  <Image
                                    src={hoveredImage.url}
                                    alt={hoveredImage.name}
                                    width={256}
                                    height={256}
                                    className="object-contain rounded"
                                    style={{ maxWidth: 300, maxHeight: 300 }}
                                    priority
                                  />
                                </div>
                              )}
                          </div>
                        </TableCell>
                      );
                    case "name":
                      return (
                        <TableCell key="name" className="align-middle h-20">
                          <div className="flex items-center gap-2">
                            {product.bestSeller &&
                              <Rocket className="h-3 w-3 text-red-500" />}
                            <Rocket className="h-3 w-3 invisible" aria-hidden />
                            <a
                              href={product.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium hover:underline line-clamp-2"
                            >
                              {product.name}
                            </a>
                          </div>
                        </TableCell>
                      );
                    case "brand":
                      return (
                        <TableCell key="brand" className="align-middle h-20">
                          <div className="text-xs text-muted-foreground line-clamp-2 max-h-[2.5em]">
                            {product.brand || "-"}
                          </div>
                        </TableCell>
                      );
                    case "supplier":
                      return (
                        <TableCell key="supplier" className="align-middle h-20">
                          <div className="text-xs text-muted-foreground line-clamp-2 max-h-[2.5em]">
                            {product.supplier || "-"}
                          </div>
                        </TableCell>
                      );
                    case "ranking":
                      return (
                        <TableCell key="ranking" className="align-middle h-20">
                          <div className="flex items-center gap-1">
                            {product.category &&
                              typeof product.ranking === "number" &&
                              product.ranking === maxRankingByCategory[product.category] && (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              )}
                            <TrendingUp className="h-3 w-3 invisible" aria-hidden />
                            <span className="font-medium">{product.ranking || "-"}</span>
                          </div>
                        </TableCell>
                      );
                    case "verified":
                      return (
                        <TableCell key="verified" className="align-middle h-20">
                          <div className="flex gap-1">
                            {product.verified ? (
                              <Badge variant="outline" className="text-xs flex items-center border-[#E88B00]">
                                <Check className="h-3 w-3" />
                                <span className="sr-only">Verificado</span>
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">No</span>
                            )}
                          </div>
                        </TableCell>
                      );
                    case "category":
                      return (
                        <TableCell key="category" className="align-middle h-20">
                          <span className="text-sm">{product.category || "-"}</span>
                        </TableCell>
                      );
                    case "moq":
                      return (
                        <TableCell key="moq" className="align-middle h-20">
                          <span className="text-sm">{product.minOrder || "-"}</span>
                        </TableCell>
                      );
                    case "price":
                      return (
                        <TableCell key="price" className="align-middle h-20">
                          {product.price ? (
                            <span className="font-medium">
                              {product.price.toLocaleString("es-ES", {
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
                    case "categoryOrMOQ":
                      return (
                        <TableCell key="categoryOrMOQ" className="align-middle h-20">
                          {product.source === "amazon" ? (
                            <span className="text-sm">{product.category || "-"}</span>
                          ) : (
                            <span className="text-sm">{product.minOrder || "-"}</span>
                          )}
                        </TableCell>
                      );
                    case "reviews":
                      return (
                        <TableCell key="reviews" className="align-middle h-20">
                          <div className="flex items-center gap-1">
                            {product.category &&
                              typeof product.reviews === "number" &&
                              product.reviews === maxReviewsByCategory[product.category] && (
                                <Flame className="h-3 w-3 text-orange-500" />
                              )}
                            <Flame className="h-3 w-3 invisible" aria-hidden />
                            <span className="text-sm">{product.reviews ? product.reviews.toLocaleString() : "-"}</span>
                          </div>
                        </TableCell>
                      );
                    case "salesVolume":
                      return (
                        <TableCell key="salesVolume" className="align-middle h-20">
                          {"+" + (product.salesVolume ? product.salesVolume.toLocaleString() + " comprados el mes pasado" : "-")}
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
                            <Badge variant="secondary" className="text-xs">Sponsored</Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">No</span>
                          )}
                        </TableCell>
                      );
                    case "createdAt":
                      return (
                        <TableCell key="createdAt" className="align-middle h-20">
                          {product.createdAt
                            ? new Date(product.createdAt).toLocaleDateString("es-ES")
                            : "-"}
                        </TableCell>
                      );
                    case "years":
                      return (
                        <TableCell key="years" className="align-middle h-20">
                          {product.years ? (
                            <span className="text-xs">{product.years} años</span>
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
                      title="Eliminar producto"
                      onClick={() => onRemove(product.id)}
                      className="border border-red-500"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}