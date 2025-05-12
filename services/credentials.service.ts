"use server"
import { createClient } from "@/utils/supabase/server";
import { getUserId } from "./auth.service";

export { getCredentials, createAmazonCredentials, updateAmazonCredentials };

async function getCredentials() {
  const supabase = await createClient();
  const userId = await getUserId();

  const { data: credentials, error } = await supabase
    .from("credentials")
    .select("amz_access_token, amz_refresh_token, amz_expires_at")
    .eq("user_id", userId)
    .single();
  return { credentials, error };
}

async function createAmazonCredentials({ token }: { token: AmazonToken }) {
  const supabase = await createClient();
  const user_id = getUserId();

  const expiresAt = new Date(Date.now() + (token.expires_in || 0) * 1000);

  const { error } = await supabase.from("credentials").insert({
    user_id,
    amz_access_token: token.access_token,
    amz_refresh_token: token.refresh_token,
    amz_expires_at: expiresAt,
  });

  if (error) {
    return new Response("Error saving credentials", { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

async function updateAmazonCredentials({
  token,
}: {
  token: { expires_in: number; access_token: string; refresh_token: string };
}) {
  const supabase = await createClient();
  const userId = await getUserId();

  const expiresAt = new Date(Date.now() + (token.expires_in || 0) * 1000);

  const { error } = await supabase
    .from("credentials")
    .update({
      amz_access_token: token.access_token,
      amz_refresh_token: token.refresh_token,
      amz_expires_at: expiresAt,
    })
    .eq("user_id", userId);

  if (error) {
    return new Response("Error saving credentials", { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
