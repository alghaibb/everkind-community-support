"use client";

import { SearchInput } from "@/components/ui/search-input";

export default function MessagesSearch() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 max-w-md">
        <SearchInput
          placeholder="Search by name, email, or subject..."
          className="w-full pl-10"
        />
      </div>
    </div>
  );
}
