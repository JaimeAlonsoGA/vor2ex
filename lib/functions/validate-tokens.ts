"use server";

import { fetchAccessToken } from "@/services/amazon.service";
import {
  createAmazonCredentials,
  getCredentials,
  updateAmazonCredentials,
} from "@/services/credentials.service";

export async function validateAmazonTokens() {
  const { credentials, error } = await getCredentials();

  if (!credentials || !credentials.amz_access_token || error) {
    const token = (await fetchAccessToken()) as AmazonToken;
    await createAmazonCredentials({ token });
  } else if (new Date(credentials.amz_expires_at) < new Date()) {
    const token = await fetchAccessToken();
    await updateAmazonCredentials(token);
  }
}
