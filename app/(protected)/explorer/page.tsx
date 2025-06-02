import ProductSection from "@/components/dashboard/explorer/products-section";
import { getUserNichesKeywords } from "@/services/users-niches.server";
import { collectAmazonProductsAction } from "@/lib/actions/amazon-actions";
import { collectAlibabaProductsAction } from "@/lib/actions/alibaba-actions";
import SearchBar from "@/components/dashboard/explorer/search-bar";
import SaveNicheButton from "@/components/dashboard/save-niche-button";
import { getSettings } from "@/services/settings.server";
import { amazonToConnection } from "@/lib/factories/amazon/amzon-connection";
import { Suspense } from "react";
import { AmazonProductsFactoryResponse } from "@/types/amazon/amazon-factory";
import { AlibabaProductsFactoryResponse } from "@/types/alibaba/alibaba-factory";
import { cookies } from "next/headers";
import { AmazonConnection } from "@/types/amazon/amazon-connection";
import OverviewSection from "@/components/dashboard/analytics/overview";
import { Note } from "@/components/note";
import { alibabaTFC, amazonTFC } from "@/utils/tfcData";

export default async function ExplorerPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const keyword = (await searchParams).keyword as string | undefined;

  const savedNiches = await getUserNichesKeywords();
  const cookieStore = await cookies();
  const rawConnection = cookieStore.get("amazon_connection")?.value;
  const connection = rawConnection ? JSON.parse(rawConnection) as AmazonConnection : await getSettings().then(settings => amazonToConnection(settings.amazon_marketplace));

  // const amazonProductsPromise = keyword ? collectAmazonProductsAction(keyword, connection) : Promise.resolve({} as AmazonProductsFactoryResponse);
  // const alibabaProductsPromise = keyword ? collectAlibabaProductsAction(keyword, connection) : Promise.resolve({} as AlibabaProductsFactoryResponse);

  const amazonProductsPromise = keyword ? amazonTFC : Promise.resolve({} as AmazonProductsFactoryResponse);
  const alibabaProductsPromise = keyword ? alibabaTFC : Promise.resolve({} as AlibabaProductsFactoryResponse);

  return (
    <div className="space-y-6">
      <Note
        note="Search for products across Amazon and Alibaba to find profitable niches. Use the search bar to enter keywords and explore the results, then save your favorite niches for later analysis."
        to="/help"
        toMessage="Learn how to use the Explorer"
      />
      <div className="flex items-center justify-between">
        <SearchBar />
        <SaveNicheButton
          variant="long"
          key={keyword}
          savedNiches={savedNiches}
          term={keyword}
          initialPromise={amazonProductsPromise}
        />
      </div>
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading Products...</div>}>
        <ProductSection
          key={keyword}
          amazonProductsPromise={amazonProductsPromise}
          alibabaProductsPromise={alibabaProductsPromise}
        />
      </Suspense>
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading Analytics...</div>}>
        <OverviewSection
          key={keyword}
          term={keyword}
          marketplace={connection.domain}
          amazonProductsPromise={amazonProductsPromise}
          alibabaProductsPromise={alibabaProductsPromise}
        />
      </Suspense>
    </div>
  );
}