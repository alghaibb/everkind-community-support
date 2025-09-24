"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FilterContextType {
  search: string;
  setSearch: (search: string) => void;
  page: number;
  setPage: (page: number) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
  initialSearch?: string;
  initialPage?: number;
}

export function FilterProvider({
  children,
  initialSearch = "",
  initialPage = 1,
}: FilterProviderProps) {
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);

  const clearFilters = () => {
    setSearch("");
    setPage(1);
  };

  return (
    <FilterContext.Provider
      value={{
        search,
        setSearch,
        page,
        setPage,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
}
