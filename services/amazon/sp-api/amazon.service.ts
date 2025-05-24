"use server";

import { cookies } from "next/headers";
import { getCredentials } from "../../credentials.service";
import config from "@/orm.config";
import { AmazonOfferResponse } from "@/types/amazon/sp-api/get-item-offers";
import { AmazonFeesEstimateResponse } from "@/types/amazon/sp-api/get-fee-estimates";

export {
  fetchAmazon,
  fetchAccessToken,
  searchCatalogItems,
  getCatalogItem,
  getItemOffers,
  getFeesEstimate,
};

async function fetchAmazon({
  method = "GET",
  query,
  body,
}: {
  method: string;
  query: string;
  body?: string;
}) {
  const endpoint = config.amazon.endpoint_eu;
  const credentials = await getCredentials();

  if (!credentials?.amz_access_token) {
    throw new Error("Amazon access token is not available");
  }

  const response = await fetch(`${endpoint}/${query}`, {
    method,
    headers: {
      Accept: "application/json",
      "x-amz-access-token": credentials.amz_access_token,
    },
    body,
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(
      `Error fetching products: ${response.status} ${response.statusText}. Details: ${errorDetails}`
    );
  }
  return response.json();
}

async function fetchAccessToken(token?: string) {
  const cookieHeader = (await cookies()).toString();
  return await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      cookie: cookieHeader,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token ?? (process.env.AMAZON_REFRESH_TOKEN || ""),
      client_id: process.env.AMAZON_CLIENT_ID || "",
      client_secret: process.env.AMAZON_CLIENT_SECRET || "",
    })
  }).then((response) => {
    if (!response.ok) throw new Error("Error fetching access token");
    return response.json();
  });
}

async function searchCatalogItems(keywords: string) {
  const marketplaceId = config.amazon.marketplaceId_spain;
  const query = `/catalog/2022-04-01/items?marketplaceIds=${marketplaceId}&keywords=${keywords}&includedData=salesRanks,productTypes,identifiers,summaries,images&pageSize=20`;
  return await fetchAmazon({ method: "GET", query });
}

async function getCatalogItem(asin: string) {
  const marketplaceId = config.amazon.marketplaceId_spain;
  const query = `/catalog/2022-04-01/items/${asin}?marketplaceIds=${marketplaceId}&includedData=salesRanks,productTypes,identifiers,summaries,images`;
  return await fetchAmazon({ method: "GET", query });
}

export async function fetchNextAmazonCatalogPage(pageToken: string, keywords: string) {
  const marketplaceId = config.amazon.marketplaceId_spain;
  const query = `/catalog/2022-04-01/items?marketplaceIds=${marketplaceId}&keywords=${encodeURIComponent(keywords)}&pageToken=${encodeURIComponent(pageToken)}&includedData=salesRanks,productTypes,identifiers,summaries,images`;
  return await fetchAmazon({ method: "GET", query });
}

export async function fetchPreviousAmazonCatalogPage(pageToken: string, keywords: string) {
  const marketplaceId = config.amazon.marketplaceId_spain;
  const query = `/catalog/2022-04-01/items?marketplaceIds=${marketplaceId}&keywords=${encodeURIComponent(keywords)}&pageToken=${encodeURIComponent(pageToken)}&includedData=salesRanks,productTypes,identifiers,summaries,images`;
  return await fetchAmazon({ method: "GET", query });
}

async function getItemOffers(asin: string): Promise<AmazonOfferResponse> {
  const marketplaceId = config.amazon.marketplaceId_spain;
  const query = `products/pricing/v0/items/${asin}/offers?MarketplaceId=${marketplaceId}&ItemCondition=New`;
  return await fetchAmazon({ method: "GET", query });
}

async function getFeesEstimate(
  asin: string,
  price: number
): Promise<AmazonFeesEstimateResponse> {
  const marketplaceId = config.amazon.marketplaceId_spain;
  const payload = {
    FeesEstimateRequest: {
      MarketplaceId: marketplaceId,
      IdType: "ASIN",
      IdValue: asin,
      Identifier: asin,
      IsAmazonFulfilled: true,
      PriceToEstimateFees: {
        ListingPrice: {
          CurrencyCode: "EUR",
          Amount: price,
        },
        Shipping: {
          CurrencyCode: "EUR",
          Amount: 0,
        },
      },
    },
  };
  const query = `/products/fees/v0/listings/fees`;
  return await fetchAmazon({
    method: "POST",
    query,
    body: JSON.stringify(payload),
  });
}
