import { SectionHeading, Card } from "@/components/ui";
import { ArrowDown } from "lucide-react";

const flow = [
  { title: "User", body: "Speaks or types a request in plain language." },
  { title: "Hey PayPal Voice Agent", body: "Captures intent and starts the conversation." },
  { title: "AI Orchestrator", body: "Breaks the request into research, negotiation and purchase steps." },
  { title: "Policy Engine", body: "Decides what the agent may do automatically — and what needs you." },
  { title: "PayPal Agent / MCP Layer", body: "Translates approved actions into PayPal API calls." },
  { title: "PayPal APIs", body: "Orders, Payments, Authorization, Capture, Payouts, Invoicing." },
  { title: "Commerce Action", body: "The real-world purchase, negotiation or payout happens." },
  { title: "Webhook / Event", body: "PayPal notifies the system as the transaction progresses." },
  { title: "AI Verification", body: "Confirms the outcome matches what was promised." },
  { title: "User", body: "Sees the result, the savings, and the full audit trail." },
];

export default function ArchitecturePage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Architecture"
        title="AI decides. Policy allows. PayPal executes."
        description="A simple mental model for how ProcurePilot keeps autonomous agents accountable."
      />

      <Card className="mx-auto flex w-full max-w-md flex-col items-center gap-1">
        {flow.map((f, idx) => (
          <div key={f.title} className="flex w-full flex-col items-center">
            <div className="w-full rounded-2xl border border-subtle bg-surface-2 px-4 py-3 text-center">
              <p className="text-sm font-semibold text-ink">{f.title}</p>
              <p className="mt-0.5 text-xs text-muted">{f.body}</p>
            </div>
            {idx < flow.length - 1 && <ArrowDown size={16} className="my-1.5 text-faint" />}
          </div>
        ))}
      </Card>

      <Card className="text-center">
        <p className="text-lg font-semibold text-ink">
          AI decides what needs to happen. Policy decides whether it's allowed.
          <br />
          PayPal executes the financial action. Events keep everything synchronized.
        </p>
      </Card>
    </div>
  );
}
