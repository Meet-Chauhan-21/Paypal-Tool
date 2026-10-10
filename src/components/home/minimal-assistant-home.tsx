"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Keyboard, ArrowRight } from "lucide-react";
import { VoiceAssistantOrb } from "@/components/common/voice-assistant-orb";
import { useHeyPayPal } from "@/components/common/hey-paypal";
import { routeForCommand } from "@/lib/intent";

export function MinimalAssistantHome() {
  const router = useRouter();
  const heyPaypal = useHeyPayPal();
  const [quickInput, setQuickInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleCommand = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const target = routeForCommand(trimmed);
    if (target.isProcurement) {
      router.push(`/procure?autorun=1&q=${encodeURIComponent(trimmed)}`);
    } else {
      heyPaypal.open(trimmed);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center text-center">
      {/* Central Animated Voice Assistant Orb (DotLottie) */}
      <div className="relative mb-6 flex items-center justify-center">
        <VoiceAssistantOrb
          size="lg"
          onClick={() => heyPaypal.open(undefined, true)}
        />
      </div>

      {/* Clean, Minimal Typography */}
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-4xl md:text-5xl">
        What would you like me to do?
      </h1>

      <p className="mt-3 max-w-lg text-sm text-slate-500 dark:text-slate-400 sm:text-base leading-relaxed">
        Ask your AI agent to research suppliers, negotiate discounts, or execute commercial orders.
      </p>

      {/* Primary Call to Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => heyPaypal.open(undefined, true)}
          className="group flex h-12 items-center gap-2.5 rounded-full bg-blue-600 px-6 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-95"
        >
          <Mic size={17} className="text-white transition-transform group-hover:scale-110" />
          <span>Talk to Assistant</span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white">
            Voice
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsTyping((v) => !v)}
          className="flex h-12 items-center gap-2 rounded-full border border-slate-200/90 bg-white px-5 text-sm font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Keyboard size={16} className="text-slate-400" />
          <span>Type a request</span>
        </button>
      </div>

      {/* Expandable Clean Text Input Bar */}
      <AnimatePresence>
        {isTyping && (
          <motion.form
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            onSubmit={(e) => {
              e.preventDefault();
              handleCommand(quickInput);
            }}
            className="mt-6 flex w-full max-w-md items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-800 dark:bg-slate-900"
          >
            <input
              type="text"
              autoFocus
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="e.g. Buy 30 Lenovo ThinkPads under $30,000..."
              className="h-10 flex-1 bg-transparent px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!quickInput.trim()}
              className="flex h-9 items-center gap-1 rounded-xl bg-blue-600 px-3.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
            >
              <span>Send</span>
              <ArrowRight size={13} />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
