// Amazon Types
export interface AmazonResponse {
  numberOfResults: number
  pagination?: {
    nextToken?: string
    previousToken?: string
  }
  refinements?: {
    brands?: Array<{
      numberOfResults: number
      brandName: string
    }>
    categories?: Array<{
      numberOfResults: number
      displayName: string
      classificationId: string
    }>
  }
  items?: AmazonItem[]
}

export interface AmazonItem {
  asin: string
  identifiers?: Array<{
    marketplaceId: string
    identifiers: Array<{
      type: string
      identifier: string
    }>
  }>
  images?: Array<{
    marketplaceId: string
    images: Array<{
      variant: string
      link: string
      height: number
      width: number
    }>
  }>
  productTypes?: Array<{
    marketplaceId: string
    productType: string
  }>
  salesRanks?: Array<{
    marketplaceId: string
    ranks: Array<{
      title: string
      link: string
      rank: number
    }>
  }>
  summaries?: Array<{
    marketplaceId: string
    brandName?: string
    browseNode?: string
    colorName?: string
    itemName?: string
    manufacturer?: string
    modelNumber?: string
    sizeName?: string
    styleName?: string
  }>
  variations?: Array<{
    marketplaceId: string
    asins: string[]
    type: string
  }>
  vendorDetails?: Array<{
    marketplaceId: string
    brandCode: string
    categoryCode: string
    manufacturerCode: string
    manufacturerCodeParent: string
    productGroup: string
    replenishmentCategory: string
    subcategoryCode: string
  }>
}

// Alibaba Types
export interface AlibabaResponse {
  result: {
    total_item: string
    trace_id: string
    curr_page: string
    error_msg?: string
    error_code?: string
    page_size: string
    products: AlibabaProduct[]
  }
  code: string
  request_id: string
}

export interface AlibabaProduct {
  gmt_create: string
  keywords: string[]
  owner_member_display_name: string
  group_name: string
  subject: string
  main_image?: {
    watermark_position: string
    images: any[]
    watermark: string
    watermark_frame: string
  }
  display: string
  pc_detail_url?: string
  language: string
  gmt_modified: string
  specific: string
  rts: string
  product_type: string
  category_id: string
  group_id: string
  smart_edit: string
  owner_member: string
  id: string
  status: string
}
