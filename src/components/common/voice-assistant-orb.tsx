"use client";

import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";

interface VoiceAssistantOrbProps {
  onClick?: () => void;
  isListening?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  customAnimationUrl?: string | null;
}

const DEFAULT_LOTTIE_URL =
  "https://lottie.host/352372e5-0ef4-4eab-bfeb-7410a876dd8d/aITZ1PoTWi.lottie";

export function VoiceAssistantOrb({
  onClick,
  isListening = false,
  size = "lg",
  customAnimationUrl = null,
}: VoiceAssistantOrbProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dimensions = {
    sm: { container: 140, lottie: 130 },
    md: { container: 200, lottie: 180 },
    lg: { container: 280, lottie: 250 },
    xl: { container: 340, lottie: 310 },
  }[size];

  const lottieSource = customAnimationUrl || DEFAULT_LOTTIE_URL;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="group relative flex cursor-pointer items-center justify-center select-none outline-none transition-transform duration-300 hover:scale-105"
      style={{ width: dimensions.container, height: dimensions.container }}
      aria-label="Activate AI Voice Assistant"
    >
      {/* Ambient Pulsing Glow Halo */}
      <motion.div
        className="absolute inset-4 rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{
          background: isListening
            ? "radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(6, 182, 212, 0.3) 50%, transparent 70%)"
            : "radial-gradient(circle, rgba(0, 114, 255, 0.4) 0%, rgba(56, 189, 248, 0.25) 45%, transparent 75%)",
        }}
        animate={{
          scale: isListening ? [1, 1.2, 1] : [0.95, 1.08, 0.95],
          opacity: isListening ? [0.6, 0.85, 0.6] : [0.4, 0.65, 0.4],
        }}
        transition={{
          duration: isListening ? 1.6 : 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle outer acoustic aura ring */}
      <div
        className="absolute rounded-full border border-blue-400/20 pointer-events-none animate-pulse-ring"
        style={{ width: dimensions.lottie * 0.9, height: dimensions.lottie * 0.9 }}
      />

      {/* Main DotLottie Animation Component */}
      <div
        className="relative z-10 flex items-center justify-center"
        style={{ width: dimensions.lottie, height: dimensions.lottie }}
      >
        {mounted && (
          <DotLottieReact
            src={lottieSource}
            loop
            autoplay
            className="w-full h-full object-contain filter drop-shadow-[0_8px_24px_rgba(0,112,186,0.25)]"
          />
        )}
      </div>
    </div>
  );
}
