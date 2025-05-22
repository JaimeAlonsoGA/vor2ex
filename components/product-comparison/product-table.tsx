import { Star, StarHalf } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Product } from "@/lib/types/product"

export default function ProductTable({ products }: { products: Product[] }) {
  // Función para renderizar estrellas
  const renderStars = (rating?: number) => {
    if (!rating) return null

    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Imagen</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Marca/Proveedor</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Detalles</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                No se encontraron productos que coincidan con los criterios de búsqueda.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="w-16 h-16 relative">
                    <Image
                      src={product.imageUrl || "/placeholder.svg?height=64&width=64"}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                  >
                    {product.name}
                  </a>
                  {product.source === "amazon" && product.isSponsored && (
                    <Badge variant="outline" className="ml-2">
                      Patrocinado
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {product.source === "amazon" ? (
                    product.brand || "-"
                  ) : (
                    <div>
                      <div>{product.brand || "-"}</div>
                      <div className="text-xs text-muted-foreground">{product.supplier}</div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
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
                <TableCell>
                  <div>
                    {renderStars(product.rating)}
                    {product.reviews && (
                      <span className="text-xs text-muted-foreground">
                        ({product.reviews.toLocaleString()} reseñas)
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {product.source === "amazon" ? (
                    <div className="space-y-1">
                      {product.asin && (
                        <div className="text-xs">
                          <span className="font-medium">ASIN:</span> {product.asin}
                        </div>
                      )}
                      {product.category && (
                        <div className="text-xs">
                          <span className="font-medium">Categoría:</span> {product.category}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {product.minOrder && (
                        <div className="text-xs">
                          <span className="font-medium">Pedido mín.:</span> {product.minOrder}
                        </div>
                      )}
                      {product.origin && (
                        <div className="text-xs">
                          <span className="font-medium">Origen:</span> {product.origin}
                        </div>
                      )}
                      <div className="flex gap-2">
                        {product.verified && (
                          <Badge variant="outline" className="text-xs">
                            Verificado
                          </Badge>
                        )}
                        {product.guaranteed && (
                          <Badge variant="outline" className="text-xs">
                            Garantizado
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={product.url} target="_blank" rel="noopener noreferrer">
                      Ver
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
