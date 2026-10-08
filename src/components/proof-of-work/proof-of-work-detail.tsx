"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileSearch, Loader2, ShieldQuestion } from "lucide-react";
import { Card, Button, AmountDisplay, StatusPill, Badge } from "@/components/common/ui";
import { VerificationChecklist } from "@/components/common/commerce";
import { sleep } from "@/lib/utils";
import type { ProofOfWork } from "@/lib/types";

export function ProofOfWorkDetail({ item: initial }: { item: ProofOfWork }) {
  const [item, setItem] = useState(initial);
  const [verifying, setVerifying] = useState(false);
  const [progress, setProgress] = useState(-1);
  const [showDispute, setShowDispute] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const failedCount = item.criteria.filter((c) => c.passed === false).length;
  const isAuthorizedOnly = item.status === "authorized";

  async function runVerification() {
    setVerifying(true);
    setProgress(-1);
    for (let i = 0; i < item.criteria.length; i++) {
      await sleep(320);
      setProgress(i);
    }
    await sleep(300);
    const score = 91;
    const res = await fetch(`/api/proof-of-work/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "verified",
        qualityScore: score,
        criteria: item.criteria.map((c) => ({ ...c, passed: true })),
      }),
    });
    const data = await res.json();
    setItem((prev) => ({ ...prev, ...data.item, criteria: data.item.criteria }));
    setVerifying(false);
  }

  async function capturePayment() {
    setBusy(true);
    const res = await fetch(`/api/proof-of-work/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "captured" }),
    });
    const data = await res.json();
    setItem((prev) => ({ ...prev, ...data.item }));
    setBusy(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[15px] font-semibold text-ink">{item.title}</p>
          <p className="text-sm text-muted">{item.counterparty}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <AmountDisplay value={Number(item.amount)} size="lg" tone="brand" />
          <StatusPill status={item.status} />
        </div>
      </Card>

      <Card>
        <p className="mb-1 text-sm font-medium text-ink">Payment state</p>
        <p className="mb-5 text-xs text-muted">
          {item.status === "captured"
            ? "Payment released after verification passed."
            : item.status === "verified"
              ? "Authorized — verified, ready to capture."
              : item.status === "failed"
                ? "Authorization remains protected — payment was not captured."
                : "Authorized — not captured. Funds are held until work is verified."}
        </p>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-faint">Verification criteria</p>
        <VerificationChecklist items={progress >= 0 ? item.criteria.map((c, i) => ({ ...c, passed: i <= progress ? true : null })) : item.criteria} />

        {isAuthorizedOnly && (
          <div className="mt-6">
            <Button loading={verifying} onClick={runVerification}>
              {verifying ? <Loader2 size={14} className="animate-spin" /> : <FileSearch size={14} />} Run AI Verification
            </Button>
          </div>
        )}

        {item.status === "verified" && (
          <div className="mt-6 flex flex-col gap-4 border-t border-soft pt-5">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-ink">AI quality score</p>
              <span className="text-lg font-semibold text-success">{item.qualityScore}%</span>
            </div>
            <p className="text-xl font-semibold text-ink">Work verified</p>
            <div className="flex gap-3">
              <Button loading={busy} onClick={capturePayment}>Release Payment — ${Number(item.amount).toLocaleString()}</Button>
              <Button variant="secondary">Review Evidence</Button>
            </div>
          </div>
        )}

        {item.status === "captured" && (
          <div className="mt-6 flex items-center gap-2 rounded-xl bg-success-soft p-4 text-success">
            <CheckCircle2 size={18} /> Payment captured and settled.
          </div>
        )}

        {item.status === "failed" && (
          <div className="mt-6 flex flex-col gap-4 border-t border-soft pt-5">
            <p className="text-xl font-semibold text-ink">Verification failed</p>
            <p className="text-sm text-muted">
              The submitted work does not meet {failedCount} of the {item.criteria.length} agreed requirements.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary">Request Revision</Button>
              <Button variant="secondary">Review Evidence</Button>
              <Button variant="outlineDanger" onClick={() => setShowDispute((v) => !v)}>
                <ShieldQuestion size={14} /> Open Dispute Summary
              </Button>
            </div>

            {showDispute && (
              <div className="rounded-2xl border border-subtle bg-surface-2 p-5">
                <p className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-faint">AI Dispute Summary</p>
                <div className="mb-3 flex flex-wrap gap-2 text-xs">
                  <Badge tone="brand">{item.id}</Badge>
                  <Badge tone="neutral">${Number(item.amount).toLocaleString()}</Badge>
                </div>
                <p className="text-sm text-ink">
                  The delivered work partially satisfies the agreed requirements. {failedCount} critical
                  requirement{failedCount === 1 ? "" : "s"} remain incomplete.
                </p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-faint">Suggested resolution</p>
                <p className="text-sm text-ink">Request revision before payment capture.</p>
                <p className="mt-3 text-xs text-muted">Confidence: 92%</p>
              </div>
            )}
          </div>
        )}
      </Card>

      <Button variant="ghost" className="w-fit" onClick={() => router.push("/proof-of-work")}>
        Back to proof of work
      </Button>
    </div>
  );
}
