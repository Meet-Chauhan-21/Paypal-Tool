"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card } from "@/components/ui";

const spendTrend = [
  { month: "May", spend: 18200, savings: 1200 },
  { month: "Jun", spend: 22400, savings: 1800 },
  { month: "Jul", spend: 19800, savings: 2100 },
  { month: "Aug", spend: 27600, savings: 2600 },
  { month: "Sep", spend: 31200, savings: 3400 },
  { month: "Oct", spend: 28420, savings: 4820 },
];

const categorySpend = [
  { category: "Electronics", amount: 42800 },
  { category: "Software", amount: 21400 },
  { category: "Cloud Services", amount: 18600 },
  { category: "Contractor Payouts", amount: 12840 },
  { category: "Marketing", amount: 6200 },
];

const approvalTrend = [
  { week: "W1", approved: 8, rejected: 1 },
  { week: "W2", approved: 11, rejected: 0 },
  { week: "W3", approved: 7, rejected: 2 },
  { week: "W4", approved: 13, rejected: 1 },
];

const COLORS = ["#0070e0", "#009cde", "#37c279", "#e3a13c", "#8992a0"];

export function InsightsCharts() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <p className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-faint">Spend &amp; AI savings over time</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={spendTrend}>
            <defs>
              <linearGradient id="spend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0070e0" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0070e0" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="savings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#37c279" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#37c279" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--text-faint)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "var(--text-faint)" }} axisLine={false} tickLine={false} width={44} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }} />
            <Area type="monotone" dataKey="spend" stroke="#0070e0" fill="url(#spend)" strokeWidth={2} name="Spend" />
            <Area type="monotone" dataKey="savings" stroke="#37c279" fill="url(#savings)" strokeWidth={2} name="AI savings" />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <p className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-faint">Spend by category</p>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={categorySpend} dataKey="amount" nameKey="category" innerRadius={55} outerRadius={85} paddingAngle={3}>
              {categorySpend.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
          {categorySpend.map((c, i) => (
            <div key={c.category} className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              {c.category}
            </div>
          ))}
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <p className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-faint">Approval trends</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={approvalTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: "var(--text-faint)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "var(--text-faint)" }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", fontSize: 12 }} />
            <Bar dataKey="approved" fill="#0070e0" radius={[6, 6, 0, 0]} name="Approved" />
            <Bar dataKey="rejected" fill="#f06a6e" radius={[6, 6, 0, 0]} name="Rejected" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
