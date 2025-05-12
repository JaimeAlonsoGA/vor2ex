import { AlibabaResponse } from "@/lib/models/products/alibaba-response";
import { AmazonResponse } from "@/lib/models/products/amazon-response";

// Mock data based on the provided examples
const amazonMockData: AmazonResponse = {
  numberOfResults: 3097,
  pagination: {
    nextToken: "xsdflkj324lkjsdlkj3423klkjsdfkljlk2j34klj2l3k4jlksdjl234",
    previousToken:
      "ilkjsdflkj234lkjds234234lkjl234lksjdflkj234234lkjsfsdflkj333d",
  },
  refinements: {
    brands: [
      {
        numberOfResults: 1,
        brandName: "Truly Teague",
      },
      {
        numberOfResults: 20,
        brandName: "Always Awesome Apparel",
      },
    ],
    categories: [
      {
        numberOfResults: 300,
        displayName: "Electronics",
        classificationId: "493964",
      },
      {
        numberOfResults: 4000,
        displayName: "Tools & Home Improvement",
        classificationId: "468240",
      },
    ],
  },
  items: [
    {
      asin: "B07N4M94X4",
      identifiers: [
        {
          marketplaceId: "ATVPDKIKX0DER",
          identifiers: [
            {
              type: "ean",
              identifier: "0887276302195",
            },
            {
              type: "upc",
              identifier: "887276302195",
            },
          ],
        },
      ],
      images: [
        {
          marketplaceId: "ATVPDKIKX0DER",
          images: [
            {
              variant: "MAIN",
              link: "",
              height: 333,
              width: 500,
            },
          ],
        },
      ],
      productTypes: [
        {
          marketplaceId: "ATVPDKIKX0DER",
          productType: "TELEVISION",
        },
      ],
      salesRanks: [
        {
          marketplaceId: "ATVPDKIKX0DER",
          ranks: [
            {
              title: "OLED TVs",
              link: "http://www.amazon.com/gp/bestsellers/electronics/6463520011",
              rank: 3,
            },
            {
              title: "Electronics",
              link: "http://www.amazon.com/gp/bestsellers/electronics",
              rank: 1544,
            },
          ],
        },
      ],
      summaries: [
        {
          marketplaceId: "ATVPDKIKX0DER",
          brandName: "Samsung Electronics",
          browseNode: "6463520011",
          colorName: "Black",
          itemName:
            "Samsung QN82Q60RAFXZA Flat 82-Inch QLED 4K Q60 Series (2019) Ultra HD Smart TV with HDR and Alexa Compatibility",
          manufacturer: "Samsung",
          modelNumber: "QN82Q60RAFXZA",
          sizeName: "82-Inch",
          styleName: "TV only",
        },
      ],
      variations: [
        {
          marketplaceId: "ATVPDKIKX0DER",
          asins: ["B08J7TQ9FL"],
          type: "PARENT",
        },
      ],
      vendorDetails: [
        {
          marketplaceId: "ATVPDKIKX0DER",
          brandCode: "SAMF9",
          categoryCode: "50400100",
          manufacturerCode: "SAMF9",
          manufacturerCodeParent: "SAMF9",
          productGroup: "Home Entertainment",
          replenishmentCategory: "NEW_PRODUCT",
          subcategoryCode: "50400150",
        },
      ],
    },
  ],
};

const alibabaMockData: AlibabaResponse = {
  result: {
    total_item: "200",
    trace_id: "rfksafnakjff98",
    curr_page: "1",
    error_msg: "please try again later",
    error_code: "system error",
    page_size: "20",
    products: [
      {
        gmt_create: "2020-12-22 12:00:00",
        keywords: [],
        owner_member_display_name: "james",
        group_name: "new",
        subject: "new mp3 player",
        main_image: {
          watermark_position: "center",
          images: [],
          watermark: "true",
          watermark_frame: "Y",
        },
        display: "Y",
        pc_detail_url:
          "https://www.alibaba.com/product-detail/Eco-Friendly-100-Biodegradable-Cornstarch-Trash_60832548452.html?spm=a2700.galleryofferlist.normalList.12.6c612db4ueHAW2&fullFirstScreen=true",
        language: "english",
        gmt_modified: "2020-12-22 12:00:00",
        specific: "true",
        rts: "rts",
        product_type: "sourcing",
        category_id: "333",
        group_id: "2344",
        smart_edit: "true",
        owner_member: "24666790",
        id: "188909844009",
        status: "approved",
      },
    ],
  },
  code: "0",
  request_id: "0ba2887315178178017221014",
};

// In a real application, these functions would make actual API calls
export async function searchAmazon(keyword: string): Promise<AmazonResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // In a real implementation, this would call the Amazon API with the keyword
  // For now, we'll just return the mock data
  return {
    ...amazonMockData,
    // Modify the item name to include the search keyword for demonstration
    items: amazonMockData.items?.map((item) => ({
      ...item,
      summaries: item.summaries?.map((summary) => ({
        ...summary,
        itemName: summary.itemName?.includes(keyword)
          ? summary.itemName
          : `${summary.itemName} (${keyword})`,
      })),
    })),
  };
}

export async function searchAlibaba(keyword: string): Promise<AlibabaResponse> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // In a real implementation, this would call the Alibaba API with the keyword
  // For now, we'll just return the mock data
  return {
    ...alibabaMockData,
    // Add the keyword to the product subject for demonstration
    result: {
      ...alibabaMockData.result,
      products: alibabaMockData.result.products.map((product) => ({
        ...product,
        subject: product.subject?.includes(keyword)
          ? product.subject
          : `${product.subject} (${keyword})`,
      })),
    },
  };
}
