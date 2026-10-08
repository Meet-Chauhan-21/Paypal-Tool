import { listPayouts } from "@/server/data";
import { SectionHeading } from "@/components/ui";
import { PayoutsBoard } from "@/components/payouts-board";

export const dynamic = "force-dynamic";

export default async function PayoutsPage() {
  const payouts = await listPayouts();
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        eyebrow="Payout Command Center"
        title="Pay everyone, with exceptions caught first"
        description="“Hey PayPal, pay my 40 translators from this spreadsheet.” Review flagged records before releasing the batch."
      />
      <PayoutsBoard
        payouts={payouts.map((p) => ({
          ...p,
          units: Number(p.units),
          rate: Number(p.rate),
          amount: Number(p.amount),
        })) as any}
      />
    </div>
  );
}
