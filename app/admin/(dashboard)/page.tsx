"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminDashboard() {
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);

  async function loadProducts() {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function createProduct() {
    await fetch("/api/admin/products", {
      method: "POST",
      body: JSON.stringify({
        name,
        slug: name.toLowerCase().replace(" ", "-"),
        category: "Earrings",
        style: "Modern",
        type: "Anti Tarnish",
      }),
    });

    loadProducts();
  }

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-serif">Admin</h1>

      <div className="flex gap-3">
        <Input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={createProduct}>Create</Button>
      </div>

      <div className="space-y-2">
        {products.map((p: any) => (
          <div key={p.id}>{p.name}</div>
        ))}
      </div>
    </div>
  );
}
