"use client";

import Image from "next/image";
import Link from "next/link";
import { StoreProduct } from "@/types/product";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { motion } from "framer-motion";

interface Props {
  product: StoreProduct;
}

const FALLBACK_IMAGE = "/placeholder.webp";

export function ProductCard({ product }: Props) {
  const imageSrc = product.image || FALLBACK_IMAGE;
  const isOutOfStock = !product.inStock;

  const priceText = product.priceSame
    ? `₹${product.minPrice.toLocaleString()}`
    : `From ₹${product.minPrice.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link href={`/product/${product.id}`} className="block h-full">
        <Card className="group flex flex-col h-full overflow-hidden rounded-xl border border-stone-100 bg-white shadow-sm hover:shadow-lg transition p-0 cursor-pointer gap-0">
          {/* IMAGE */}
          <div className="relative aspect-[3/4] overflow-hidden bg-muted">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width:768px) 100vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Badge variant="secondary" className="px-4 py-1">
                  Out of Stock
                </Badge>
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex flex-col flex-1 p-4 space-y-2">
            <div className="flex flex-col gap-1">
              {product.type === "Anti Tarnish" && (
                <Badge
                  variant="secondary"
                  className="text-[10px] uppercase bg-[#E3BB76]/20 mb-2"
                >
                  Anti Tarnish
                </Badge>
              )}
              <p className="line-clamp-2 flex-1 text-sm!">{product.name}</p>

              <p className="text-sm font-semibold shrink-0">{priceText}</p>
            </div>

            <div className="mt-auto pt-3">
              <Button variant="outline" className="bg-white w-full">
                View Details
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
