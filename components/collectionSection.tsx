"use client";

import { useEffect, useState } from "react";
import { ProductFilters } from "./productFilters";
import { ProductCard } from "./productCard";
import { Button } from "@/components/ui/button";
import { getStoreProducts } from "@/actions/store.actions";
import { StoreProduct, StoreProductsResponse } from "@/types/product";
import { AmbientBackground } from "./ambient-background";
import { useSiteConfig } from "./providers/site-config-provider";

interface Props {
  initialProducts: StoreProductsResponse;
  filterOptions: {
    categories: any[];
    styles: any[];
    types: any[];
  };
}

export function CollectionSection({ initialProducts, filterOptions }: Props) {
  const [products, setProducts] = useState<StoreProduct[]>(
    initialProducts.data,
  );
  const [page, setPage] = useState(initialProducts.page);
  const [hasMore, setHasMore] = useState(initialProducts.hasMore);
  const [loading, setLoading] = useState(false);

  // These will now hold ObjectIds (strings) instead of display names
  const [category, setCategory] = useState("All");
  const [style, setStyle] = useState("All");
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");

  const config = useSiteConfig();

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, category, style, type]);

  async function fetchProducts(reset = false) {
    setLoading(true);
    const nextPage = reset ? 1 : page + 1;

    const res = await getStoreProducts({
      page: nextPage,
      search,
      category,
      style,
      type,
    });

    if (!res?.success) {
      setLoading(false);
      return;
    }

    if (reset) {
      setProducts(res.data);
      setPage(1);
    } else {
      setProducts((prev) => [...prev, ...res.data]);
      setPage(nextPage);
    }

    setHasMore(res.hasMore);
    setLoading(false);
  }

  return (
    <section className="relative w-full px-6 py-20 bg-white overflow-hidden">
      <AmbientBackground mode={config.animation || "off"} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <ProductFilters
            category={category}
            style={style}
            type={type}
            search={search}
            filterOptions={filterOptions}
            onCategoryChange={setCategory}
            onStyleChange={setStyle}
            onTypeChange={setType}
            onSearchChange={setSearch}
          />

          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-12">
                  <Button
                    onClick={() => fetchProducts()}
                    disabled={loading}
                    className="px-10 rounded-full bg-black text-white hover:bg-[#E3BB76] hover:text-black transition-colors"
                  >
                    {loading ? "Loading..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="py-20 text-center text-muted-foreground font-serif text-xl">
              No designs found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
