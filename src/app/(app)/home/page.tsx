import { MinimalAssistantHome } from "@/components/home/minimal-assistant-home";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)]">
      <MinimalAssistantHome />
    </div>
  );
}
