"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: Date;
  href: string;
}

interface RecentActivityProps {
  title: string;
  items: ActivityItem[];
  viewAllHref: string;
}

export default function RecentActivity({
  title,
  items,
  viewAllHref,
}: RecentActivityProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href={viewAllHref}>
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No recent activity
            </p>
          ) : (
            items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-start justify-between rounded-lg p-3 transition-colors hover:bg-accent"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatDistanceToNow(new Date(item.timestamp), {
                    addSuffix: true,
                  })}
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
