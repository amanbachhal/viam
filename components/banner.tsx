"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSiteConfig } from "./providers/site-config-provider";

export function Banner() {
  const config = useSiteConfig();
  const [isOverflowing, setIsOverflowing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Check if the text is wider than the container to trigger the auto-scroll
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && textRef.current) {
        setIsOverflowing(
          textRef.current.scrollWidth > containerRef.current.clientWidth,
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => window.removeEventListener("resize", checkOverflow);
  }, [config?.banner_text]);

  if (!config?.show_banner || !config?.banner_text) {
    return null;
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      transition={{
        duration: 0.8,
        delay: 1,
        ease: [0.16, 1, 0.3, 1], // A custom luxury easing curve (custom cubic-bezier)
      }}
      className="w-full relative z-50 overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: config.banner_bg || "#cda434",
        color: config.banner_font_color || "#000000",
      }}
    >
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-center overflow-hidden"
      >
        <motion.p
          ref={textRef}
          className="text-xs md:text-sm font-medium tracking-[0.1em] uppercase whitespace-nowrap"
          // If the text overflows, scroll it continuously. If it fits, keep it perfectly centered.
          animate={isOverflowing ? { x: ["100%", "-100%"] } : { x: 0 }}
          transition={
            isOverflowing
              ? { repeat: Infinity, ease: "linear", duration: 15 } // 15s scroll speed
              : {}
          }
        >
          {config.banner_text}
        </motion.p>
      </div>
    </motion.div>
  );
}
