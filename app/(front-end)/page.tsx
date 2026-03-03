import { getStoreProducts } from "@/actions/store.actions";
import { getFilterOptions } from "@/actions/master.actions";
import { Hero } from "@/components/hero";
import { CollectionSection } from "@/components/collectionSection";

export default async function Home() {
  const [products, filters] = await Promise.all([
    getStoreProducts({ page: 1 }),
    getFilterOptions(),
  ]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between">
      <Hero />
      <CollectionSection
        initialProducts={products}
        filterOptions={filters.data}
      />
    </div>
  );
}
