"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: how long data is considered fresh
            // 60s default for most data (dashboard stats, lists)
            staleTime: 60 * 1000, // 1 minute
            // Cache time: how long unused data stays in cache
            gcTime: 5 * 60 * 1000, // 5 minutes
            // Retry failed requests
            retry: (failureCount, error) => {
              // Don't retry on 4xx errors (client errors)
              if (error instanceof Response && error.status >= 400 && error.status < 500) {
                return false;
              }
              if (error instanceof Error) {
                const message = error.message.toLowerCase();
                if (message.includes('unauthorized') || message.includes('forbidden') || message.includes('not found')) {
                  return false;
                }
              }
              return failureCount < 2;
            },
            // Disable refetch on window focus (reduces unnecessary requests)
            refetchOnWindowFocus: false,
            // Disable refetch on reconnect for better perceived performance
            refetchOnReconnect: false,
            // Disable automatic background refetch
            refetchInterval: false,
            // Network mode for better offline support
            networkMode: 'online',
          },
          mutations: {
            // Retry mutations once on network errors only
            retry: (failureCount, error) => {
              // Don't retry client errors
              if (error instanceof Response && error.status >= 400 && error.status < 500) {
                return false;
              }
              return failureCount < 1;
            },
            // Network mode for mutations
            networkMode: 'online',
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
