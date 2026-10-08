import Link from "next/link";
import { Bot, ArrowRight } from "lucide-react";
import { listAgents } from "@/server/data";
import { Card, SectionHeading, StatusPill, AmountDisplay } from "@/components/ui";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const agents = await listAgents();

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Agents"
        title="Your AI agents"
        description="Every agent operates inside explicit permissions. Nothing happens outside the limits you set."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {agents.map((agent) => (
          <Link key={agent.id} href={`/agents/${agent.id}`}>
            <Card className="flex h-full flex-col gap-4 transition-colors hover:border-brand">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <Bot size={19} />
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink">{agent.name}</p>
                    <p className="text-xs text-muted">{agent.role}</p>
                  </div>
                </div>
                <StatusPill status={agent.status} />
              </div>
              <p className="text-sm text-muted">{agent.description}</p>
              <div className="mt-auto grid grid-cols-3 gap-3 border-t border-soft pt-4 text-sm">
                <div>
                  <p className="text-xs text-faint">Processed</p>
                  <AmountDisplay value={Number(agent.processedAmount)} size="sm" />
                </div>
                <div>
                  <p className="text-xs text-faint">Purchases</p>
                  <p className="font-semibold tabular text-ink">{agent.purchasesCount}</p>
                </div>
                <div>
                  <p className="text-xs text-faint">Saved</p>
                  <AmountDisplay value={Number(agent.savedAmount)} size="sm" tone="success" />
                </div>
              </div>
              {agent.lastAction && (
                <p className="text-xs text-faint">
                  {agent.lastActionAt && formatDateTime(agent.lastActionAt as unknown as string)} — {agent.lastAction}
                </p>
              )}
              <span className="flex items-center gap-1 text-xs font-medium text-brand">
                View agent <ArrowRight size={12} />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
