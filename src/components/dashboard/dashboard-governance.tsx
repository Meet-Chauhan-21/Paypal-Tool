"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Bot, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ApprovalItem {
  id: number;
  title: string;
  amount: number | string;
  status: string;
  risk: string;
  requestedBy: string;
}

interface AgentItem {
  id: string;
  name: string;
  role: string;
  status: string;
  dailyAllowance: number;
  processedAmount: number;
}

export function DashboardGovernance({
  approvals,
  agents,
}: {
  approvals: ApprovalItem[];
  agents: AgentItem[];
}) {
  const pending = approvals.filter((a) => a.status === "pending");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Pending Approvals Card */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div>
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Approvals Requiring Attention
              </h3>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                pending.length > 0
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
              }`}
            >
              {pending.length} Pending
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Commercial orders that exceeded agent limits or triggered spending threshold rules
          </p>

          <div className="flex flex-col gap-2.5">
            {pending.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                    Requested by <span className="font-medium text-slate-700 dark:text-slate-300">{item.requestedBy}</span> · Limit exception
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-semibold tabular-nums text-xs text-slate-900 dark:text-slate-100">
                    {formatCurrency(Number(item.amount))}
                  </span>
                  <Link
                    href="/approvals"
                    className="rounded-md bg-white border border-slate-200/90 px-2.5 py-1 text-xs font-medium text-blue-600 shadow-2xs hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700"
                  >
                    Review
                  </Link>
                </div>
              </div>
            ))}

            {pending.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-8 text-center dark:border-slate-800">
                <CheckCircle2 size={24} className="text-emerald-500 mb-1.5" />
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  All approvals cleared
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Autonomous agents are currently operating within pre-authorized parameters.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 dark:text-slate-500">Dual-custody verification active</span>
          <Link
            href="/approvals"
            className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Manage policies <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Autonomous Agent Fleet Status */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div>
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Autonomous Agent Fleet
              </h3>
            </div>
            <Link
              href="/agents"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              View all ({agents.length})
            </Link>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Active micro-agents executing specialized procurement &amp; treasury operations
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {agents.slice(0, 4).map((agent) => (
              <div
                key={agent.id}
                className="rounded-lg border border-slate-100 bg-slate-50/70 p-3 transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <span className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {agent.name}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {agent.role}
                </p>

                <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/50 pt-2 text-[10px] text-slate-500 dark:border-slate-700/50 dark:text-slate-400">
                  <span>Allowance: {formatCurrency(agent.dailyAllowance)}/d</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {formatCurrency(agent.processedAmount)} used
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 dark:text-slate-500">Autonomous sandbox execution</span>
          <Link
            href="/agents"
            className="flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Configure limits <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
