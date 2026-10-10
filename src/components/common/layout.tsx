"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Home,
  ShoppingCart,
  Bot,
  Receipt,
  CheckCircle2,
  Handshake,
  ShieldCheck,
  BarChart3,
  History,
  Settings,
  Repeat,
  TrendingUp,
  Banknote,
  Undo2,
  Network,
  Accessibility,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  Command,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme";
import { useHeyPayPal } from "@/components/common/hey-paypal";

const PAYPAL_LOGO = "https://i.postimg.cc/nL3Cy6gV/paypal-logo.png";

export const primaryNav = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/procure", label: "Procure", icon: ShoppingCart },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/transactions", label: "Transactions", icon: Receipt },
  { href: "/approvals", label: "Approvals", icon: CheckCircle2 },
  { href: "/negotiations", label: "Negotiations", icon: Handshake },
  { href: "/proof-of-work", label: "Proof of Work", icon: ShieldCheck },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/activity", label: "Activity", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const secondaryNav = [
  { href: "/subscriptions", label: "Subscription Bodyguard", icon: Repeat },
  { href: "/cashflow", label: "Cashflow Copilot", icon: TrendingUp },
  { href: "/payouts", label: "Payout Center", icon: Banknote },
  { href: "/refunds", label: "Refund Referee", icon: Undo2 },
  { href: "/accessibility", label: "Accessible Checkout", icon: Accessibility },
  { href: "/architecture", label: "Architecture", icon: Network },
];

export const mobileNav = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/activity", label: "Activity", icon: History },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/approvals", label: "Approvals", icon: CheckCircle2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function NavLink({ href, label, icon: Icon, onClick }: { href: string; label: string; icon: any; onClick?: () => void }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/home" && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition-colors",
        active ? "bg-brand-soft text-brand" : "text-muted hover:bg-surface-2 hover:text-ink",
      )}
    >
      <Icon size={17} strokeWidth={2} />
      {label}
    </Link>
  );
}

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <aside className="flex h-full w-60 flex-col rounded-2xl border border-subtle bg-surface px-3 py-5 shadow-soft overflow-hidden">
      <Link href="/home" className="flex items-center gap-2 px-2 pb-5">
        <img src={PAYPAL_LOGO} alt="PayPal" className="h-5 w-auto" />
        <span className="text-[13px] font-semibold text-faint">ProcurePilot</span>
      </Link>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto scrollbar-thin">
        {primaryNav.map((item) => (
          <NavLink key={item.href} {...item} onClick={onNavigate} />
        ))}
        <p className="mb-1 mt-5 px-3 text-[11px] font-semibold uppercase tracking-wider text-faint">More tools</p>
        {secondaryNav.map((item) => (
          <NavLink key={item.href} {...item} onClick={onNavigate} />
        ))}
      </nav>
      <div className="mt-4 rounded-xl border border-subtle bg-surface-2 px-3 py-3">
        <p className="text-[11px] font-medium text-faint">ProcurePilot — Hackathon Concept</p>
        <p className="mt-0.5 text-[11px] text-faint">AI commerce prototype, not an official PayPal product.</p>
      </div>
    </aside>
  );
}

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { theme, toggle } = useTheme();
  const heyPaypal = useHeyPayPal();
  const [showNotifs, setShowNotifs] = useState(false);

  const notifications = [
    { title: "Approval required", detail: "Your agent wants to spend $2,400.", tone: "warning" },
    { title: "Savings found", detail: "AI identified $740 potential annual savings.", tone: "success" },
    { title: "Payment protected", detail: "Payment authorized, awaiting verification.", tone: "brand" },
    { title: "Risk detected", detail: "Supplier price increased by 12%.", tone: "danger" },
  ];

  return (
    <header className="flex h-14 items-center justify-between gap-3 border-b border-subtle bg-surface/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMenu} className="rounded-lg p-1.5 text-muted hover:bg-surface-2 lg:hidden">
          <Menu size={20} />
        </button>
        <button
          onClick={() => heyPaypal.open()}
          className="hidden items-center gap-2 rounded-full border border-subtle bg-surface-2 px-3 py-1.5 text-sm text-muted transition-colors hover:border-brand hover:text-brand sm:flex"
        >
          <Command size={14} />
          Ask PayPal
          <span className="ml-1 rounded border border-subtle bg-surface px-1.5 py-0.5 text-[10px] text-faint">⌘K</span>
        </button>
        <button
          onClick={() => heyPaypal.open()}
          className="flex items-center gap-2 rounded-full bg-brand px-3 py-1.5 text-sm font-medium text-white sm:hidden"
        >
          <Mic size={14} /> Hey PayPal
        </button>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <span className="hidden items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-medium text-success md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> Demo mode — Acme Labs
        </span>
        <div className="relative">
          <button
            onClick={() => setShowNotifs((v) => !v)}
            className="relative rounded-full p-2 text-muted hover:bg-surface-2"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-danger" />
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-11 w-80 rounded-2xl border border-subtle bg-surface p-2 shadow-elevated">
              <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-faint">Notifications</p>
              {notifications.map((n) => (
                <div key={n.title} className="flex items-start gap-2.5 rounded-xl px-2 py-2 hover:bg-surface-2">
                  <span
                    className={cn(
                      "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                      n.tone === "warning" && "bg-warning",
                      n.tone === "success" && "bg-success",
                      n.tone === "brand" && "bg-brand",
                      n.tone === "danger" && "bg-danger",
                    )}
                  />
                  <div>
                    <p className="text-[13px] font-medium text-ink">{n.title}</p>
                    <p className="text-xs text-muted">{n.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={toggle} className="rounded-full p-2 text-muted hover:bg-surface-2" aria-label="Toggle theme">
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand-deep text-xs font-semibold text-white">
          P
        </button>
      </div>
    </header>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <div className="flex h-dvh overflow-hidden bg-app">
      <div className="hidden lg:flex p-3 shrink-0">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 flex h-full p-3">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
            <div className="ml-2 pt-1">
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-subtle bg-surface text-muted shadow-soft hover:text-ink"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-thin lg:pb-10">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
        </main>
      </div>

      {/* mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-subtle bg-surface/95 py-2 backdrop-blur-sm lg:hidden">
        {mobileNav.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("flex flex-col items-center gap-0.5 px-2 py-1 text-[10px]", active ? "text-brand" : "text-faint")}
            >
              <Icon size={19} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
