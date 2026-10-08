"use client";

import { useRouter } from "next/navigation";
import { Mic, ArrowRight, Keyboard } from "lucide-react";
import { useState } from "react";
import { Orb } from "@/components/orb";
import { useHeyPayPal } from "@/components/hey-paypal";
import { exampleCommands, routeForCommand } from "@/lib/intent";

export function HomeHero() {
  const heyPaypal = useHeyPayPal();
  const router = useRouter();
  const [text, setText] = useState("");

  const submitTyped = () => {
    if (!text.trim()) return;
    const target = routeForCommand(text);
    if (target.isProcurement) {
      router.push(`/procure?autorun=1&q=${encodeURIComponent(text)}`);
    } else {
      heyPaypal.open(text);
    }
  };

  return (
    <div className="flex flex-col items-center rounded-3xl border border-subtle bg-surface px-6 py-12 text-center shadow-soft sm:py-16">
      <Orb size="lg" state="idle" />
      <h1 className="mt-6 text-[clamp(1.8rem,4vw,2.6rem)] font-semibold tracking-tight text-ink">
        What would you like me to do?
      </h1>
      <p className="mt-2 max-w-lg text-sm text-muted sm:text-base">
        Ask me to buy, compare, negotiate, pay, or check anything across your business.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitTyped();
        }}
        className="mt-7 flex w-full max-w-xl items-center gap-2 rounded-full border border-subtle bg-surface-2 p-1.5 pl-5 shadow-soft"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Try saying: Buy 30 laptops under $30,000…"
          className="h-10 flex-1 bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
        />
        <button
          type="submit"
          className="flex h-10 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-medium text-white hover:brightness-110"
        >
          Ask <ArrowRight size={14} />
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
        <button
          onClick={() => heyPaypal.open()}
          className="flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white hover:brightness-110"
        >
          <Mic size={15} /> Talk to PayPal
        </button>
        <button
          onClick={() => document.getElementById("home-command-input")?.focus()}
          className="flex items-center gap-2 rounded-full border border-subtle bg-surface px-4 py-2 text-sm font-medium text-ink hover:bg-surface-2"
        >
          <Keyboard size={15} /> Type a request
        </button>
      </div>

      <div className="mt-8 w-full max-w-2xl">
        <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-faint">Try an example</p>
        <div className="flex flex-wrap justify-center gap-2">
          {exampleCommands.map((cmd) => (
            <button
              key={cmd}
              onClick={() => {
                const target = routeForCommand(cmd);
                if (target.isProcurement) {
                  router.push(`/procure?autorun=1&q=${encodeURIComponent(cmd)}`);
                } else {
                  heyPaypal.open(cmd);
                }
              }}
              className="rounded-full border border-subtle bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:border-brand hover:text-brand"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
