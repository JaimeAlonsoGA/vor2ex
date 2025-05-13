import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlibabaResponse } from "@/lib/models/alibaba/alibaba-response"

interface AlibabaResultsTableProps {
  data: AlibabaResponse
}

export function AlibabaResultsTable({ data }: AlibabaResultsTableProps) {
  const products = data.result?.products || []

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <span className="text-sm font-medium">Total Results: </span>
            <Badge variant="outline">{data.result?.total_item || "0"}</Badge>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Page {data.result?.curr_page || "1"}</span>
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="font-medium truncate max-w-[200px]" title={product.subject}>
                      {product.subject || "Unknown Product"}
                    </div>
                    <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">{product.owner_member_display_name || "Unknown"}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category_id ? `ID: ${product.category_id}` : "N/A"}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-sm">
                      {product.gmt_create ? new Date(product.gmt_create).toLocaleDateString() : "N/A"}
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {products.length === 0 && (
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
