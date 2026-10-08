"use client";

import { useState } from "react";
import { Mic, CheckCircle2 } from "lucide-react";
import { Card, SectionHeading, Button } from "@/components/ui";
import { Orb } from "@/components/orb";
import { sleep } from "@/lib/utils";

const script = [
  { speaker: "ai", text: "Your order contains 2 items for $86.40. Shipping is free. Would you like to continue?" },
  { speaker: "user", text: "Yes." },
  { speaker: "ai", text: "Your PayPal payment method ending in 4821 is selected. The final amount is $86.40. Would you like me to place the order?" },
  { speaker: "user", text: "Yes." },
  { speaker: "ai", text: "Payment completed." },
];

export default function AccessibilityPage() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  async function start() {
    setRunning(true);
    setStep(0);
    for (let i = 0; i < script.length; i++) {
      await sleep(700);
      setStep(i + 1);
    }
    setRunning(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Accessible Checkout"
        title="Talk me through checkout"
        description="A fully voice-guided checkout for screen readers, keyboard users, and anyone who prefers speaking over tapping."
      />

      <Card className="flex flex-col items-center gap-6 py-10 text-center">
        <Orb size="lg" state={running ? "listening" : "idle"} />
        <Button size="lg" onClick={start} disabled={running}>
          <Mic size={16} /> Talk me through checkout
        </Button>

        <div className="mx-auto flex w-full max-w-lg flex-col gap-3 text-left">
          {script.slice(0, step).map((line, idx) => (
            <div
              key={idx}
              className={`rounded-2xl px-4 py-2.5 text-sm shadow-soft ${
                line.speaker === "ai" ? "self-start bg-brand-soft text-brand-deep" : "self-end border border-subtle bg-surface text-ink"
              }`}
              style={{ alignSelf: line.speaker === "ai" ? "flex-start" : "flex-end", maxWidth: "85%" }}
            >
              {line.text}
            </div>
          ))}
          {step >= script.length && (
            <p className="mt-2 flex items-center justify-center gap-2 text-sm font-medium text-success">
              <CheckCircle2 size={16} /> Payment completed.
            </p>
          )}
        </div>
      </Card>

      <Card>
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-faint">Designed for</p>
        <div className="flex flex-wrap gap-2 text-sm text-muted">
          {["Screen readers", "Keyboard navigation", "Large text", "High contrast", "Voice interaction", "Reduced motion"].map((f) => (
            <span key={f} className="rounded-full border border-subtle bg-surface-2 px-3 py-1.5">{f}</span>
          ))}
        </div>
      </Card>
    </div>
  );
}
