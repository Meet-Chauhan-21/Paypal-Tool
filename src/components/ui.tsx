"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/types";

export function Card({
  children,
  className,
  padding = "p-6",
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-subtle bg-surface shadow-soft", padding, className)}>
      {children}
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand">{eyebrow}</p>}
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

const buttonVariants = {
  primary: "bg-brand text-white hover:brightness-110 active:brightness-95 shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
  secondary: "bg-surface border border-subtle text-ink hover:bg-surface-hover",
  ghost: "text-ink hover:bg-surface-2",
  destructive: "bg-danger-soft text-danger hover:brightness-95 border border-transparent",
  outlineDanger: "border border-subtle text-danger hover:bg-danger-soft",
};

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  as,
  href,
  disabled,
  loading,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  variant?: keyof typeof buttonVariants;
  size?: "sm" | "md" | "lg";
  as?: "button" | "link";
  href?: string;
  loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizes = {
    sm: "h-8 px-3 text-[13px] gap-1.5",
    md: "h-10 px-4 text-sm gap-2",
    lg: "h-12 px-6 text-[15px] gap-2",
  };
  const classes = cn(
    "inline-flex items-center justify-center rounded-full font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
    buttonVariants[variant],
    sizes[size],
    className,
  );

  if (as === "link" && href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {loading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
      {children}
    </button>
  );
}

const badgeTones = {
  neutral: "bg-surface-2 text-muted",
  brand: "bg-brand-soft text-brand",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  icon,
}: {
  children: ReactNode;
  tone?: keyof typeof badgeTones;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        badgeTones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const map: Record<RiskLevel, { tone: keyof typeof badgeTones; label: string; dot: string }> = {
    low: { tone: "success", label: "Low risk", dot: "bg-success" },
    medium: { tone: "warning", label: "Medium risk", dot: "bg-warning" },
    high: { tone: "danger", label: "High risk", dot: "bg-danger" },
  };
  const r = map[risk];
  return (
    <Badge tone={r.tone}>
      <span className={cn("h-1.5 w-1.5 rounded-full", r.dot)} />
      {r.label}
    </Badge>
  );
}

export function StatusPill({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const map: Record<string, { tone: keyof typeof badgeTones; label: string }> = {
    pending: { tone: "warning", label: "Pending" },
    authorized: { tone: "brand", label: "Authorized" },
    captured: { tone: "success", label: "Captured" },
    failed: { tone: "danger", label: "Failed" },
    disputed: { tone: "danger", label: "Disputed" },
    refunded: { tone: "neutral", label: "Refunded" },
    approved: { tone: "success", label: "Approved" },
    rejected: { tone: "danger", label: "Rejected" },
    verified: { tone: "success", label: "Verified" },
    verifying: { tone: "brand", label: "Verifying" },
    ready: { tone: "success", label: "Ready" },
    review: { tone: "warning", label: "Needs review" },
    active: { tone: "success", label: "Active" },
    attention: { tone: "warning", label: "Needs attention" },
    paused: { tone: "neutral", label: "Paused" },
    underused: { tone: "warning", label: "Underused" },
    unused: { tone: "danger", label: "Unused" },
  };
  const s = map[normalized] ?? { tone: "neutral" as const, label: status };
  return <Badge tone={s.tone}>{s.label}</Badge>;
}

export function StatCard({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  tone?: "neutral" | "brand" | "success" | "warning";
}) {
  const toneText = {
    neutral: "text-ink",
    brand: "text-brand",
    success: "text-success",
    warning: "text-warning",
  };
  return (
    <Card padding="p-5">
      <p className="text-xs font-medium uppercase tracking-[0.06em] text-faint">{label}</p>
      <p className={cn("mt-2 text-[26px] font-semibold tabular leading-none", toneText[tone])}>{value}</p>
      {sub && <p className="mt-2 text-xs text-muted">{sub}</p>}
    </Card>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-subtle bg-surface-2/50 px-6 py-16 text-center">
      {icon && <div className="text-faint">{icon}</div>}
      <p className="text-[15px] font-medium text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  );
}

export function ProgressBar({ value, tone = "brand" }: { value: number; tone?: "brand" | "success" | "warning" }) {
  const toneBg = { brand: "bg-brand", success: "bg-success", warning: "bg-warning" };
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", toneBg[tone])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-subtle bg-surface-2 px-1 text-[11px] font-medium text-muted">
      {children}
    </kbd>
  );
}

export function AmountDisplay({ value, size = "md", tone = "neutral" }: { value: number; size?: "sm" | "md" | "lg" | "xl"; tone?: "neutral" | "success" | "brand" }) {
  const sizes = { sm: "text-sm", md: "text-lg", lg: "text-2xl", xl: "text-4xl" };
  const tones = { neutral: "text-ink", success: "text-success", brand: "text-brand" };
  return (
    <span className={cn("font-semibold tabular", sizes[size], tones[tone])}>
      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)}
    </span>
  );
}
