"use client";

import Link from "next/link";
import { ArrowRight, Receipt, ExternalLink, Sparkles, ShieldCheck } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { StatusPill } from "@/components/ui";

interface TransactionItem {
  id: string;
  merchant: string;
  amount: number | string;
  category: string;
  status: string;
  savings?: number | string | null;
  agentName?: string;
  createdAt: string | Date;
}

export function DashboardTransactionsTable({
  transactions,
}: {
  transactions: TransactionItem[];
}) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800 sm:px-6">
        <div className="flex items-center gap-2">
          <Receipt size={16} className="text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Recent Autonomous Transactions
          </h3>
        </div>
        <Link
          href="/transactions"
          className="group flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View all transactions
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-500">
              <th className="py-3 pl-5 sm:pl-6">Transaction ID &amp; Merchant</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3">Agent</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Negotiated Savings</th>
              <th className="py-3 pr-5 text-right sm:pr-6">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {transactions.slice(0, 5).map((t) => (
              <tr
                key={t.id}
                className="group transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
              >
                {/* ID & Merchant */}
                <td className="py-3.5 pl-5 sm:pl-6">
                  <Link
                    href={`/transactions/${t.id}`}
                    className="flex flex-col group-hover:text-blue-600 transition"
                  >
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {t.merchant}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500">
                      {t.id}
                    </span>
                  </Link>
                </td>

                {/* Category */}
                <td className="py-3.5 px-3">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {t.category}
                  </span>
                </td>

                {/* Agent */}
                <td className="py-3.5 px-3">
                  <span className="text-slate-600 dark:text-slate-400">
                    {t.agentName || "Procurement Agent"}
                  </span>
                </td>

                {/* Status Pill */}
                <td className="py-3.5 px-3">
                  <StatusPill status={t.status} />
                </td>

                {/* Savings */}
                <td className="py-3.5 px-3 text-right">
                  {Number(t.savings) > 0 ? (
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                      <Sparkles size={11} />
                      {formatCurrency(Number(t.savings))}
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500">—</span>
                  )}
                </td>

                {/* Amount (Dark navy/charcoal font, clear tabular number) */}
                <td className="py-3.5 pr-5 text-right font-semibold tabular-nums text-slate-900 dark:text-slate-100 sm:pr-6">
                  {formatCurrency(Number(t.amount))}
                </td>
              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 dark:text-slate-500">
                  No transactions recorded yet. Run your first procurement request!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
