"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface MessagesStatsProps {
  totalCount: number;
}

export default function MessagesStats({ totalCount }: MessagesStatsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{totalCount}</div>
        <p className="text-xs text-muted-foreground">
          Contact inquiries received
        </p>
      </CardContent>
    </Card>
  );
}
