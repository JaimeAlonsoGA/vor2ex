"use server";

import { amazonToConnection } from "@/lib/factories/amazon/amzon-connection";
import { fetchAccessToken } from "@/services/amazon/sp-api/amazon.service";
import {
  createAmazonCredentials,
  getCredentials,
  updateAmazonCredentials,
} from "@/services/credentials.server";
import { getSettings } from "@/services/settings.server";

export async function validateAmazonTokens(): Promise<{ success: boolean }> {
  const credentials = await getCredentials();
  const settings = await getSettings();
  const connection = amazonToConnection(settings?.amazon_marketplace);
  const now = new Date();
  const expiresAt = new Date(credentials?.amz_expires_at ?? 0);
  const timeLeft = expiresAt.getTime() - now.getTime();
  const fiveMinutes = 5 * 60 * 1000;

  if (!credentials || !credentials.amz_access_token) {
    //no credentials or expired: create new token
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
  } else if (timeLeft < 0) {
    //outdated token: create new token
    const token = await fetchAccessToken(settings.amazon_marketplace);
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
      const token = await fetchAccessToken(settings.amazon_marketplace, credentials.amz_refresh_token);
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
