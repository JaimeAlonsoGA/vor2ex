import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const token = await fetch("https://api.amazon.com/auth/o2/token", {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: process.env.AMAZON_REFRESH_TOKEN || "",
      client_id: process.env.AMAZON_CLIENT_ID || "",
      client_secret: process.env.AMAZON_CLIENT_SECRET || "",
    }),
  });

  const tokenData = await token.json();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }
  const now = new Date();
  const expiresAt = new Date(Date.now() + (tokenData.expires_in || 0) * 1000);

  const { error } = await supabase.from("credentials").insert({
    user_id: userId,
    amz_access_token: tokenData.access_token,
    amz_refresh_token: tokenData.refresh_token,
    amz_expires_in: expiresAt,
  });

  if (error) {
    //--debug console.error("Error saving credentials:", error);
    return new Response("Error saving credentials", { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
