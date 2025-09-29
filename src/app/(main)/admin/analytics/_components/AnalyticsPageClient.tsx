"use client";

import { useAnalytics } from "@/lib/queries/admin-queries";
import AnalyticsDashboard from "./AnalyticsDashboard";
import AnalyticsSkeleton from "./AnalyticsSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AnalyticsPageClient() {
  const { data: analytics, isLoading, error } = useAnalytics();

  if (isLoading) {
    return <AnalyticsSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Analytics</AlertTitle>
        <AlertDescription>
          Unable to load analytics data. Please try again later.
          {error instanceof Error && (
            <span className="block mt-2 text-sm">Error: {error.message}</span>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (!analytics) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data Available</AlertTitle>
        <AlertDescription>
          No analytics data is currently available.
        </AlertDescription>
      </Alert>
    );
  }

  return <AnalyticsDashboard analytics={analytics} />;
}
