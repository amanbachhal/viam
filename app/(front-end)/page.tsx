import { Hero } from "@/components/hero";
import { CollectionSection } from "@/components/collectionSection";
import { getStoreProducts } from "@/actions/store.actions";

export default async function Home() {
  const products = await getStoreProducts({ page: 1 });

  return (
    <div className="flex min-h-screen w-full  flex-col items-center justify-between   sm:items-start">
      <Hero />
      <CollectionSection initialProducts={products} />
    </div>
  );
}
