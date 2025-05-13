export interface AmazonOfferResponse {
  MarketplaceID: string;
  ASIN: string;
  SKU: string;
  ItemCondition: string;
  status: string;
  Identifier: {
    MarketplaceId: string;
    ASIN: string;
    SellerSKU: string;
    ItemCondition: string;
  };
  Summary: {
    TotalOfferCount: number;
    NumberOfOffers: Array<{
      condition: string;
      fulfillmentChannel: string;
      OfferCount: number;
    }>;
    LowestPrices: Array<{
      condition: string;
      fulfillmentChannel: string;
      offerType: string;
      quantityTier: number;
      quantityDiscountType: string;
      LandedPrice: {
        CurrencyCode: string;
        Amount: number;
      };
      ListingPrice: {
        CurrencyCode: string;
        Amount: number;
      };
      Shipping: {
        CurrencyCode: string;
        Amount: number;
      };
      Points: {
        PointsNumber: number;
        PointsMonetaryValue: {
          CurrencyCode: string;
          Amount: number;
        };
      };
    }>;
    BuyBoxPrices: Array<{
      condition: string;
      offerType: string;
      quantityTier: number;
      quantityDiscountType: string;
      LandedPrice: {
        CurrencyCode: string;
        Amount: number;
      };
      ListingPrice: {
        CurrencyCode: string;
        Amount: number;
      };
      Shipping: {
        CurrencyCode: string;
        Amount: number;
      };
      Points: {
        PointsNumber: number;
        PointsMonetaryValue: {
          CurrencyCode: string;
          Amount: number;
        };
      };
      sellerId: string;
    }>;
    ListPrice: {
      CurrencyCode: string;
      Amount: number;
    };
    CompetitivePriceThreshold: {
      CurrencyCode: string;
      Amount: number;
    };
    SuggestedLowerPricePlusShipping: {
      CurrencyCode: string;
      Amount: number;
    };
    SalesRankings: Array<{
      ProductCategoryId: string;
      Rank: number;
    }>;
    BuyBoxEligibleOffers: Array<{
      condition: string;
      fulfillmentChannel: string;
      OfferCount: number;
    }>;
    OffersAvailableTime: string;
  };
  Offers: Array<{
    MyOffer: boolean;
    offerType: string;
    SubCondition: string;
    SellerId: string;
    ConditionNotes: string;
    SellerFeedbackRating: {
      SellerPositiveFeedbackRating: number;
      FeedbackCount: number;
    };
    ShippingTime: {
      minimumHours: number;
      maximumHours: number;
      availableDate: string;
      availabilityType: string;
    };
    ListingPrice: {
      CurrencyCode: string;
      Amount: number;
    };
    quantityDiscountPrices: Array<{
      quantityTier: number;
      quantityDiscountType: string;
      listingPrice: {
        CurrencyCode: string;
        Amount: number;
      };
    }>;
    Points: {
      PointsNumber: number;
      PointsMonetaryValue: {
        CurrencyCode: string;
        Amount: number;
      };
    };
    Shipping: {
      CurrencyCode: string;
      Amount: number;
    };
    ShipsFrom: {
      State: string;
      Country: string;
    };
    IsFulfilledByAmazon: boolean;
    PrimeInformation: {
      IsPrime: boolean;
      IsNationalPrime: boolean;
    };
    IsBuyBoxWinner: boolean;
    IsFeaturedMerchant: boolean;
  }>;
}

export interface AmazonOfferError {
  code: string;
  message: string;
  details: string;
}
