import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AmazonResponse } from "@/lib/models/amazon/searchCatalogItems"

interface AmazonResultsTableProps {
  data: AmazonResponse
}

export function AmazonResultsTable({ data }: AmazonResultsTableProps) {
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
                <TableHead className="text-right">Rank</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items?.map((item) => {
                const summary = item.summaries?.[0]
                const image = item.images?.[0]?.images?.[0]
                const salesRank = item.salesRanks?.[0]?.classificationRanks?.[0] || item.salesRanks?.[0]?.displayGroupRanks?.[0]

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
                    <TableCell>{item.productTypes?.[0]?.productType || "Unknown"}</TableCell>
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
                  </TableRow>
                )
              })}

              {(!data.items || data.items.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
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
