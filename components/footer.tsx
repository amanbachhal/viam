"use client";

import { Instagram, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSiteConfig } from "./providers/site-config-provider";

export function Footer() {
  const config = useSiteConfig();

  return (
    <footer
      className="w-full transition-colors duration-300"
      style={{
        background: config?.footer_bg || "#0a0a0a",
        color: config?.footer_font_color || "#ffffff",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-10">
        {/* ===== Top Section: 2-Column Layout ===== */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-16">
          {/* ----- Left: Brand ----- */}
          <div className="flex flex-col items-center md:items-start space-y-6 text-center md:text-left max-w-sm">
            <Link href="/" className="inline-block">
              <Image
                src={config?.selected_logo || "/logo.webp"}
                alt="Viam Jewels"
                width={140}
                height={40}
                className=" w-auto h-15 object-contain"
                unoptimized
              />
            </Link>

            <p className="text-sm leading-loose  font-light">
              Demystifying jewelry with modern elegance. A curated collection of
              timeless earrings, necklaces, and sets crafted for every occasion.
            </p>
          </div>

          {/* ----- Right: Connect ----- */}
          <div className="flex flex-col items-center md:items-end space-y-6 text-center md:text-right mt-auto">
            <h3 className="font-medium  uppercase ">Connect</h3>

            <div className="flex flex-col items-center md:items-end space-y-4 text-sm font-light">
              <a
                href="https://www.instagram.com/viamjewels"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center gap-3 hover:underline"
              >
                <Instagram size={16} strokeWidth={1.5} />
                <span className="tracking-wide">@viamjewels</span>
              </a>

              <div className="flex items-center gap-3">
                <MapPin size={16} strokeWidth={1.5} />
                <span className="tracking-wide">Chandigarh, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Bottom Bar ===== */}
        <div className="mt-20 pt-8 border-t border-current/20 flex flex-col items-center justify-center">
          <p className="text-xs tracking-wider  font-light">
            © {new Date().getFullYear()} VIAM JEWELS. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}
