'use client';

import Image from 'next/image';
import { ExternalLink, ChevronDown, ChevronUp, ShoppingCart, TrendingUp, Calendar, Truck, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, truncateText } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/types/product';
import { useEffect } from 'react';

interface ProductCardProps {
  product: Product;
  marketplace: 'amazon' | 'alibaba';
  isExpanded: boolean;
  onToggleExpand: () => void;
  visibleColumns: Record<string, boolean>;
}


export default function ProductCard({
  product,
  marketplace,
  isExpanded,
  onToggleExpand,
  visibleColumns
}: ProductCardProps) {

  const badges = [
    visibleColumns.price && (
      <Badge key="price" variant={marketplace === 'amazon' ? 'default' : 'secondary'} className="font-medium">
        {formatCurrency(product.price, product.currency || 'USD')}
      </Badge>
    ),
    visibleColumns.brand && (
      <span key="brand" className="inline-flex items-center text-xs">
        <ShoppingCart className="mr-1 h-3 w-3" />
        {marketplace === 'amazon' ? 'By ' : 'Seller: '}
        {product.brand || '-'}
      </span>
    ),
    visibleColumns.category && (
      <Badge key="category" variant="outline" className="text-xs font-normal">
        {product.category || '-'}
      </Badge>
    ),
    // Amazon: Prime badge
    marketplace === 'amazon' && (
      <Badge key="prime" variant="outline" className="text-xs font-normal text-blue-600 border-blue-600">
        {product.primeEligible ? 'Prime' : 'No Prime'}
      </Badge>
    ),
    // Amazon: FBA/FBM
    marketplace === 'amazon' && (
      <Badge key="fulfillment" variant="outline" className="text-xs font-normal">
        {product.fulfillmentChannel || '-'}
      </Badge>
    ),
    // Amazon: Buy Box Winner
    marketplace === 'amazon' && (
      <Badge key="buybox" variant="default" className={`text-xs font-normal ${product.isBuyBoxWinner ? 'bg-yellow-400 text-black' : ''}`}>
        {product.isBuyBoxWinner ? 'Buy Box Winner' : 'No Buy Box'}
      </Badge>
    ),
  ];

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-md",
      isExpanded ? "shadow-md" : "shadow-sm"
    )}>
      <div className="p-4 cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-start gap-3">
          {visibleColumns.image && (
            <div className="flex-shrink-0 w-20 h-20 rounded-md overflow-hidden bg-muted">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                  No image
                </div>
              )}
            </div>
          )}

          <div className="flex-1 min-w-0">
            {visibleColumns.name && (
              <h3 className="text-base font-medium leading-tight mb-1">
                {truncateText(product.name, 70)}
              </h3>
            )}

            <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
              {visibleColumns.price && (
                <Badge variant={marketplace === 'amazon' ? 'default' : 'secondary'} className="font-medium">
                  {formatCurrency(product.price, product.currency || 'USD')}
                </Badge>
              )}

              {visibleColumns.brand && product.brand && (
                <span className="inline-flex items-center text-xs">
                  <ShoppingCart className="mr-1 h-3 w-3" />
                  {marketplace === 'amazon' ? 'By ' : 'Seller: '}
                  {product.brand}
                </span>
              )}

              {visibleColumns.category && product.category && (
                <Badge variant="outline" className="text-xs font-normal">
                  {product.category}
                </Badge>
              )}

              {/* Amazon: Prime badge */}
              {marketplace === 'amazon' && product.primeEligible && (
                <Badge variant="outline" className="text-xs font-normal text-blue-600 border-blue-600">
                  Prime
                </Badge>
              )}

              {/* Amazon: FBA/FBM */}
              {marketplace === 'amazon' && product.fulfillmentChannel && (
                <Badge variant="outline" className="text-xs font-normal">
                  {product.fulfillmentChannel}
                </Badge>
              )}

              {/* Amazon: Buy Box Winner */}
              {marketplace === 'amazon' && product.isBuyBoxWinner && (
                <Badge variant="default" className="text-xs font-normal bg-yellow-400 text-black">
                  Buy Box Winner
                </Badge>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 ml-2"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0">
          <Separator className="mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {visibleColumns.id && (
              <div>
                <span className="text-muted-foreground">ID: </span>
                <span className="font-mono text-xs">{product.id}</span>
              </div>
            )}

            {visibleColumns.ranking && marketplace === 'amazon' && product.ranking && (
              <div className="flex items-center">
                <TrendingUp className="mr-1 h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Rank: </span>
                <span>#{product.ranking}</span>
              </div>
            )}

            {visibleColumns.sales && marketplace === 'amazon' && product.estimatedSales && (
              <div>
                <span className="text-muted-foreground">Est. Sales: </span>
                <span>{product.estimatedSales}/month</span>
              </div>
            )}

            {/* Amazon: Buy Box Price */}
            {marketplace === 'amazon' && product.buyBoxPrice && (
              <div>
                <span className="text-muted-foreground">Buy Box: </span>
                <span>
                  {formatCurrency(product.buyBoxPrice, product.buyBoxCurrency || product.currency || 'USD')}
                </span>
              </div>
            )}

            {/* Amazon: Offer Count */}
            {marketplace === 'amazon' && product.offerCount !== undefined && (
              <div>
                <span className="text-muted-foreground">Offers: </span>
                <span>{product.offerCount}</span>
              </div>
            )}

            {/* Amazon: Seller ID */}
            {marketplace === 'amazon' && product.sellerId && (
              <div>
                <span className="text-muted-foreground">Seller ID: </span>
                <span className="font-mono text-xs">{product.sellerId}</span>
              </div>
            )}

            {/* Amazon: Rating & Reviews */}
            {marketplace === 'amazon' && (product.rating || product.reviews) && (
              <div className="flex items-center">
                {product.rating && (
                  <>
                    <Star className="mr-1 h-3 w-3 text-yellow-400" />
                    <span className="mr-1">{product.rating.toFixed(1)}</span>
                  </>
                )}
                {product.reviews && (
                  <>
                    <Users className="mr-1 h-3 w-3 text-muted-foreground" />
                    <span>{product.reviews} reviews</span>
                  </>
                )}
              </div>
            )}

            {visibleColumns.created && product.createdAt && (
              <div className="flex items-center">
                <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Listed: </span>
                <span>{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
            )}

            {visibleColumns.shipping && product.shipping && (
              <div className="flex items-center">
                <Truck className="mr-1 h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">Shipping: </span>
                <span>{product.shipping}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => window.open(product.url, '_blank')}
            >
              View on {marketplace === 'amazon' ? 'Amazon' : 'Alibaba'}
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}