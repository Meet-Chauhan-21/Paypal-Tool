"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mic, ShieldCheck, Handshake, Gauge } from "lucide-react";
import { Orb } from "@/components/orb";
import { Button } from "@/components/ui";

const PAYPAL_LOGO = "https://i.postimg.cc/nL3Cy6gV/paypal-logo.png";

const pillars = [
  {
    icon: Mic,
    title: "Hey PayPal",
    body: "Speak or type naturally. One agent researches, compares and negotiates on your behalf.",
  },
  {
    icon: Handshake,
    title: "AI that negotiates",
    body: "Agents negotiate with suppliers in real time and show you exactly what they saved.",
  },
  {
    icon: ShieldCheck,
    title: "Guardrails, always on",
    body: "Spending limits, approval thresholds and blocked categories keep every agent in bounds.",
  },
  {
    icon: Gauge,
    title: "PayPal executes",
    body: "Authorization, capture, and proof-of-work verification — PayPal secures every transaction.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-app">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <img src={PAYPAL_LOGO} alt="PayPal" className="h-6 w-auto" />
          <span className="text-sm font-semibold text-faint">ProcurePilot</span>
        </div>
        <Button as="link" href="/home" variant="secondary" size="sm">
          Enter prototype <ArrowRight size={14} />
        </Button>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-10 text-center sm:pt-16">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-subtle bg-surface px-3 py-1 text-xs font-medium text-muted"
        >
          ProcurePilot — Hackathon Concept, inspired by PayPal
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 180, damping: 18 }}
          className="mx-auto mb-6 flex justify-center"
        >
          <Orb size="lg" state="idle" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-[clamp(2.4rem,6vw,4rem)] font-semibold leading-[1.05] tracking-tight text-ink"
        >
          Hey PayPal.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mx-auto mt-4 max-w-2xl text-lg text-muted sm:text-xl"
        >
          Your AI agent for trusted commerce. It researches, negotiates and purchases for you —
          while PayPal keeps every dollar controlled, transparent and safe.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Button as="link" href="/home" size="lg">
            Try “Hey PayPal” <ArrowRight size={16} />
          </Button>
          <Button as="link" href="/architecture" size="lg" variant="secondary">
            How it works
          </Button>
        </motion.div>

        <p className="mt-4 text-sm text-faint">
          Try: “Buy 30 business laptops under $30,000, delivered within 10 days, with a 3-year warranty.”
        </p>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 text-left sm:grid-cols-2">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-2xl border border-subtle bg-surface p-5 shadow-soft">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <p.icon size={18} />
              </div>
              <p className="text-[15px] font-semibold text-ink">{p.title}</p>
              <p className="mt-1 text-sm text-muted">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-20 max-w-3xl rounded-3xl border border-subtle bg-surface p-10 shadow-soft">
          <p className="text-2xl font-semibold leading-snug text-ink sm:text-3xl">
            AI can act. <span className="text-brand">You stay in control.</span>
          </p>
          <p className="mt-3 text-sm text-muted">
            ProcurePilot gives AI agents the ability to act in commerce while keeping humans in control
            of money, permissions and decisions. Procurement is the first use case — purchasing,
            negotiation, payouts, subscriptions, refunds and proof-of-work transactions are next.
          </p>
        </div>
      </main>

      <footer className="border-t border-subtle px-6 py-6 text-center text-xs text-faint">
        ProcurePilot | AI Commerce Prototype — not an official PayPal product.
      </footer>
    </div>
  );
}
