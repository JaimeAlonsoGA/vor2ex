import ProductComparison from "@/components/product-comparison";
import LoadingState from "@/components/ui/loading-state";
import { validateAmazonTokens } from "@/lib/functions/validate-tokens";
import { getUserId } from "@/services/auth.service";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ProtectedPage() {
  const userId = getUserId();
  if (!userId) {
    redirect("/sign-in");
  } else await validateAmazonTokens();

  return (
    <div className="flex-1 flex flex-col gap-12 w-full">
      <Suspense fallback={<LoadingState />}>
        <ProductComparison />
      </Suspense>
    </div>
  );
}
