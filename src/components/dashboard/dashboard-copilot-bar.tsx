"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Mic, ArrowRight, CornerDownLeft, ShieldCheck } from "lucide-react";
import { useHeyPayPal } from "@/components/hey-paypal";
import { routeForCommand } from "@/lib/intent";

const suggestions = [
  "Buy 30 business laptops under $30,000",
  "Compare cloud servers & renegotiate",
  "Review pending manager approvals",
  "Audit recurring SaaS software subscriptions",
];

export function DashboardCopilotBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const heyPaypal = useHeyPayPal();

  const handleSubmit = (cmdToRun?: string) => {
    const text = (cmdToRun ?? query).trim();
    if (!text) return;

    const target = routeForCommand(text);
    if (target.isProcurement) {
      router.push(`/procure?autorun=1&q=${encodeURIComponent(text)}`);
    } else {
      heyPaypal.open(text);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04)] backdrop-blur-sm transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/90 sm:p-6">
      {/* Subtle modern top accent */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600" />

      <div className="flex flex-col gap-4">
        {/* Header line with badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Sparkles size={15} />
            </span>
            <div>
              <h2 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Autonomous Procurement Copilot
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ask your AI agent to research, negotiate, or verify commercial purchases
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50/70 px-2.5 py-1 text-[11px] font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 sm:flex">
            <ShieldCheck size={13} className="text-blue-600 dark:text-blue-400" />
            <span>Policy Guardrails Active</span>
          </div>
        </div>

        {/* Neo-minimalist Omnibar Search Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-1.5 transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 dark:border-slate-700/80 dark:bg-slate-800/60 dark:focus-within:border-blue-500 dark:focus-within:bg-slate-900 dark:focus-within:ring-blue-950"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tell your agent: 'Order 25 Dell XPS monitors under $12,000' or 'Audit supplier price changes'…"
            className="w-full bg-transparent px-3 py-2 text-sm font-normal text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
          />

          <div className="flex items-center gap-1.5 pr-1">
            <button
              type="button"
              onClick={() => heyPaypal.open()}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-blue-400"
              title="Voice Prompt"
            >
              <Mic size={13} className="text-blue-600 dark:text-blue-400" />
              <span className="hidden md:inline">Voice</span>
            </button>

            <button
              type="submit"
              className="flex h-8 items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-500"
            >
              <span>Execute</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Suggested:
          </span>
          {suggestions.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => {
                setQuery(cmd);
                handleSubmit(cmd);
              }}
              className="rounded-lg border border-slate-200/70 bg-white px-2.5 py-1 text-xs text-slate-600 transition-colors hover:border-blue-400 hover:bg-blue-50/40 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:text-blue-400"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
