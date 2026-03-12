"use client";

import { AmbientBackground } from "@/components/ambient-background";
import { ProductCard, ProductCardSkeleton } from "@/components/productCard";
import { useSiteConfig } from "@/components/providers/site-config-provider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Copy,
  Instagram,
  ShieldCheck,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductClient({
  product,
  related,
}: {
  product: any;
  related: any[];
}) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [copied, setCopied] = useState(false);

  const defaultVariant =
    product.variants?.find((v: any) => v.in_stock) || product.variants?.[0];

  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [activeImage, setActiveImage] = useState(
    defaultVariant?.images?.[0] || "/placeholder.webp",
  );

  const config = useSiteConfig();

  /* ---------------- NEW GALLERY STATE ---------------- */

  const images = selectedVariant?.images || [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const thumbRef = useRef<HTMLDivElement>(null);
  const [showThumbArrows, setShowThumbArrows] = useState(false);

  const touchStartX = useRef<number | null>(null);

  /* --------------------------------------------------- */

  useEffect(() => {
    if (selectedVariant?.images?.length > 0) {
      setActiveImage(selectedVariant.images[0]);
      setCurrentIndex(0);
    }
  }, [selectedVariant]);

  useEffect(() => {
    const el = thumbRef.current;
    if (!el) return;

    const checkOverflow = () => {
      setShowThumbArrows(el.scrollWidth > el.clientWidth);
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [images]);

  const scrollThumbIntoView = (index: number) => {
    const container = thumbRef.current;
    if (!container) return;

    const child = container.children[index] as HTMLElement;

    child?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const goNext = () => {
    if (!images.length) return;

    const next = (currentIndex + 1) % images.length;

    setCurrentIndex(next);
    setActiveImage(images[next]);

    scrollThumbIntoView(next);
  };

  const goPrev = () => {
    if (!images.length) return;

    const prev = (currentIndex - 1 + images.length) % images.length;

    setCurrentIndex(prev);
    setActiveImage(images[prev]);

    scrollThumbIntoView(prev);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const diff = touchStartX.current - e.changedTouches[0].clientX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }

    touchStartX.current = null;
  };

  const handleCopyCode = () => {
    const codeToCopy = selectedVariant?.code || product.code;
    navigator.clipboard.writeText(codeToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const profileLink = "https://www.instagram.com/viamjewels/";
  const isCurrentlyInStock = selectedVariant?.in_stock;

  return (
    <div className="relative w-full px-6 py-20 bg-white overflow-hidden">
      <AmbientBackground mode={config.animation || "off"} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-8 transition-colors group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Collection
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
            {/* ===== LEFT: GALLERY SECTION ===== */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div
                className="aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-xl relative group"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {activeImage ? (
                  <img
                    src={activeImage}
                    alt={selectedVariant?.name || product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
                    No image available
                  </div>
                )}

                {/* DESKTOP ARROWS */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <button
                      onClick={goNext}
                      className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {!isCurrentlyInStock && (
                  <div className="absolute top-4 right-4 bg-stone-900/90 backdrop-blur-sm text-white text-xs font-bold tracking-widest px-4 py-2 uppercase rounded-full shadow-lg">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* MOBILE DOTS */}
              {images.length > 1 && (
                <div className="flex md:hidden justify-center gap-2">
                  {images.map((_: any, i: number) => (
                    <div
                      key={i}
                      className={cn(
                        "h-2 w-2 rounded-full transition-all",
                        currentIndex === i
                          ? "bg-stone-900 w-4"
                          : "bg-stone-300",
                      )}
                    />
                  ))}
                </div>
              )}

              {/* Gallery Thumbnails */}
              {selectedVariant?.images?.length > 1 && (
                <div className="hidden md:grid grid-cols-5 gap-4">
                  {selectedVariant.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImage(img);
                        setCurrentIndex(idx);
                      }}
                      className={cn(
                        "relative aspect-square rounded-lg overflow-hidden border-4 transition-all",
                        currentIndex === idx
                          ? "border-[#E3BB76]"
                          : "border-transparent hover:border-stone-300",
                      )}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* ===== RIGHT SIDE UNCHANGED ===== */}

            {/* ===== RIGHT: DETAILS SECTION ===== */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col space-y-8 lg:sticky lg:top-24 self-start"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {/* FIX: Used Name instead of ID */}
                  <span className="px-3 py-1 border border-stone-200 text-stone-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {product.categoryName || product.category}
                  </span>
                  {/* FIX: Used Name instead of ID */}
                  <span className="px-3 py-1 border border-stone-200 text-stone-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {product.styleName || product.style}
                  </span>
                  <span className="px-3 py-1 border border-stone-200 text-stone-500 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {product.typeName || product.type}
                  </span>
                </div>

                <h1 className="font-serif text-4xl md:text-5xl text-stone-900 leading-tight mb-2">
                  {product.name}
                </h1>

                <div className="flex items-center gap-4 mt-4">
                  {selectedVariant?.discountedPrice ? (
                    <>
                      <p className="text-lg line-through text-stone-400">
                        ₹{selectedVariant.price.toLocaleString()}
                      </p>
                      <p className="text-3xl font-light text-red-600">
                        ₹{selectedVariant.discountedPrice.toLocaleString()}
                      </p>
                      <Badge className="bg-red-600 text-white">
                        {selectedVariant.discountPercent}% OFF
                      </Badge>
                    </>
                  ) : (
                    <p className="text-3xl font-light text-stone-900">
                      ₹{selectedVariant?.price?.toLocaleString() || "0"}
                    </p>
                  )}
                </div>
              </div>

              {/* ===== AMAZON-STYLE VARIANT SELECTOR ===== */}
              {product.variants?.length > 1 && (
                <div className="space-y-3 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest">
                      Select Option
                    </h3>
                    <span className="text-sm text-stone-500">
                      {selectedVariant?.name}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant: any) => (
                      <button
                        key={variant._id}
                        onClick={() => setSelectedVariant(variant)}
                        className={cn(
                          "relative flex items-center gap-3 p-2 border-2 rounded-xl transition-all",
                          selectedVariant?._id === variant._id
                            ? "border-stone-900 bg-stone-50"
                            : "border-stone-200 hover:border-stone-400",
                          !variant.in_stock && "opacity-50 grayscale",
                        )}
                      >
                        {variant.images?.[0] && (
                          <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-stone-100 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={variant.images?.[0] || "/placeholder.webp"}
                              alt={variant.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="text-left pr-2">
                          <p className="text-xs font-bold text-stone-900">
                            {variant.name}
                          </p>
                          <div className="text-[10px]">
                            {variant.discountedPrice ? (
                              <div className="flex items-center gap-2">
                                <span className="line-through text-stone-400">
                                  ₹{variant.price.toLocaleString()}
                                </span>
                                <span className="text-red-600 font-semibold">
                                  ₹{variant.discountedPrice.toLocaleString()}
                                </span>
                              </div>
                            ) : (
                              <span className="text-stone-500">
                                ₹{variant.price.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6 border-t border-b border-stone-200 py-8">
                <div className="flex items-center justify-between bg-stone-100 p-4 rounded-lg">
                  <span className="text-sm font-bold text-stone-600 uppercase tracking-wider">
                    Variant Code
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-2 text-stone-900 font-mono text-lg font-bold hover:text-stone-600 transition-colors"
                    title="Click to copy"
                  >
                    {selectedVariant?.code || product.code}
                    {copied ? (
                      <Check size={18} className="text-green-600" />
                    ) : (
                      <Copy size={18} />
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest mb-2">
                    Description
                  </h3>
                  <p className="text-stone-600 leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <a
                  href={profileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "w-full flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-bold tracking-widest uppercase transition-all shadow-lg",
                    isCurrentlyInStock
                      ? "bg-stone-900 text-white hover:bg-black hover:shadow-xl hover:-translate-y-1"
                      : "bg-stone-200 text-stone-400 cursor-not-allowed",
                  )}
                  onClick={(e) => !isCurrentlyInStock && e.preventDefault()}
                >
                  <Instagram size={20} />
                  {isCurrentlyInStock
                    ? "Order on Instagram"
                    : "Currently Out of Stock"}
                </a>
                <p className="text-center text-xs text-stone-400">
                  Tap to visit our profile. DM us the code{" "}
                  <strong className="text-stone-700">
                    {selectedVariant?.code || product.code}
                  </strong>{" "}
                  to place your order.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-stone-100 shadow-sm">
                  <ShieldCheck className="text-stone-400 shrink-0" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">
                      Authentic Design
                    </h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Hand-picked for quality.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-stone-100 shadow-sm">
                  <Truck className="text-stone-400 shrink-0" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">
                      Fast Shipping
                    </h4>
                    <p className="text-xs text-stone-500 mt-1">
                      Available for immediate dispatch.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ===== RELATED PRODUCTS ===== */}
          {related && related.length > 0 && (
            <div className="border-t border-stone-200 pt-16">
              <h2 className="font-serif text-3xl text-stone-900 mb-10">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProductClientSkeleton() {
  return (
    <div className="relative w-full px-6 py-20 bg-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-4 w-32 mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
            {/* LEFT: Gallery Skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
              <div className="flex gap-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    className="w-24 shrink-0 aspect-square rounded-lg"
                  />
                ))}
              </div>
            </div>

            {/* RIGHT: Details Skeleton */}
            <div className="flex flex-col space-y-8 lg:sticky lg:top-24 self-start w-full">
              <div className="space-y-4 w-full">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-8 w-1/4" />
              </div>

              <div className="space-y-3 pt-4 border-t w-full">
                <Skeleton className="h-4 w-24" />
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-[60px] w-32 rounded-xl" />
                  <Skeleton className="h-[60px] w-32 rounded-xl" />
                </div>
              </div>

              <Skeleton className="h-[120px] w-full rounded-xl" />
              <Skeleton className="h-[56px] w-full rounded-xl" />
            </div>
          </div>

          {/* RELATED PRODUCTS SKELETON */}
          <div className="border-t border-stone-200 pt-16">
            <Skeleton className="h-8 w-48 mb-10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
