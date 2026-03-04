import { HeroSkeleton } from "@/components/hero";
import { ProductCardSkeleton } from "@/components/productCard";

export default function HomeLoading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-between">
      {/* 1. The Hero Skeleton */}
      <HeroSkeleton />

      {/* 2. The Collection Section Skeleton */}
      <section className="relative w-full px-6 py-20 bg-white min-h-[80vh]">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="max-w-7xl mx-auto">
            {/* Mocking the Filters Header */}
            <div className="py-4 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="h-10 w-48 bg-stone-200 rounded animate-pulse" />
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="h-10 w-full md:w-64 bg-stone-100 rounded-full animate-pulse" />
                <div className="h-10 w-28 bg-stone-100 rounded-full animate-pulse" />
              </div>
            </div>

            {/* The Grid of Product Skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
