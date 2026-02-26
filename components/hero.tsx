"use client";

import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const heroImages = ["/hero1.webp", "/hero2.webp", "/hero3.webp"];

export function Hero() {
  return (
    <section className="w-full bg-stone-400 px-6 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        {/* ===== DESKTOP GRID (lg+) ===== */}
        <div className="hidden lg:grid grid-cols-3 gap-10">
          {heroImages.map((src, index) => (
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
              {heroImages.map((src, index) => (
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
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif tracking-wide leading-tight font-bold text-white">
            The Art of Modern Jewelry
          </h1>

          <p className="mt-6 text-muted text-sm md:text-lg leading-relaxed">
            A curated collection of refined pieces created for timeless style
            and effortless elegance.
          </p>
        </div>
      </div>
    </section>
  );
}
