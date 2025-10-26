import { Suspense } from "react";
import { Metadata } from "next";
import { SchedulingContent } from "./_components/SchedulingContent";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Scheduling",
  description: "Manage staff schedules and shifts",
};

function SchedulingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function SchedulingPage() {
  return (
    <Suspense fallback={<SchedulingSkeleton />}>
      <SchedulingContent />
    </Suspense>
  );
}
