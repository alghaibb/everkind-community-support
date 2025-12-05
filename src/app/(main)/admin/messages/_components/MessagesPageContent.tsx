"use client";

import { useSearchParams } from "next/navigation";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import MessagesTable from "./MessagesTable";
import MessagesSearch from "./MessagesSearch";
import MessagesStats from "./MessagesStats";
import { useContactMessagesSuspense } from "@/lib/queries/admin-queries";
import { exportMessagesToCSV } from "@/lib/export-utils";

export function MessagesPageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");

  const { data } = useContactMessagesSuspense({
    search: search || undefined,
    page,
  });

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            Contact Messages
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage and respond to contact inquiries from families and potential
            clients.
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            if (data.messages) {
              exportMessagesToCSV(data.messages);
            }
          }}
          disabled={!data.messages?.length}
          className="gap-2 w-full sm:w-auto shrink-0"
        >
          <Download className="h-4 w-4" />
          <span className="hidden xs:inline">Export CSV</span>
          <span className="xs:hidden">Export</span>
        </Button>
      </div>

      <MessagesStats totalCount={data.totalCount} />
      <MessagesSearch />
      <MessagesTable
        messages={data.messages}
        totalPages={data.totalPages}
        currentPage={data.currentPage}
        totalCount={data.totalCount}
      />
    </div>
  );
}
