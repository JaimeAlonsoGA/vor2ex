import { Star, StarHalf, Check, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Product } from "@/types/product"

export default function ProductCards({ products }: { products: Product[] }) {
    const marketplace = products[0]?.source
    // Función para renderizar estrellas
    const renderStars = (rating?: number) => {
        if (!rating) rating = 0

        const fullStars = Math.floor(rating)
        const hasHalfStar = rating % 1 >= 0.5

        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => {
                    if (i < fullStars) {
                        return <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    }
                    if (i === fullStars && hasHalfStar) {
                        return <StarHalf key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    }
                    return <Star key={i} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
                })}
                {rating !== undefined && (
                    <span className="ml-1 text-sm text-muted-foreground">{rating.toFixed(1)}</span>
                )}
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-8 border rounded-lg">
                No se encontraron productos que coincidan con los criterios de búsqueda.
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
                <div
                    key={product.id}
                    className={`border rounded-lg overflow-hidden flex flex-col h-[400px] ${marketplace === "amazon" ? "bg-white dark:bg-gray-900" : "bg-white dark:bg-gray-900"
                        }`}
                >
                    {/* Cabecera de la tarjeta */}
                    <div
                        className={`p-3 border-b ${marketplace === "amazon" ? "bg-[#232F3E] text-white" : "bg-[#FF6A00] text-white"
                            }`}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-sm">{marketplace === "amazon" ? "Amazon" : "Alibaba"}</span>
                            {marketplace === "alibaba" && (
                                <div className="flex gap-1">
                                    {product.verified && (
                                        <Badge variant="secondary" className="text-xs bg-white/20 hover:bg-white/30">
                                            <Check className="h-3 w-3 mr-1" /> Verificado
                                        </Badge>
                                    )}
                                    {product.guaranteed && (
                                        <Badge variant="secondary" className="text-xs bg-white/20 hover:bg-white/30">
                                            <Shield className="h-3 w-3 mr-1" /> Garantizado
                                        </Badge>
                                    )}
                                </div>
                            )}
                            {marketplace === "amazon" && product.isSponsored && (
                                <Badge variant="secondary" className="text-xs bg-white/20 hover:bg-white/30">
                                    Patrocinado
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Contenido de la tarjeta */}
                    <div className="p-4 grow flex flex-col">
                        <div className="flex mb-4">
                            <div className="w-24 h-24 relative mr-4 shrink-0">
                                <Image
                                    src={product.imageUrl || "/placeholder.svg?height=96&width=96"}
                                    alt={product.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="font-medium line-clamp-2 mb-1">
                                    <a href={product.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {product.name}
                                    </a>
                                </h3>
                                <div className="text-sm mb-1">
                                    {marketplace === "amazon" ? (
                                        <span>{product.brand || "-"}</span>
                                    ) : (
                                        <div>
                                            <div>{product.brand || ""}</div>
                                            <div className="text-xs text-muted-foreground">{product.supplier}</div>
                                        </div>
                                    )}
                                </div>
                                <div className="mb-1">
                                    {renderStars(product.rating)}
                                    <span className="text-xs text-muted-foreground">({product.reviews?.toLocaleString() ?? "0"} reseñas)</span>
                                </div>
                                {product.price ? (
                                    <div className="font-bold text-lg">
                                        {product.price.toLocaleString("es-ES", {
                                            style: "currency",
                                            currency: "USD",
                                        })}
                                    </div>
                                ) : (
                                    <div>Precio no disponible</div>
                                )}
                            </div>
                        </div>

                        {/* Detalles específicos del marketplace */}
                        <div className="mt-auto pt-3 border-t">
                            {marketplace === "amazon" ? (
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    {product.asin && (
                                        <div>
                                            <span className="font-medium">ASIN:</span> {product.asin}
                                        </div>
                                    )}
                                    {product.category && (
                                        <div>
                                            <span className="font-medium">Categoría:</span> {product.category}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    {product.minOrder && (
                                        <div>
                                            <span className="font-medium">MOQ:</span> {product.minOrder}
                                        </div>
                                    )}
                                    {product.origin && (
                                        <div>
                                            <span className="font-medium">Origen:</span> {product.origin}
                                        </div>
                                    )}
                                    {product.years && (
                                        <div>
                                            <span className="font-medium">Años:</span> {product.years}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Botón de acción */}
                        <div className="mt-3">
                            <Button
                                className={`w-full ${marketplace === "amazon"
                                    ? "bg-[#FF9900] hover:bg-[#E88B00] text-black"
                                    : "bg-[#FF6A00] hover:bg-[#E05C00]"
                                    }`}
                                asChild
                            >
                                <a href={product.url} target="_blank" rel="noopener noreferrer">
                                    Ver en {marketplace === "amazon" ? "Amazon" : "Alibaba"}
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
