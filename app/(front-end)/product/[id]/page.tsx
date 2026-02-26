"use client";

import * as React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";

import { products } from "@/data";
import type { Product, ProductVariant } from "@/types/product";
import { getDefaultVariant } from "@/lib/productHelper";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Copy, Check, ShieldCheck, Truck } from "lucide-react";

export default function ProductPage() {
  const params = useParams<{ id: string }>();

  const product: Product | undefined = products.find((p) => p.id === params.id);

  const [variant, setVariant] = React.useState<ProductVariant | null>(null);
  const [activeImage, setActiveImage] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (product) {
      const v = getDefaultVariant(product);
      setVariant(v);
      setActiveImage(v.images[0]);
    }
  }, [product]);

  if (!product || !variant) return null;

  function copyCode() {
    navigator.clipboard.writeText(variant!.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* ================= IMAGE GALLERY ================= */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              priority
              className="object-cover"
            />

            {!variant.inStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Badge variant="secondary">Out of Stock</Badge>
              </div>
            )}
          </div>

          {/* thumbnails */}
          {variant.images.length > 1 && (
            <div className="flex gap-3">
              {variant.images.map((img) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-24 aspect-square rounded-lg overflow-hidden border ${
                    activeImage === img
                      ? "border-primary"
                      : "border-transparent"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= PRODUCT INFO ================= */}
        <div className="space-y-8">
          {/* tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{product.category}</Badge>
            <Badge variant="outline">{product.style}</Badge>

            {product.type === "Anti Tarnish" && (
              <Badge className="bg-[#E3BB76]/20 text-[#8B6A2B]">
                Anti Tarnish
              </Badge>
            )}
          </div>

          {/* title */}
          <h1 className="font-serif text-4xl leading-tight">{product.name}</h1>

          {/* price */}
          <div className="flex items-end gap-4">
            <p className="text-3xl font-semibold">
              ₹{variant.price.toLocaleString()}
            </p>

            <span className="text-sm text-muted-foreground">
              Inclusive of taxes
            </span>
          </div>

          <Separator />

          {/* ================= VARIANTS ================= */}
          {product.variants?.length > 1 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Select Variant</p>

              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <Button
                    key={v.id}
                    size="sm"
                    variant={variant.id === v.id ? "default" : "outline"}
                    disabled={!v.inStock}
                    onClick={() => {
                      setVariant(v);
                      setActiveImage(v.images[0]);
                    }}
                  >
                    {v.name || v.code}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* ================= DESIGN CODE ================= */}
          <Card>
            <CardContent className="flex items-center justify-between py-4">
              <span className="text-sm text-muted-foreground">Design Code</span>

              <Button
                variant="ghost"
                size="sm"
                onClick={copyCode}
                className="font-mono gap-2"
              >
                {variant.code}
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </CardContent>
          </Card>

          {/* ================= CTA ================= */}
          <Button size="lg" className="w-full" disabled={!variant.inStock}>
            {variant.inStock ? "Order on Instagram" : "Check Availability"}
          </Button>

          {/* ================= TRUST BLOCK ================= */}
          <div className="grid grid-cols-2 gap-4 pt-6">
            <Card>
              <CardContent className="p-4 flex gap-3">
                <ShieldCheck size={20} />
                <div>
                  <p className="text-sm font-medium">Authentic Design</p>
                  <p className="text-xs text-muted-foreground">
                    Premium craftsmanship guaranteed
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex gap-3">
                <Truck size={20} />
                <div>
                  <p className="text-sm font-medium">Fast Shipping</p>
                  <p className="text-xs text-muted-foreground">
                    Pan-India delivery available
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className="mt-24 max-w-3xl">
        <h2 className="font-serif text-2xl mb-4">Product Details</h2>

        <p className="text-muted-foreground leading-relaxed">
          {product.description}
        </p>
      </div>
    </div>
  );
}
