"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-300 w-full">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* ===== Brand ===== */}
          <div className="space-y-6 text-center md:text-left">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.webp"
                alt="Viam Jewels"
                width={160}
                height={20}
                className="opacity-90 hover:opacity-100 transition"
              />
            </Link>

            <p className="text-sm text-stone-400 leading-relaxed max-w-sm mx-auto md:mx-0">
              Demystifying jewelry with modern elegance. A curated collection of
              timeless earrings, necklaces, and sets crafted for every occasion.
            </p>
          </div>

          {/* ===== Explore ===== */}
          <div className="space-y-6 text-center md:text-left">
            <h3 className="text-xs font-semibold tracking-[0.25em] text-white uppercase">
              Explore
            </h3>

            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/collection"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Collection
                </Link>
              </li>

              <li>
                <Link
                  href="/?style=Modern"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Modern Designs
                </Link>
              </li>

              <li>
                <Link
                  href="/?style=Traditional"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Traditional Sets
                </Link>
              </li>

              <li>
                <Link
                  href="/?style=Party"
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  Party Wear
                </Link>
              </li>
            </ul>
          </div>

          {/* ===== Contact ===== */}
          <div className="space-y-6 text-center md:text-left">
            <h3 className="text-xs font-semibold tracking-[0.25em] text-white uppercase">
              Connect
            </h3>

            <div className="space-y-4 text-sm">
              <a
                href="https://www.instagram.com/viamjewels"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center md:justify-start gap-3 text-stone-400 hover:text-white transition-colors"
              >
                <Instagram size={18} />
                @viamjewels
              </a>

              <a
                href="mailto:hello@viamjewels.com"
                className="flex items-center justify-center md:justify-start gap-3 text-stone-400 hover:text-white transition-colors"
              >
                <Mail size={18} />
                hello@viamjewels.com
              </a>

              <div className="flex items-center justify-center md:justify-start gap-3 text-stone-400">
                <MapPin size={18} />
                Chandigarh, India
              </div>
            </div>
          </div>
        </div>

        {/* ===== Bottom Bar ===== */}
        <div className="mt-20 pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p className="mx-auto">
            © {new Date().getFullYear()} VIAM JEWELS. All rights reserved.
          </p>

          {/* <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-stone-300 transition-colors"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="hover:text-stone-300 transition-colors"
            >
              Terms
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
