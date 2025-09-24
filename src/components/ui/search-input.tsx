"use client";

import { useEffect, useState } from "react";
import { Input } from "./input";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  paramName?: string;
  onSearch?: (value: string) => void;
}

export function SearchInput({
  placeholder = "Search...",
  className = "pl-10",
  debounceMs = 300,
  paramName = "search",
  onSearch,
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get(paramName) || "");
  const debouncedValue = useDebounce(value, debounceMs);

  useEffect(() => {
    if (debouncedValue !== searchParams.get(paramName)) {
      if (onSearch) {
        onSearch(debouncedValue);
      } else {
        const params = new URLSearchParams(searchParams.toString());

        if (debouncedValue) {
          params.set(paramName, debouncedValue);
        } else {
          params.delete(paramName);
        }

        // Reset to page 1 when search changes
        params.set("page", "1");

        router.push(`?${params.toString()}`, { scroll: false });
      }
    }
  }, [debouncedValue, paramName, router, searchParams, onSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={className}
      />
    </div>
  );
}
