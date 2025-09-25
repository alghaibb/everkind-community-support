"use client";

import { useSearchParams } from "next/navigation";
import MessagesTable from "./MessagesTable";
import MessagesSearch from "./MessagesSearch";
import MessagesStats from "./MessagesStats";
import { useContactMessagesSuspense } from "@/lib/queries/admin-queries";

export function MessagesPageContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");

  const { data } = useContactMessagesSuspense({
    search: search || undefined,
    page,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground">
          Manage and respond to contact inquiries from families and potential
          clients.
        </p>
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
