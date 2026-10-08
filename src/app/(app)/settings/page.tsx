import { SectionHeading } from "@/components/ui";
import { SettingsTabs } from "@/components/settings-tabs";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading eyebrow="Settings" title="Policies, profile & trust" description="Control how your agents behave, how PayPal is connected, and how transactions stay accountable." />
      <SettingsTabs />
    </div>
  );
}
