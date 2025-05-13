"use server";

import { fetchAccessToken } from "@/services/amazon.service";
import {
  createAmazonCredentials,
  getCredentials,
  updateAmazonCredentials,
} from "@/services/credentials.service";

export async function validateAmazonTokens() {
  const { credentials, error } = await getCredentials();
  const now = new Date();
  const expiresAt = new Date(credentials?.amz_expires_at);
  const timeLeft = expiresAt.getTime() - now.getTime();
  const fiveMinutes = 5 * 60 * 1000;

  if (!credentials || !credentials.amz_access_token || error) {
    //no credentials: create new token
    const token = (await fetchAccessToken()) as AmazonToken;
    await createAmazonCredentials(token).then((res) => {
      if (res.status !== 200) {
        console.error("Error creating Amazon credentials");
      } else console.log("Amazon credentials created");
    });
  } else if (timeLeft < 0) {
    //outdated token: create new token
    const token = await fetchAccessToken();
    updateAmazonCredentials(token).then((res) => {
      if (res.status !== 200) {
        console.error("Error updating Amazon credentials");
      } else console.log("Amazon credentials outdated, created new token");
    });
  } else if (timeLeft <= fiveMinutes) {
    //token is about to expire: refresh token
    const token = await fetchAccessToken(credentials.amz_refresh_token);
    await updateAmazonCredentials(token).then((res) => {
      if (res.status !== 200) {
        console.error("Error updating Amazon credentials");
      } else console.log("Amazon credentials updated");
    });
  }
}
