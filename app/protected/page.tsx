import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import config from "@/orm.config";
import { cookies } from "next/headers";
import SearchBar from "@/components/search-bar";
import ComparativeSearch from "@/components/comparative-search";

export default async function ProtectedPage() {
  const baseUrl = config.base_url;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data: credentials, error } = await supabase
    .from("credentials")
    .select("amz_access_token, amz_refresh_token, amz_expires_in")
    .eq("user_id", user.id)
    .single();

  if (!credentials || !credentials.amz_access_token || error) {
    const cookieHeader = (await cookies()).toString();
    await fetch(`${baseUrl}/api/amazon/tokens`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
      },
    });
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Amazon & Alibaba Product Comparison
        </h1>
        <ComparativeSearch />
      </div>
    </div>
  );
}
