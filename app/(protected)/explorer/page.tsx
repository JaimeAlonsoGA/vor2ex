import ProductSearcherDashboard from "@/components/dashboard/explorer/dashboard";
import { validateAmazonTokens } from "@/lib/functions/amazon/validate-tokens";
import { getUserNichesKeywords } from "@/services/users-niches.server";
import { Suspense } from "react";

export default async function ProtectedPage() {
  const amazonAccess = await validateAmazonTokens();
  const userAnalytics = await getUserNichesKeywords();

  if (!amazonAccess.success) {
    return <div className="text-center">Couldn't connect with data providers</div>;
  }

  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <ProductSearcherDashboard userAnalytics={userAnalytics} />
    </Suspense>
  );
}
