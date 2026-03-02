"use client";

import { Button } from "@/components/ui/button";
import { Instagram, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { useSiteConfig } from "./providers/site-config-provider";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLButtonElement>(null);

  const pathname = usePathname();

  const config = useSiteConfig();

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-50 flex w-full justify-between p-5  backdrop-blur-md   items-center"
        style={{ background: config?.header_bg || "#0c0c0c" }}
      >
        {/* Logo */}
        <Link href="/">
          <Image
            src={config?.selected_logo || "/logo.webp"}
            alt="Viam Jewels logo"
            width={170}
            height={20}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4 items-center">
          {/* <Button
              asChild
              variant="ghost"
              className="p-6! rounded-full hover:bg-[#E3BB76]! hover:text-black!"
              style={{
                color: config?.menu_option_font_color,
              }}
              onClick={() => {
                document
                  .getElementById("collection")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Link href="/">HOME</Link>
            </Button> */}

          <Button
            asChild
            className="p-6! rounded-full  hover:text-black! hover:bg-[#E3BB76]!"
            style={{
              color: config?.cta_font_color,
              background: config?.cta_bg,
            }}
          >
            <Link
              href="https://www.instagram.com/viamjewels"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Instagram size={18} />
              SHOP ON INSTAGRAM
            </Link>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <Button
          ref={toggleRef}
          variant="ghost"
          className="md:hidden p-2 "
          style={{
            color: config?.menu_option_font_color,
          }}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {/* ===== Overlay ===== */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* ===== Right Slide Drawer ===== */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed top-0 right-0 h-full w-[85%] max-w-sm z-50 md:hidden bg-stone-950 border-l border-black shadow-2xl"
            style={{ background: config?.header_bg || "#0c0c0c" }}
          >
            {/* Drawer Header */}
            <div className="flex justify-end p-5 border-b border-black">
              <Button
                variant="ghost"
                style={{
                  color: config?.menu_option_font_color,
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                <X />
              </Button>
            </div>

            {/* Drawer Content */}
            <div className="flex flex-col gap-4 p-6">
              {/* <Button
                asChild
                variant="ghost"
                className="w-full rounded-full hover:bg-[#E3BB76]! hover:text-black!"
                style={{
                  color: config?.menu_option_font_color,
                }}
                onClick={() => {
                  setIsMenuOpen(false);
                  document
                    .getElementById("collection")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <Link href="/">HOME</Link>
              </Button> */}

              <Button
                asChild
                className="w-full rounded-full  hover:text-black! hover:bg-[#E3BB76]!"
                style={{
                  color: config?.cta_font_color,
                  background: config?.cta_bg,
                }}
              >
                <Link
                  href="https://www.instagram.com/viamjewels"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Instagram size={18} />
                  SHOP ON INSTAGRAM
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
