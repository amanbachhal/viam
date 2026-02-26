"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { Card } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  /* ---------- pick default variant ---------- */
  const defaultVariant =
    product.variants.find((v) => v.inStock) || product.variants[0];

  /* ---------- stock logic ---------- */
  const isOutOfStock = !product.variants.some((v) => v.inStock);

  if (!defaultVariant) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="h-full"
    >
      <Link href={`/product/${product.id}`} className="block h-full">
        <Card
          className="
            group flex flex-col h-full overflow-hidden
            rounded-xl border border-stone-100 bg-white
            shadow-sm hover:shadow-lg transition p-0 cursor-pointer
          "
        >
          {/* IMAGE */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={defaultVariant.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Out of stock only if ALL variants out */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Badge variant="secondary" className="px-4 py-1">
                  Out of Stock
                </Badge>
              </div>
            )}

            {/* code hover */}
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition">
              <Badge variant="secondary" className="gap-1 text-[10px]">
                <Tag size={10} />
                {defaultVariant.code}
              </Badge>
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex flex-col flex-1 p-4 space-y-2">
            {/* title + price */}
            <div className="flex items-start justify-between gap-3">
              <p className="font-serif font-semibold line-clamp-2 flex-1">
                {product.name}
              </p>

              <span className="text-sm font-semibold shrink-0">
                ₹{defaultVariant.price.toLocaleString()}
              </span>
            </div>

            {/* metadata */}
            <div className="flex items-center gap-3 min-h-[18px]">
              {product.type === "Anti Tarnish" && (
                <Badge
                  variant="secondary"
                  className="text-[10px] uppercase bg-[#E3BB76]/20"
                >
                  Anti Tarnish
                </Badge>
              )}
            </div>

            {/* CTA pinned bottom */}
            <div className="mt-auto pt-3">
              <Button
                variant="outline"
                className="bg-white w-full pointer-events-none"
              >
                View Details
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
