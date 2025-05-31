"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";
import { getUser } from "./auth.server";

export { getCredentials, createAmazonCredentials, updateAmazonCredentials };

async function getCredentials(): Promise<Tables<'credentials'>> {
  const supabase = await createClient();
  const user = await getUser();

  const { data, error } = await supabase
    .from("credentials")
    .select("*")
    .eq("user_id", user.id)
    .single();
  if (error) throw new Error("Error fetching credentials", error);

  return data ?? [];
}

async function createAmazonCredentials(token: AmazonToken) {
  const supabase = await createClient();
  const user = await getUser();

  const expiresAt = new Date(Date.now() + (token.expires_in || 0) * 1000);

  const { error } = await supabase.from("credentials").insert({
    user_id: user.id,
    amz_access_token: token.access_token,
    amz_refresh_token: token.refresh_token,
    amz_expires_at: expiresAt.toISOString(),
  });

  if (error) {
    return new Response("Error saving credentials", { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

async function updateAmazonCredentials(token: AmazonToken) {
  const supabase = await createClient();
  const user = await getUser();

  const expiresAt = new Date(Date.now() + (token.expires_in || 0) * 1000);

  const { error } = await supabase
    .from("credentials")
    .update({
      amz_access_token: token.access_token,
      amz_refresh_token: token.refresh_token,
      amz_expires_at: expiresAt.toISOString(),
    })
    .eq("user_id", user.id);

  if (error) {
    return new Response("Error saving credentials", { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function clearAmazonCredentials() {
  const supabase = await createClient();
  const user = await getUser();

  const { error } = await supabase
    .from("credentials")
    .update({
      amz_access_token: null,
      amz_refresh_token: null,
      amz_expires_at: null,
    })
    .eq("user_id", user.id);

  if (error) {
    return new Response("Error clearing Amazon credentials", { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
