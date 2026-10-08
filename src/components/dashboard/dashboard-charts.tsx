"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, ArrowUpRight, PieChart } from "lucide-react";

const trendData6M = [
  { month: "May", spend: 18400, budget: 25000, savings: 2100 },
  { month: "Jun", spend: 22800, budget: 25000, savings: 2900 },
  { month: "Jul", spend: 19600, budget: 25000, savings: 2400 },
  { month: "Aug", spend: 28400, budget: 32000, savings: 3600 },
  { month: "Sep", spend: 32100, budget: 35000, savings: 4800 },
  { month: "Oct", spend: 28200, budget: 35000, savings: 5200 },
];

const trendData30D = [
  { month: "Week 1", spend: 5400, budget: 8500, savings: 920 },
  { month: "Week 2", spend: 7800, budget: 8500, savings: 1340 },
  { month: "Week 3", spend: 6900, budget: 8500, savings: 1150 },
  { month: "Week 4", spend: 8100, budget: 8500, savings: 1790 },
];

const categoryData = [
  { name: "Hardware & Electronics", spend: 46800, percent: 42, color: "#0070ba" },
  { name: "Cloud & Infrastructure", spend: 24500, percent: 22, color: "#0284c7" },
  { name: "SaaS & Subscriptions", spend: 18900, percent: 17, color: "#38bdf8" },
  { name: "Logistics & Freight", spend: 12400, percent: 11, color: "#818cf8" },
  { name: "Professional Services", spend: 8900, percent: 8, color: "#94a3b8" },
];

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200/90 bg-white/95 p-3 shadow-md backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/95">
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</p>
        <div className="mt-1.5 flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> Spend:
            </span>
            <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">
              {formatCurrency(payload[0]?.value || 0)}
            </span>
          </div>
          {payload[1] && (
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Savings:
              </span>
              <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                {formatCurrency(payload[1]?.value || 0)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}

export function DashboardCharts() {
  const [timeframe, setTimeframe] = useState<"6M" | "30D">("6M");
  const data = timeframe === "6M" ? trendData6M : trendData30D;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Spend Trajectory Chart (2 columns on desktop) */}
      <div className="flex flex-col rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] dark:border-slate-800 dark:bg-slate-900 sm:p-6 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Spend Velocity &amp; AI Negotiated Savings
              </h3>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Historical commercial volume against budget authorization caps
            </p>
          </div>

          {/* Timeframe selector pills */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-800/80">
            <button
              type="button"
              onClick={() => setTimeframe("30D")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                timeframe === "30D"
                  ? "bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Last 30 Days
            </button>
            <button
              type="button"
              onClick={() => setTimeframe("6M")}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                timeframe === "6M"
                  ? "bg-white text-blue-600 shadow-xs dark:bg-slate-900 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              6 Months
            </button>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="spendColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0070ba" stopOpacity={0.22} />
                  <stop offset="95%" stopColor="#0070ba" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="savingsColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800/60" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="spend"
                stroke="#0070ba"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#spendColor)"
              />
              <Area
                type="monotone"
                dataKey="savings"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#savingsColor)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex items-center justify-end gap-5 border-t border-slate-100 pt-3 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            <span>Authorized Spend</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>AI Realized Savings</span>
          </div>
        </div>
      </div>

      {/* Category Spend Allocation (1 column on desktop) */}
      <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div>
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <PieChart size={16} className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Spend by Category
              </h3>
            </div>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              YTD Allocation
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Autonomous procurement volume distributed across key business categories
          </p>

          <div className="flex flex-col gap-3.5">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[170px]">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {formatCurrency(cat.spend)}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-[11px]">
                      {cat.percent}%
                    </span>
                  </div>
                </div>

                {/* Neo-minimalist progress bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs dark:border-slate-800 dark:bg-slate-800/40">
          <p className="font-medium text-slate-700 dark:text-slate-300">
            Active Guardrail Cap: $50,000 / month
          </p>
          <p className="mt-0.5 text-slate-500 dark:text-slate-400 text-[11px]">
            Autonomous transactions above $5,000 require manager two-factor approval.
          </p>
        </div>
      </div>
    </div>
  );
}
