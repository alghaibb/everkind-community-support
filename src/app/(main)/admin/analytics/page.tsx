import { Metadata } from "next";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import AnalyticsPageClient from "./_components/AnalyticsPageClient";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description:
    "Comprehensive analytics and insights for EverKind Community Support operations, including participant metrics, staff performance, and financial data.",
};

export default async function AnalyticsPage() {
  const session = await getServerSession();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights into your organization&apos;s performance and
            growth
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <AnalyticsPageClient />
    </div>
  );
}
