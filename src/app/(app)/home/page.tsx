import { listAgents, listApprovals, listTransactions, getInsights } from "@/server/data";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardCopilotBar } from "@/components/dashboard/dashboard-copilot-bar";
import { DashboardKPIs } from "@/components/dashboard/dashboard-kpis";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardTransactionsTable } from "@/components/dashboard/dashboard-transactions-table";
import { DashboardGovernance } from "@/components/dashboard/dashboard-governance";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [agents, approvals, transactions, insights] = await Promise.all([
    listAgents(),
    listApprovals(),
    listTransactions(),
    getInsights(),
  ]);

  const pendingApprovals = approvals.filter((a) => a.status === "pending");
  const pendingAmount = pendingApprovals.reduce((sum, a) => sum + Number(a.amount || 0), 0);
  const moneyAuthorized = transactions
    .filter((t) => t.status === "authorized" || t.status === "captured")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const activeAgents = agents.filter((a) => a.status === "active").length;

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Level 1: Executive Dashboard Header */}
      <DashboardHeader />

      {/* Level 2: Modern Neo-Minimalist AI Copilot Omnibar */}
      <DashboardCopilotBar />

      {/* Level 3: Financial Performance Metrics (Neo-minimalist KPIs) */}
      <DashboardKPIs
        totalAuthorized={moneyAuthorized}
        totalSavings={insights.savings}
        pendingCount={pendingApprovals.length}
        pendingAmount={pendingAmount}
        activeAgentsCount={activeAgents}
        totalTransactions={transactions.length}
      />

      {/* Level 4: Fintech Visual Analytics (Spend Trends & Category Breakdown) */}
      <DashboardCharts />

      {/* Level 5: Recent Transactions Table */}
      <DashboardTransactionsTable transactions={transactions} />

      {/* Level 6: Governance & Fleet Health */}
      <DashboardGovernance approvals={approvals} agents={agents} />
    </div>
  );
}
