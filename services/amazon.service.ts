"use server";

import { cookies } from "next/headers";
import { getCredentials } from "./credentials.service";
import config from "@/orm.config";

export { fetchAmazon, fetchAccessToken, searchCatalogItems };

async function fetchAmazon({
  method = "GET",
  query,
}: {
  method: string;
  query: string;
}) {
  const endpoint = config.amazon.endpoint_eu;
  const { credentials } = await getCredentials();

  return fetch(`${endpoint}/${query}`, {
    method,
    headers: {
      Accept: "application/json",
      "x-amz-access-token": credentials?.amz_access_token,
    },
  }).then((response) => {
    if (!response.ok) throw new Error("Error fetching products");
    return response.json();
  });
}

async function fetchAccessToken() {
  const cookieHeader = (await cookies()).toString();
  return await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: cookieHeader,
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: process.env.AMAZON_REFRESH_TOKEN || "",
      client_id: process.env.AMAZON_CLIENT_ID || "",
      client_secret: process.env.AMAZON_CLIENT_SECRET || "",
    }),
  }).then((response) => {
    if (!response.ok) throw new Error("Error fetching access token");
    return response.json();
  });
}

async function searchCatalogItems(keywords: string) {
  const marketplaceId = config.amazon.marketplaceId_spain;

  const query = `/catalog/2022-04-01/items?marketplaceIds=${marketplaceId}&keywords=${keywords}&includedData=salesRanks,productTypes,identifiers,summaries,images`;

  return await fetchAmazon({ method: "GET", query });
}
