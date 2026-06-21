import { DemoSidebar } from "@/components/demo/sidebar";
import { DemoTopbar } from "@/components/demo/topbar";
import { AIAssistant } from "@/components/demo/ai-assistant";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <DemoSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <DemoTopbar />
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}
