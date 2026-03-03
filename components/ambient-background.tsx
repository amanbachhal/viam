"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo } from "react";

export type AmbientMode =
  | "sparkle"
  | "snow"
  | "holi"
  | "diwali"
  | "valentine"
  | "republic"
  | "off";

interface AmbientProps {
  mode?: AmbientMode;
}

export function AmbientBackground({ mode = "off" }: AmbientProps) {
  if (mode === "off") return null;

  const particles = useMemo(() => Array.from({ length: 120 }), [mode]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-white">
      <AnimatePresence mode="wait">
        {mode === "sparkle" && <SparkleMode particles={particles} />}
        {mode === "snow" && <SnowMode particles={particles} />}
        {mode === "holi" && <HoliMode />}
        {mode === "diwali" && <DiwaliSkyExplosions />}
        {mode === "valentine" && <ValentineMode particles={particles} />}
        {mode === "republic" && <RepublicPetals />}
      </AnimatePresence>
    </div>
  );
}

/* --- REVISED MODES: SLIGHT OPACITY BUMP --- */

const DiwaliSkyExplosions = () => {
  // 4 controlled zones so explosions spread perfectly across the screen without overlapping
  const burstZones = [
    { left: "20%", top: "25%", delay: 0 },
    { left: "80%", top: "20%", delay: 2.5 },
    { left: "35%", top: "60%", delay: 5 },
    { left: "70%", top: "55%", delay: 1.5 },
  ];

  return (
    <>
      {burstZones.map((zone, bIdx) => (
        <React.Fragment key={bIdx}>
          {[...Array(16)].map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            // Alternating distances create a beautiful "inner and outer ring" firework effect
            const distance = i % 2 === 0 ? 110 : 60;

            return (
              <motion.div
                key={i}
                // Using a soft champagne gold
                className="absolute rounded-full bg-[#e6c27a]"
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1.5, 0], // Bumped up from 0.6 for better visibility
                  scale: [0, 1, 0.5],
                  x: Math.cos(angle) * distance,
                  // Adding +20 to Y creates a subtle downward "gravity" drift at the end
                  y: Math.sin(angle) * distance + 20,
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                  delay: zone.delay,
                  ease: "easeOut",
                }}
                style={{
                  left: zone.left,
                  top: zone.top,
                  width: 3.5, // Slightly thicker spark
                  height: 3.5,
                  boxShadow: "0 0 10px rgba(212, 175, 55, 0.8)", // Stronger gold glow
                  filter: "blur(0.5px)",
                }}
              />
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
};

const HoliMode = () => {
  const colors = ["#FF1493", "#00BFFF", "#FFD700", "#32CD32", "#FF4500"];

  // Fixed spread so they don't randomly clump in the middle
  const positions = [
    { left: "15%", top: "20%" },
    { left: "80%", top: "70%" },
    { left: "50%", top: "45%" },
    { left: "25%", top: "80%" },
    { left: "75%", top: "25%" },
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.12, 0], // Bumped up from 0.08 so it registers on the screen
            scale: [0.8, 1.2, 0.9],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut",
          }}
          style={{
            left: pos.left,
            top: pos.top,
            backgroundColor: colors[i % colors.length],
            width: "12vw",
            height: "12vw",
            filter: "blur(45px)",
          }}
        />
      ))}
    </>
  );
};

/* --- PRESERVED MODES --- */

const RepublicPetals = () => {
  const flagColors = ["#FF9933", "#FFFFFF", "#138808"];
  return (
    <>
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-tl-full rounded-br-full"
          initial={{ y: -20, opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [0, 0.6, 0],
            rotate: 360,
            x: ["-20px", "20px", "-20px"],
          }}
          transition={{
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear",
          }}
          style={{
            backgroundColor: flagColors[i % 3],
            width: 12,
            height: 16,
            left: `${Math.random() * 100}%`,
            border: i % 3 === 1 ? "1px solid #e2e8f0" : "none",
            filter: "blur(0.3px)",
          }}
        />
      ))}
    </>
  );
};

const SparkleMode = ({ particles }: { particles: any[] }) => (
  <>
    {particles.map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-amber-200"
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 0.8, 0],
          scale: [0, 1.5, 0],
          rotate: [0, 90, 180],
        }}
        transition={{
          duration: 2 + Math.random() * 2,
          repeat: Infinity,
          delay: Math.random() * 5,
        }}
        style={{
          width: Math.random() * 4 + 2,
          height: Math.random() * 4 + 2,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          boxShadow: "0 0 10px rgba(251, 191, 36, 0.8)",
        }}
      />
    ))}
  </>
);

const SnowMode = ({ particles }: { particles: any[] }) => (
  <>
    {particles.map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-neutral-500"
        initial={{ y: -50, opacity: 0 }}
        animate={{
          y: "110vh",
          x: ["-20px", "20px", "-20px"],
          opacity: [0, 0.7, 0],
        }}
        transition={{
          duration: 6 + Math.random() * 6,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 10,
        }}
        style={{
          width: Math.random() * 6 + 4,
          height: Math.random() * 6 + 4,
          left: `${Math.random() * 100}%`,
          filter: "blur(1px)",
          border: "1px solid rgba(255,255,255,0.8)",
        }}
      />
    ))}
  </>
);

const ValentineMode = ({ particles }: { particles: any[] }) => (
  <>
    {particles.slice(0, 30).map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        initial={{ y: "110vh", opacity: 0, rotate: 0 }}
        animate={{
          y: "-10vh",
          opacity: [0, 0.8, 0],
          rotate: [0, 45, -45, 0],
          x: ["-20px", "20px", "-20px"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          delay: Math.random() * 15,
        }}
        style={{
          left: `${Math.random() * 100}%`,
          fontSize: Math.random() * 30 + 20,
          color: i % 2 === 0 ? "#FF69B4" : "#A52A2A",
          filter: "drop-shadow(0 0 5px rgba(255,105,180,0.3))",
        }}
      >
        {i % 2 === 0 ? "❤️" : "🧸"}
      </motion.div>
    ))}
  </>
);
