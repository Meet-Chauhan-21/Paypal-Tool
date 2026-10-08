"use client";

import { useState } from "react";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { Card, RiskBadge, StatusPill, AmountDisplay, EmptyState } from "@/components/ui";
import { Inbox } from "lucide-react";
import type { Transaction } from "@/lib/types";

const tabs = ["All", "Authorized", "Captured", "Pending", "Failed", "Disputed", "Refunded"];

export function TransactionsList({ transactions }: { transactions: Transaction[] }) {
  const [tab, setTab] = useState("All");
  const filtered = tab === "All" ? transactions : transactions.filter((t) => t.status.toLowerCase() === tab.toLowerCase());

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              tab === t ? "bg-brand text-white" : "bg-surface-2 text-muted hover:text-ink",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState icon={<Inbox size={28} />} title="No transactions here" description="Your commerce activity will appear here." />
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => (
          <Link key={t.id} href={`/transactions/${t.id}`}>
            <Card className="flex h-full flex-col gap-3 transition-colors hover:border-brand">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-ink">{t.merchant}</p>
                  <p className="text-xs text-muted">{t.purpose}</p>
                </div>
                <StatusPill status={t.status} />
              </div>
              <AmountDisplay value={Number(t.amount)} size="lg" />
              <div className="mt-auto flex items-center justify-between border-t border-soft pt-3 text-xs text-muted">
                <span>{t.agentName}</span>
                <RiskBadge risk={t.risk} />
              </div>
              <p className="text-[11px] text-faint">{formatDate(t.createdAt)} · {t.id}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
