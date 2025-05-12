import config from "@/orm.config";
import ComparativeSearch from "@/components/comparative-search";

export default async function ProtectedPage() {
  const baseUrl = config.base_url;

  return (
    <div className="flex-1 flex flex-col gap-12 w-full">
      <div className="flex flex-col gap-4 w-full mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Amazon & Alibaba Product Comparison
        </h1>
        <ComparativeSearch baseUrl={baseUrl} />
      </div>
    </div>
  );
}

