"use server";

import { fetchAccessToken } from "@/services/amazon/sp-api/amazon.service";
import {
  createAmazonCredentials,
  getCredentials,
  updateAmazonCredentials,
} from "@/services/credentials.server";
import { cookies } from "next/headers";
import { amazonToConnection } from "../factories/amazon/amzon-connection";
import { getSettings } from "@/services/settings.server";

export async function validateAmazonTokens(): Promise<{ success: boolean }> {
  const credentials = await getCredentials();
  const cookieStore = await cookies();
  const rawConnection = cookieStore.get("amazon_connection")?.value;
  const now = new Date();
  const expiresAt = new Date(credentials?.amz_expires_at ?? 0);
  const timeLeft = expiresAt.getTime() - now.getTime();
  const fiveMinutes = 5 * 60 * 1000;

  let connection;
  if (rawConnection) {
    connection = JSON.parse(rawConnection);
  } else {
    const settings = await getSettings();
    connection = amazonToConnection(settings.amazon_marketplace);
  }

  if (!credentials) {
    //no credentials: create new token
    const token = (await fetchAccessToken(connection.domain)) as AmazonToken;
    await createAmazonCredentials(token).then((res) => {
      if (res.status !== 200) {
        console.error({ status: res.status, message: "Error creating Amazon credentials" });
        return { success: false };
      } else {
        console.log("Amazon credentials created");
        return { success: true };
      }
    });
  } else if (!credentials.amz_access_token) {
    //no access token: create new token
    const token = await fetchAccessToken(connection.domain);
    await updateAmazonCredentials(token).then((res) => {
      if (res.status !== 200) {
        console.error({ status: res.status, message: "Error creating Amazon credentials" });
        return { success: false };
      } else {
        console.log("Amazon credentials created");
        return { success: true };
      }
    });
  } else if (timeLeft < 0) {
    //outdated token: create new token
    const token = await fetchAccessToken(connection.domain);
    updateAmazonCredentials(token).then((res) => {
      if (res.status !== 200) {
        console.error({ status: res.status, message: "Error updating Amazon credentials" });
        return { success: false };
      } else {
        console.log("Amazon credentials outdated, created new token");
        return { success: true };
      }
    });
  } else if (timeLeft <= fiveMinutes) {
    if (credentials.amz_refresh_token) {
      //token is about to expire: refresh token
      const token = await fetchAccessToken(connection.domain, credentials.amz_refresh_token);
      await updateAmazonCredentials(token).then((res) => {
        if (res.status !== 200) {
          console.error({ status: res.status, message: "Error updating Amazon credentials" });
          return { success: false };
        } else {
          console.log("Amazon credentials updated");
          return { success: true };
        }
      });
    }
  }
  return { success: true };
}
