"use client";

import Link from "next/link";
import { Plus, History, ShieldCheck, ExternalLink, Zap } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200/80 bg-blue-50/80 px-2.5 py-0.5 text-[11px] font-medium text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            PayPal Sandbox Active
          </span>
          <span className="rounded-full border border-slate-200/80 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
            Acme Labs · Autonomous Fleet
          </span>
        </div>

        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
          Procurement &amp; Commerce Intelligence
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
          Autonomous agents researching suppliers, negotiating commercial terms, and executing payments with PayPal guardrails.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <Link
          href="/activity"
          className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-medium text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <History size={14} />
          <span>Audit Log</span>
        </Link>

        <Link
          href="/procure"
          className="flex h-9 items-center gap-1.5 rounded-lg bg-blue-600 px-4 text-xs font-medium text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <Plus size={15} />
          <span>New AI Procurement</span>
        </Link>
      </div>
    </div>
  );
}
