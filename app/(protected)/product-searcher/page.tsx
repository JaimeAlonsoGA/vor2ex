import ProductComparison from "@/components/dashboard/product-comparison/product-comparison";
import LoadingState from "@/components/ui/loading-state";
import { validateAmazonTokens } from "@/lib/functions/amazon/validate-tokens";
import { getUserAnalyticsKeyword } from "@/services/users-analytics.service";
import { Suspense } from "react";

export default async function ProtectedPage() {
  await validateAmazonTokens();
  const userAnalytics = await getUserAnalyticsKeyword();

  return (
    <div className="flex flex-col gap-12 mx-auto">
      <Suspense fallback={<LoadingState />}>
        <ProductComparison userAnalytics={userAnalytics} />
      </Suspense>
    </div>
  );
}
