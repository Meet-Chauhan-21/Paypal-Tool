"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type OrbState =
  | "idle"
  | "listening"
  | "understanding"
  | "thinking"
  | "acting"
  | "approval"
  | "success"
  | "attention";

export const ORB_STATES = [
  "idle",
  "listening",
  "understanding",
  "thinking",
  "acting",
  "approval",
  "success",
  "attention",
] as const;

const PAYPAL_ICON = "https://i.postimg.cc/jSrv8kGC/Paypal-only-logo.png";

const ringColor: Record<OrbState, string> = {
  idle: "rgba(0,112,224,0.35)",
  listening: "rgba(0,112,224,0.5)",
  understanding: "rgba(0,112,224,0.55)",
  thinking: "rgba(0,112,224,0.55)",
  acting: "rgba(0,112,224,0.5)",
  approval: "rgba(180,101,11,0.45)",
  success: "rgba(15,138,78,0.5)",
  attention: "rgba(193,41,46,0.45)",
};

export function Orb({
  state = "idle",
  size = "md",
  level = 0,
  className,
}: {
  state?: OrbState;
  size?: "sm" | "md" | "lg";
  level?: number;
  className?: string;
}) {
  const dims = { sm: 56, md: 96, lg: 168 }[size];
  const iconScale = { sm: 0.42, md: 0.4, lg: 0.36 }[size];

  return (
    <div className={cn("relative grid place-items-center", className)} style={{ width: dims, height: dims }}>
      {/* outer ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ backgroundColor: ringColor[state] }}
        animate={
          state === "idle"
            ? { scale: [1, 1.08, 1], opacity: [0.5, 0.75, 0.5] }
            : { scale: [1, 1.18, 1], opacity: [0.55, 0.85, 0.55] }
        }
        transition={{ duration: state === "idle" ? 3.6 : 1.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* success ripple */}
      <AnimatePresence>
        {state === "success" && (
          <>
            <span className="absolute inset-0 rounded-full border-2 border-success animate-ripple" />
            <span className="absolute inset-0 rounded-full border-2 border-success animate-ripple [animation-delay:0.4s]" />
          </>
        )}
      </AnimatePresence>

      {/* orbit particles for thinking state */}
      {(state === "thinking" || state === "acting" || state === "understanding") && (
        <div className="absolute inset-[-10%] animate-orbit">
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand" />
          <span className="absolute bottom-0 right-0 h-1 w-1 rounded-full bg-brand-bright" />
          <span className="absolute left-0 top-1/3 h-1 w-1 rounded-full bg-brand" />
        </div>
      )}

      {/* waveform bars for listening */}
      {state === "listening" && (
        <div className="absolute inset-0 flex items-center justify-center gap-[3px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-brand/70"
              style={{ height: dims * 0.5 }}
              animate={{ scaleY: [0.25, 0.9 + level * 0.1, 0.3] }}
              transition={{ duration: 0.8 + i * 0.07, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
            />
          ))}
        </div>
      )}

      {/* core sphere */}
      <motion.div
        className="relative z-10 flex items-center justify-center rounded-full shadow-elevated"
        style={{
          width: dims * 0.78,
          height: dims * 0.78,
          background:
            state === "approval"
              ? "radial-gradient(circle at 32% 28%, #fff, #fcefdc 38%, #f3c988 100%)"
              : state === "attention"
                ? "radial-gradient(circle at 32% 28%, #fff, #fbdede 38%, #ef9a9d 100%)"
                : "radial-gradient(circle at 32% 28%, #ffffff, #cfe7ff 35%, #0070e0 100%)",
        }}
        animate={state === "idle" ? { scale: [1, 1.03, 1] } : { scale: [1, 1.05, 1] }}
        transition={{ duration: state === "idle" ? 3.6 : 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={PAYPAL_ICON}
          alt="PayPal"
          draggable={false}
          style={{ width: dims * iconScale, height: dims * iconScale, objectFit: "contain" }}
          className="select-none drop-shadow-sm"
        />
      </motion.div>
    </div>
  );
}

export function MiniWaveform({ active = true }: { active?: boolean }) {
  return (
    <div className="flex h-4 items-center gap-[2px]">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={cn("w-[2px] rounded-full bg-brand", active && "animate-wave")}
          style={{ height: "100%", animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </div>
  );
}
