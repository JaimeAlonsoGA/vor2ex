'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Star, Users, Truck, TrendingUp, ShoppingCart, Factory, Package, Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import { Product } from '@/lib/types/product';
import { formatCurrency, truncateText } from '@/lib/utils';
import { useEffect } from 'react';

interface ProductCardProps {
  product: Product;
  onExpand?: () => void;
  isExpanded?: boolean;
}

export default function ProductCard({ product, onExpand, isExpanded }: ProductCardProps) {
  const isAmazon = product.source === 'amazon';
  const isAlibaba = product.source === 'alibaba';

  // useEffect(() => {
  //   console.log('ProductCard mounted:', product);

  // }, [product]);

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex flex-col md:flex-row gap-4 p-4">
        <div className="flex-shrink-0 w-24 h-24 rounded bg-muted flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-xs text-muted-foreground">No image</span>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base truncate">{truncateText(product.name, 70)}</span>
            <Badge variant={isAmazon ? 'default' : 'secondary'}>
              {isAmazon ? 'Amazon' : 'Alibaba'}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
            {product.price !== undefined && (
              <Badge variant="outline">{formatCurrency(product.price, product.currency || 'USD')}</Badge>
            )}
            {product.brand && (
              <span className="inline-flex items-center text-xs">
                <ShoppingCart className="mr-1 h-3 w-3" />
                {isAmazon ? 'Brand: ' : 'Supplier: '}
                {product.brand}
              </span>
            )}
            {isAmazon && product.isPrime && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">Prime</Badge>
            )}
            {isAmazon && product.fulfillmentChannel && (
              <Badge variant="outline">{product.fulfillmentChannel}</Badge>
            )}
            {isAmazon && product.isBuyBoxWinner && (
              <Badge variant="default" className="bg-yellow-400 text-black">Buy Box</Badge>
            )}
            {isAmazon && product.bestSeller && (
              <Badge variant="default" className="bg-orange-500 text-white">Best Seller</Badge>
            )}
            {isAmazon && product.isAmazonsChoice && (
              <Badge variant="default" className="bg-blue-500 text-white">Amazon's Choice</Badge>
            )}
            {isAlibaba && product.minOrderQuantity && (
              <Badge variant="outline">MOQ: {product.minOrderQuantity}</Badge>
            )}
            {isAlibaba && product.ownerMember && (
              <span className="inline-flex items-center text-xs">
                <Factory className="mr-1 h-3 w-3" />
                {product.ownerMember}
              </span>
            )}
            {isAlibaba && product.status && (
              <Badge variant="outline">{product.status}</Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2 items-center text-xs mt-1">
            {product.rating !== undefined && (
              <span className="flex items-center">
                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                {product.rating.toFixed(1)}
              </span>
            )}
            {product.reviews !== undefined && (
              <span className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                {product.reviews}
              </span>
            )}
            {isAmazon && product.ranking !== undefined && (
              <span className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                #{product.ranking}
              </span>
            )}
            {isAmazon && product.salesVolume && (
              <span className="flex items-center">
                <Package className="h-3 w-3 mr-1" />
                {product.salesVolume} sold/mo
              </span>
            )}
            {isAlibaba && product.shippingTime && (
              <span className="flex items-center">
                <Truck className="h-3 w-3 mr-1" />
                {product.shippingTime}
              </span>
            )}
            {isAlibaba && product.packagingDesc && (
              <span className="flex items-center">
                <Package className="h-3 w-3 mr-1" />
                {product.packagingDesc}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => window.open(`https://www.amazon.es/${product.url}`, '_blank')}
          >
            View on {isAmazon ? 'Amazon' : 'Alibaba'}
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
          {onExpand && (
            <Button
              variant="ghost"
              size="icon"
              aria-label={isExpanded ? "Collapse details" : "Expand details"}
              onClick={onExpand}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          )}
        </div>
      </div>
      {isExpanded && (
        <>
          <Separator className="mb-4" />
          <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {/* Amazon details */}
            {isAmazon && (
              <>
                {product.asin && (
                  <div>
                    <span className="text-muted-foreground">ASIN: </span>
                    <span className="font-mono text-xs">{product.asin}</span>
                  </div>
                )}
                {product.offerCount !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Offers: </span>
                    <span>{product.offerCount}</span>
                  </div>
                )}
                {product.buyBoxPrice !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Buy Box: </span>
                    <span>{formatCurrency(product.buyBoxPrice, product.buyBoxCurrency || product.currency || 'USD')}</span>
                  </div>
                )}
                {product.sellerId && (
                  <div>
                    <span className="text-muted-foreground">Seller ID: </span>
                    <span className="font-mono text-xs">{product.sellerId}</span>
                  </div>
                )}
                {product.shipping && (
                  <div>
                    <span className="text-muted-foreground">Shipping: </span>
                    <span>{product.shipping}</span>
                  </div>
                )}
                {product.createdAt && (
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground mr-1">Listed: </span>
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </>
            )}
            {/* Alibaba details */}
            {isAlibaba && (
              <>
                {product.minOrderQuantity !== undefined && (
                  <div>
                    <span className="text-muted-foreground">MOQ: </span>
                    <span>{product.minOrderQuantity}</span>
                  </div>
                )}
                {product.ownerMember && (
                  <div>
                    <span className="text-muted-foreground">Supplier: </span>
                    <span>{product.ownerMember}</span>
                  </div>
                )}
                {product.paymentMethods && (
                  <div>
                    <span className="text-muted-foreground">Payment: </span>
                    <span>{product.paymentMethods.join(', ')}</span>
                  </div>
                )}
                {product.deliveryPort && (
                  <div>
                    <span className="text-muted-foreground">Port: </span>
                    <span>{product.deliveryPort}</span>
                  </div>
                )}
                {product.packagingDesc && (
                  <div>
                    <span className="text-muted-foreground">Packaging: </span>
                    <span>{product.packagingDesc}</span>
                  </div>
                )}
                {product.status && (
                  <div>
                    <span className="text-muted-foreground">Status: </span>
                    <span>{product.status}</span>
                  </div>
                )}
                {product.weight && (
                  <div>
                    <span className="text-muted-foreground">Weight: </span>
                    <span>{product.weight}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <span className="text-muted-foreground">Dimensions: </span>
                    <span>{product.dimensions}</span>
                  </div>
                )}
                {product.createdAt && (
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground mr-1">Listed: </span>
                    <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </Card>
  );
}