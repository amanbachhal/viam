"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductTable, ProductDrawer } from "@/components/admin-products";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");

  async function load() {
    const res = await fetch("/api/admin/products");
    setProducts(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = products.filter((p: any) =>
    p.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Input
          placeholder="Search products..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <ProductTable
        products={filtered}
        onEdit={(p) => {
          setSelected(p);
          setOpen(true);
        }}
        onRefresh={load}
      />

      <ProductDrawer
        open={open}
        setOpen={setOpen}
        product={selected}
        onSuccess={load}
      />
    </div>
  );
}
