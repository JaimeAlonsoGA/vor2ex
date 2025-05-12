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
