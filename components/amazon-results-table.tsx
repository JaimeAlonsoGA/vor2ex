import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AmazonResponse } from "@/lib/models/amazon/searchCatalogItems"
import { AmazonOfferResponse } from "@/lib/models/amazon/getItemOffers"

interface AmazonResultsTableProps {
  data: AmazonResponse
}


export function AmazonResultsTable({ data }: AmazonResultsTableProps) {
  function estimateMonthlySales(rank: number | undefined, category: string | undefined) {
    if (!rank) return "N/A";
    // Ejemplo genérico: cuanto menor el rank, más ventas
    if (rank < 1000) return Math.round(3000 / rank * 30); // top 1000: muchas ventas
    if (rank < 5000) return Math.round(1000 / rank * 30);
    if (rank < 20000) return Math.round(300 / rank * 30);
    return Math.round(100 / rank * 30);
  }

  if (!data) return null;

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <span className="text-sm font-medium">Total Results: </span>
            <Badge variant="outline">{data.numberOfResults || "0"}</Badge>
          </div>
          <div className="flex gap-2">
            {data.refinements?.categories?.slice(0, 2).map((category) => (
              <Badge key={category.classificationId} variant="secondary">
                {category.displayName}
              </Badge>
            ))}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>ASIN</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Fulfillment</TableHead>
                <TableHead>BuyBox</TableHead>
                <TableHead className="text-right">Rank</TableHead>
                <TableHead className="text-right">Est. Ventas/Mes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items?.map((item) => {
                const summary = item.summaries?.[0]
                const image = item.images?.[0]?.images?.[0]
                // --- OFERTAS: ACCESO CORRECTO A PAYLOAD ---
                const offersPayload = item.offers?.payload
                // Precio más bajo
                const lowest = offersPayload?.Summary?.LowestPrices?.[0]
                const lowestPrice = lowest?.ListingPrice?.Amount
                const lowestPriceCurrency = lowest?.ListingPrice?.CurrencyCode
                // BuyBox
                const buyBox = offersPayload?.Summary?.BuyBoxPrices?.[0]
                const buyBoxPrice = buyBox?.ListingPrice?.Amount
                const buyBoxCurrency = buyBox?.ListingPrice?.CurrencyCode
                // Vendedor principal (BuyBox winner)
                const buyBoxOffer = offersPayload?.Offers?.find((o: any) => o.IsBuyBoxWinner)
                const sellerId = buyBoxOffer?.SellerId || offersPayload?.Offers?.[0]?.SellerId
                // Fulfillment channel
                const fulfillment = buyBoxOffer?.IsFulfilledByAmazon
                  ? "FBA"
                  : (buyBoxOffer ? "FBM" : (lowest?.fulfillmentChannel || "Unknown"))
                // Ranking
                const salesRank =
                  item.salesRanks?.[0]?.classificationRanks?.[0] ||
                  item.salesRanks?.[0]?.displayGroupRanks?.[0]

                return (
                  <TableRow key={item.asin}>
                    <TableCell>
                      {image?.link ? (
                        <Image
                          src={image.link}
                          alt={summary?.itemName || "Product image"}
                          width={60}
                          height={60}
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-[60px] h-[60px] bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium truncate max-w-[200px]" title={summary?.itemName}>
                        {summary?.itemName || "Unknown Product"}
                      </div>
                      <div className="text-xs text-muted-foreground">Brand: {summary?.brand || "Unknown"}</div>
                    </TableCell>
                    <TableCell>{item.asin}</TableCell>
                    <TableCell>{item.productTypes?.[0]?.productType.replaceAll("_", " ") || "Unknown"}</TableCell>
                    <TableCell>
                      {lowestPrice ? (
                        <Badge variant="outline">{lowestPriceCurrency} {lowestPrice}</Badge>
                      ) : "N/A"}
                    </TableCell>
                    <TableCell>
                      {sellerId ? (
                        <span title={sellerId}>{sellerId.slice(0, 8)}...</span>
                      ) : "N/A"}
                    </TableCell>
                    <TableCell>
                      {fulfillment}
                    </TableCell>
                    <TableCell>
                      {buyBoxPrice ? (
                        <Badge variant="secondary">{buyBoxCurrency} {buyBoxPrice}</Badge>
                      ) : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {salesRank ? (
                        <div>
                          <Badge variant="outline">{salesRank.rank}</Badge>
                          <div className="text-xs text-muted-foreground mt-1">in {salesRank.title}</div>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {salesRank ? (
                        <span>
                          {estimateMonthlySales(salesRank.rank, salesRank.title)}
                        </span>
                      ) : "N/A"}
                    </TableCell>
                  </TableRow>
                )
              })}

              {(!data.items || data.items.length === 0) && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
