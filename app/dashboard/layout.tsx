import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <DashboardSidebar />

            {/* Main content area - offset by sidebar width on desktop */}
            <main className="md:ml-64 min-h-screen">
                {children}
            </main>
        </div>
    );
}
