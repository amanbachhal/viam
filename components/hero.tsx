"use client";

import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { useSiteConfig } from "./providers/site-config-provider";
import { Skeleton } from "@/components/ui/skeleton";

export function Hero() {
  const config = useSiteConfig();

  const DEFAULT_HERO_IMAGES = ["/hero1.webp", "/hero2.webp", "/hero3.webp"];

  const heroImages = [0, 1, 2].map(
    (i) => config?.hero_images?.[i] || DEFAULT_HERO_IMAGES[i],
  );

  return (
    <section
      className="w-full bg-stone-400 px-6 py-16 md:py-24"
      style={{ background: config?.hero_bg || "#d6d3d1" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* ===== DESKTOP GRID (lg+) ===== */}
        <div className="hidden lg:grid grid-cols-3 gap-10">
          {heroImages.map((src: string, index: number) => (
            <Card
              key={index}
              className="overflow-hidden rounded-3xl shadow-xl border-0 p-0"
            >
              <div className="relative w-full aspect-[3/4]">
                <Image
                  src={src}
                  alt={`Viam Jewels ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              </div>
            </Card>
          ))}
        </div>

        {/* ===== MOBILE + TABLET CAROUSEL ===== */}
        <div className="lg:hidden">
          <Carousel
            opts={{ loop: true, align: "start" }}
            plugins={[
              Autoplay({
                delay: 3500,
                stopOnInteraction: true,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {heroImages.map((src: string, index: number) => (
                <CarouselItem
                  key={index}
                  className="
                    pl-4
                    basis-full
                    md:basis-1/2
                  "
                >
                  <Card className="overflow-hidden rounded-3xl shadow-xl border-0 p-0">
                    <div className="relative w-full aspect-[4/5]">
                      <Image
                        src={src}
                        alt={`Viam Jewels ${index + 1}`}
                        fill
                        priority={index === 0}
                        className="object-cover"
                      />
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* ===== HERO TEXT ===== */}
        <div className="mt-16 md:mt-24 lg:mt-28 text-center max-w-3xl mx-auto">
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-serif tracking-wide leading-tight font-bold text-white"
            style={{ color: config?.hero_font_color || "#fff" }}
          >
            {config?.hero_title || "The Art of Modern Jewelry"}
          </h1>

          <p
            className="mt-6 text-muted text-sm md:text-lg leading-relaxed"
            style={{ color: config?.hero_font_color || "#fff" }}
          >
            {config?.hero_subtitle ||
              "A curated collection of refined pieces created for timeless elegance."}
          </p>
        </div>
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return (
    <section className="w-full bg-stone-300 px-6 py-16 md:py-24 animate-pulse">
      <div className="max-w-7xl mx-auto">
        <div className="hidden lg:grid grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              className="w-full aspect-[3/4] rounded-3xl bg-white/20"
            />
          ))}
        </div>
        <div className="lg:hidden">
          <Skeleton className="w-full aspect-[4/5] rounded-3xl bg-white/20" />
        </div>
        <div className="mt-16 md:mt-24 lg:mt-28 text-center max-w-3xl mx-auto flex flex-col items-center">
          <Skeleton className="h-14 w-3/4 mb-6 bg-white/30" />
          <Skeleton className="h-6 w-5/6 bg-white/20" />
        </div>
      </div>
    </section>
  );
}
