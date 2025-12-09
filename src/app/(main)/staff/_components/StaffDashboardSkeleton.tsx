import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";

export function StaffDashboardSkeleton() {
  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      {/* Header - Instant */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Here&apos;s an overview of your schedule and tasks
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="gap-2 shrink-0 w-full sm:w-auto shadow-glow hover:shadow-glow-lg"
        >
          <Link href="/staff/available-shifts">
            <CalendarPlus className="h-4 w-4" />
            <span className="hidden xs:inline">Browse Available Shifts</span>
            <span className="xs:hidden">Available Shifts</span>
          </Link>
        </Button>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 xs:gap-5 sm:gap-6 grid-cols-1 xs:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-border/50 shadow-soft-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle className="text-base sm:text-lg">
                  Today&apos;s Schedule
                </CardTitle>
              </div>
              <Skeleton className="h-8 w-20" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/30"
                >
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-border/50 shadow-soft-lg">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle className="text-base sm:text-lg">
                  Quick Actions
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
