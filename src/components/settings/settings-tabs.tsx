"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck, Lock, Eye, Fingerprint, RefreshCw, Key, Check, AlertCircle } from "lucide-react";
import { Card, Badge, Button } from "@/components/common/ui";
import { cn } from "@/lib/utils";
import { COMPANY } from "@/lib/mock-data";

const tabs = ["Policies", "Profile", "Integrations", "Security & Trust"];

const policies = [
  { condition: "Purchase amount > $1,000", action: "Require human approval" },
  { condition: "Merchant is not on the approved list", action: "Require approval" },
  { condition: "Category = Office Equipment AND Amount < $500", action: "Auto-approve" },
  { condition: "Price increase > 10% on renewal", action: "Require approval" },
  { condition: "Payout 2x higher than recipient average", action: "Flag for review" },
  { condition: "Refund amount > $250", action: "Require human approval" },
];

const services = ["Orders v2 API", "Payment Authorizations", "Instant Capture", "Webhooks & Events", "Refunds Engine", "Dispute Resolution", "Invoicing", "Payouts API"];

export function SettingsTabs() {
  const [tab, setTab] = useState("Policies");
  const [paypalStatus, setPaypalStatus] = useState<{
    configured: boolean;
    connected: boolean;
    environment: string;
    clientIdMasked: string | null;
    message: string;
  } | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

  const checkPayPalStatus = async () => {
    setCheckingStatus(true);
    try {
      const res = await fetch("/api/paypal/status");
      const data = await res.json();
      setPaypalStatus(data);
    } catch {
      setPaypalStatus({
        configured: false,
        connected: false,
        environment: "sandbox",
        clientIdMasked: null,
        message: "Failed to connect to PayPal status endpoint",
      });
    } finally {
      setCheckingStatus(false);
    }
  };

  useEffect(() => {
    if (tab === "Integrations" && !paypalStatus) {
      void checkPayPalStatus();
    }
  }, [tab, paypalStatus]);

  return (
    <div className="flex flex-col gap-5">
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

      {tab === "Policies" && (
        <Card>
          <p className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-faint">Spending policy rules</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {policies.map((r, idx) => (
              <div key={idx} className="rounded-xl border border-subtle bg-surface-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-faint">If</p>
                <p className="mt-1 text-sm font-medium text-ink">{r.condition}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-faint">Then</p>
                <p className="mt-1 text-sm font-medium text-brand">{r.action}</p>
              </div>
            ))}
          </div>
          <Button variant="secondary" size="sm" className="mt-4">Add a rule</Button>
        </Card>
      )}

      {tab === "Profile" && (
        <Card className="flex flex-col gap-4">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-faint">Company profile</p>
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-deep text-lg font-semibold text-white">A</span>
            <div>
              <p className="text-[15px] font-semibold text-ink">{COMPANY.name}</p>
              <p className="text-xs text-muted">{COMPANY.plan}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 border-t border-soft pt-4 text-sm sm:grid-cols-3">
            <div>
              <p className="text-xs text-faint">Balance</p>
              <p className="font-semibold tabular text-ink">${COMPANY.balance.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-faint">Owner</p>
              <p className="font-semibold text-ink">Parth</p>
            </div>
            <div>
              <p className="text-xs text-faint">Role</p>
              <p className="font-semibold text-ink">Admin</p>
            </div>
          </div>
        </Card>
      )}

      {tab === "Integrations" && (
        <div className="flex flex-col gap-5">
          <Card className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[15px] font-semibold text-ink">PayPal Sandbox Environment</p>
                <p className="text-xs text-muted">
                  ProcurePilot connects to PayPal Sandbox REST APIs for secure autonomous commerce.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={paypalStatus?.connected ? "success" : paypalStatus?.configured ? "warning" : "brand"}>
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      paypalStatus?.connected
                        ? "bg-success"
                        : paypalStatus?.configured
                          ? "bg-warning"
                          : "bg-brand",
                    )}
                  />
                  {paypalStatus?.connected
                    ? "Sandbox Connected (Live)"
                    : paypalStatus?.configured
                      ? "Verifying Credentials"
                      : "Sandbox Mode (Ready)"}
                </Badge>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={checkingStatus}
                  loading={checkingStatus}
                  onClick={checkPayPalStatus}
                >
                  <RefreshCw size={12} className={cn(checkingStatus && "animate-spin")} />
                  Test Connection
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-subtle bg-surface-2 p-3.5">
                <p className="text-xs font-medium text-faint">Target Environment</p>
                <p className="mt-1 font-semibold text-ink uppercase tracking-wider text-xs">
                  {paypalStatus?.environment ?? "sandbox"}
                </p>
              </div>
              <div className="rounded-xl border border-subtle bg-surface-2 p-3.5">
                <p className="text-xs font-medium text-faint">Client ID Status</p>
                <p className="mt-1 font-semibold text-ink">
                  {paypalStatus?.clientIdMasked ? (
                    <span className="font-mono text-xs">{paypalStatus.clientIdMasked}</span>
                  ) : (
                    <span className="text-xs text-muted">Ready for configuration</span>
                  )}
                </p>
              </div>
              <div className="rounded-xl border border-subtle bg-surface-2 p-3.5">
                <p className="text-xs font-medium text-faint">API Gateway</p>
                <p className="mt-1 font-mono text-xs text-ink truncate">api-m.sandbox.paypal.com</p>
              </div>
            </div>

            {paypalStatus && (
              <div
                className={cn(
                  "flex items-start gap-2.5 rounded-xl border p-3 text-xs",
                  paypalStatus.connected
                    ? "border-success/30 bg-success-soft text-success"
                    : "border-brand/30 bg-brand-soft text-brand-deep",
                )}
              >
                {paypalStatus.connected ? <Check size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
                <div>
                  <p className="font-medium">{paypalStatus.message}</p>
                  {!paypalStatus.configured && (
                    <p className="mt-1 text-muted">
                      Add your <code className="font-mono text-ink">PAYPAL_CLIENT_ID</code> and{" "}
                      <code className="font-mono text-ink">PAYPAL_CLIENT_SECRET</code> into <code className="font-mono text-ink">.env.local</code> to run live transactions against your PayPal Developer Sandbox account.
                    </p>
                  )}
                </div>
              </div>
            )}
          </Card>

          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-faint">Connected PayPal APIs</p>
              <span className="text-xs text-muted">8 services active</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {services.map((s) => (
                <div key={s} className="flex items-center gap-2 rounded-xl border border-subtle bg-surface-2 px-3 py-2 text-xs font-medium text-ink">
                  <CheckCircle2 size={14} className="text-success shrink-0" /> {s}
                </div>
              ))}
            </div>
            <div className="mt-2 rounded-xl border border-subtle bg-surface-2 p-3.5 text-xs text-muted">
              <p className="font-medium text-ink mb-1">Sandbox Configuration Note:</p>
              All transactions executed in this environment utilize the PayPal Sandbox REST endpoints. Real funds are never moved. You can view mock test cards and accounts in your PayPal Developer dashboard under Sandbox Accounts.
            </div>
          </Card>
        </div>
      )}

      {tab === "Security & Trust" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { icon: Lock, title: "Your money", body: "Protected by approval policies and spending limits." },
            { icon: ShieldCheck, title: "Your agents", body: "Bound by explicit permissions and category rules." },
            { icon: Eye, title: "Your transactions", body: "Tracked end-to-end through PayPal's trust layer." },
            { icon: Fingerprint, title: "Your decisions", body: "Recorded permanently in the audit trail." },
          ].map((t) => (
            <Card key={t.title} className="flex flex-col gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <t.icon size={17} />
              </span>
              <p className="text-[15px] font-semibold text-ink">{t.title}</p>
              <p className="text-sm text-muted">{t.body}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
