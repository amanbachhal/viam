"use client";

import { useMemo, useState } from "react";
import { products } from "@/data";
import { filterProducts } from "@/lib/filterProducts";

import { Product } from "@/types/product";
import { ProductFilters } from "./productFilters";
import { ProductCard } from "./productCard";
import { ProductDrawer } from "./productDrawer";

export function CollectionSection() {
  const [category, setCategory] = useState("All");
  const [style, setStyle] = useState("All");
  const [type, setType] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(
    () => filterProducts(products, category, style, type, search),
    [category, style, type, search],
  );

  return (
    <section id="collection" className="w-full px-6 py-20 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Filters */}
        <ProductFilters
          category={category}
          style={style}
          type={type}
          search={search}
          onCategoryChange={setCategory}
          onStyleChange={setStyle}
          onTypeChange={setType}
          onSearchChange={setSearch}
        />

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-muted-foreground">
            No designs found matching your criteria.
          </div>
        )}

        <ProductDrawer
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={() => setSelectedProduct(null)}
        />
      </div>
    </section>
  );
}
