import Link from "next/link";
import { listActivity } from "@/server/data";
import { Card, SectionHeading, Badge } from "@/components/ui";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ActivityPage() {
  const activity = await listActivity(100);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Activity"
        title="Everything is accountable."
        description="Every request, decision, approval and payment — timestamped and explained."
      />
      <Card>
        <ol className="relative ml-3 flex flex-col gap-6 border-l border-subtle pl-6">
          {activity.map((a) => (
            <li key={a.id} className="relative">
              <span className="absolute -left-[31px] h-3 w-3 rounded-full border-2 border-brand bg-brand-soft" />
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-sm font-semibold text-ink">
                  <span className="text-brand">{a.actor}</span> · {a.action}
                </p>
                <p className="text-xs text-faint">{formatDateTime(a.createdAt as unknown as string)}</p>
              </div>
              {a.detail && <p className="mt-0.5 text-sm text-muted">{a.detail}</p>}
              {a.transactionId && (
                <Link href={`/transactions/${a.transactionId}`}>
                  <Badge tone="brand" className="mt-1.5">{a.transactionId}</Badge>
                </Link>
              )}
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
