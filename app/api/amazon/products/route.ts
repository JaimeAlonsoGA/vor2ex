import config from "@/orm.config";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keywords = searchParams.get("keywords");

  const marketplaceId = config.amazon.marketplaceId_spain;
  const endpoint = config.amazon.endpoint_eu;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;

  const { data: credentials } = await supabase
    .from("credentials")
    .select("amz_access_token")
    .eq("user_id", userId)
    .single();

  const response = await fetch(
    `${endpoint}/catalog/2022-04-01/items?marketplaceIds=${marketplaceId}&keywords=${keywords}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "x-amz-access-token": credentials?.amz_access_token,
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    console.error("Error fetching products:", data);
    return new Response(JSON.stringify({ error: data.message }), {
      status: 500,
    });
  }
  return new Response(JSON.stringify({ success: true, data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

//.flatMap((k) => k).join(",")
