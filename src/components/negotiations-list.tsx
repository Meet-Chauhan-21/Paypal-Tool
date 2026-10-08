"use client";

import { useState } from "react";
import { ChevronDown, Handshake } from "lucide-react";
import { Card, Badge, EmptyState } from "@/components/ui";
import { NegotiationThread } from "@/components/commerce";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Negotiation } from "@/lib/types";

export function NegotiationsList({ negotiations }: { negotiations: Negotiation[] }) {
  const [openId, setOpenId] = useState<number | null>(negotiations[0]?.id ?? null);

  if (negotiations.length === 0) {
    return <EmptyState icon={<Handshake size={28} />} title="No negotiations yet" description="Your agents haven't negotiated a deal yet." />;
  }

  return (
    <div className="flex flex-col gap-4">
      {negotiations.map((n) => {
        const open = openId === n.id;
        return (
          <Card key={n.id} className="flex flex-col gap-4">
            <button className="flex w-full items-center justify-between gap-3 text-left" onClick={() => setOpenId(open ? null : n.id)}>
              <div>
                <p className="text-[15px] font-semibold text-ink">{n.supplierName}</p>
                <p className="text-xs text-muted">{formatDate(n.createdAt)} · {n.transactionId ?? "Draft negotiation"}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="success">Saved {formatCurrency(n.savings)}</Badge>
                <ChevronDown size={16} className={cn("text-faint transition-transform", open && "rotate-180")} />
              </div>
            </button>

            <div className="grid grid-cols-3 gap-3 text-sm sm:grid-cols-4">
              <Stat label="Original" value={formatCurrency(n.originalTotal)} />
              <Stat label="Final" value={formatCurrency(n.finalTotal)} tone="brand" />
              <Stat label="Delivery" value={n.deliveryDays ? `${n.deliveryDays} days` : "—"} />
              <Stat label="Warranty" value={n.warrantyYears ? `${n.warrantyYears} years` : "—"} />
            </div>

            {open && (
              <div className="border-t border-soft pt-4">
                <NegotiationThread messages={n.messages} />
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function Stat({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "brand" }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <p className="text-xs text-faint">{label}</p>
      <p className={cn("mt-1 font-semibold tabular", tone === "brand" ? "text-brand" : "text-ink")}>{value}</p>
    </div>
  );
}
