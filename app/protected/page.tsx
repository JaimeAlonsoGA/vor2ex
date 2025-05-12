import ComparativeSearch from "@/components/comparative-search";
import { validateAmazonTokens } from "@/lib/functions/validate-tokens";
import { getUserId } from "@/services/auth.service";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const userId = getUserId();
  if (!userId) {
    redirect("/sign-in");
  }
  await validateAmazonTokens();

  return (
    <div className="flex-1 flex flex-col gap-12 w-full">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Amazon & Alibaba Product Comparison
      </h1>
      <ComparativeSearch />
    </div>
  );
}
