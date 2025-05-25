"use server";
import { createClient } from "@/utils/supabase/server";
import { getAuthUser } from "./auth.server";
import { Tables } from "@/types/supabase";

export { getCredentials, createAmazonCredentials, updateAmazonCredentials };

async function getCredentials(): Promise<Tables<'credentials'> | null> {
  const supabase = await createClient();
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("credentials")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data;
}

async function createAmazonCredentials(token: AmazonToken) {
  const supabase = await createClient();
  const user = await getAuthUser();

  const expiresAt = new Date(Date.now() + (token.expires_in || 0) * 1000);

  const { error } = await supabase.from("credentials").insert({
    user_id: user?.id,
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
  const user = await getAuthUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const expiresAt = new Date(Date.now() + (token.expires_in || 0) * 1000);

  const { error } = await supabase
    .from("credentials")
    .update({
      amz_access_token: token.access_token,
      amz_refresh_token: token.refresh_token,
      amz_expires_at: expiresAt.toISOString(),
    })
    .eq("user_id", user?.id);

  if (error) {
    return new Response("Error saving credentials", { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
