"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // <-- Added Skeleton
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Props {
  product: any;
}

const FALLBACK_IMAGE = "/placeholder.webp";

export function ProductCard({ product }: Props) {
  const imageSrc = product.image || FALLBACK_IMAGE;
  const isOutOfStock = !product.inStock;

  const hasProductDiscount =
    product.discountPercent && product.discountedMinPrice;

  const priceText = product.priceSame
    ? `₹${product.minPrice.toLocaleString()}`
    : `From ₹${product.minPrice.toLocaleString()}`;

  const discountedText = product.discountedPriceSame
    ? `₹${product.discountedMinPrice?.toLocaleString()}`
    : `From ₹${product.discountedMinPrice?.toLocaleString()}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Link href={`/product/${product.id}`} className="block h-full">
        <Card className="group flex flex-col h-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-0 gap-0 cursor-pointer">
          {/* IMAGE */}
          <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              sizes="(max-width:768px) 100vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Soft bottom gradient for luxury feel */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />

            {/* DISCOUNT BADGE */}
            {hasProductDiscount && (
              <Badge className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded-full shadow-md">
                {product.discountPercent}% OFF
              </Badge>
            )}

            {!hasProductDiscount && product.showVariantTagOnly && (
              <Badge className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 text-xs rounded-full">
                Variant Discount
              </Badge>
            )}

            {/* OUT OF STOCK */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[1px]">
                <span className="bg-white text-black text-xs font-semibold px-4 py-2 rounded-full shadow">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="flex flex-col flex-1 p-4 space-y-3">
            <h3 className="font-medium leading-snug line-clamp-2 text-stone-800">
              {product.name}
            </h3>

            <div className="flex items-center gap-2">
              {hasProductDiscount ? (
                <>
                  <span className="text-xs line-through text-stone-400">
                    {priceText}
                  </span>
                  <span className="text-base font-semibold text-red-600">
                    {discountedText}
                  </span>
                </>
              ) : (
                <span className="text-base font-semibold text-stone-900">
                  {priceText}
                </span>
              )}
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                product.categoryName || product.category,
                product.styleName || product.style,
                product.typeName || product.type,
              ]
                .filter(Boolean)
                .map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-1 rounded-full bg-stone-100 text-stone-600 font-medium tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

// ==========================================
// EXPORTED SKELETON FOR THE CARD
// ==========================================
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col h-full overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm p-0 gap-0">
      <Skeleton className="w-full aspect-[3/4] rounded-none bg-stone-200" />
      <div className="flex flex-col flex-1 p-4 space-y-3">
        <Skeleton className="h-5 w-3/4 bg-stone-200" />
        <Skeleton className="h-5 w-1/3 bg-stone-200" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16 rounded-full bg-stone-200" />
          <Skeleton className="h-5 w-16 rounded-full bg-stone-200" />
        </div>
      </div>
    </div>
  );
}
