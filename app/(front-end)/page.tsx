import { CollectionSection } from "@/components/collectionSection";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full  flex-col items-center justify-between   sm:items-start">
      <Hero />
      <CollectionSection />
    </div>
  );
}
