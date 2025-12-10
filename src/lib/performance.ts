/**
 * Performance utilities for API caching and optimizations
 * Modern apps use smart caching to reduce server load and improve UX
 */

import { NextResponse } from "next/server";

/**
 * Cache durations for different data types
 * Tune these based on how frequently data changes
 */
export const CACHE_TIMES = {
  // Static data that rarely changes (roles, service types, etc.)
  STATIC: 60 * 60 * 24, // 24 hours
  // Semi-static data (staff profiles, participant info)
  SEMI_STATIC: 60 * 60, // 1 hour
  // Dynamic data (dashboard stats, schedules)
  DYNAMIC: 60, // 1 minute
  // Real-time data (notifications, active shifts)
  REALTIME: 10, // 10 seconds
  // No cache (mutations, sensitive data)
  NONE: 0,
} as const;

/**
 * Add caching headers to API responses
 * s-maxage = CDN/shared cache duration
 * stale-while-revalidate = serve stale content while fetching fresh data
 */
export function withCache(response: NextResponse, seconds: number) {
  if (seconds === 0) {
    // No cache - always fresh
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0"
    );
    return response;
  }

  const staleWhileRevalidate = Math.min(seconds * 5, 300); // Max 5 minutes SWR

  response.headers.set(
    "Cache-Control",
    `public, s-maxage=${seconds}, stale-while-revalidate=${staleWhileRevalidate}`
  );
  response.headers.set("CDN-Cache-Control", `max-age=${seconds}`);

  return response;
}

/**
 * Helper to create cached JSON responses
 */
export function cachedJson(data: unknown, cacheSeconds: number) {
  const response = NextResponse.json(data);
  return withCache(response, cacheSeconds);
}

/**
 * React Query stale times for different data types
 * Keep in sync with API cache times for best performance
 */
export const STALE_TIMES = {
  // Static data - never stale (fetched once per session)
  STATIC: Infinity,
  // Semi-static data - 15 minutes
  SEMI_STATIC: 15 * 60 * 1000,
  // Dynamic data - 60 seconds
  DYNAMIC: 60 * 1000,
  // Real-time data - 10 seconds
  REALTIME: 10 * 1000,
} as const;

/**
 * Helper to check if request is from browser or server
 */
export function isServerSide() {
  return typeof window === "undefined";
}

/**
 * Optimistic update helper for mutations
 */
export function optimisticUpdate<T>(
  queryClient: {
    setQueryData: (key: unknown[], updater: (old: T) => T) => void;
  },
  queryKey: unknown[],
  updater: (old: T) => T
) {
  queryClient.setQueryData(queryKey, updater);
}
