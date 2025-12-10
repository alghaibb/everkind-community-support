/**
 * Performance monitoring hooks
 * Track and optimize runtime performance
 */

import { useEffect, useRef } from "react";

/**
 * Measure component render time
 * Only active in development
 */
export function useRenderTime(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      renderCount.current += 1;
      const renderTime = performance.now() - startTime.current;

      if (renderTime > 16) {
        // Longer than 1 frame (60fps)
        console.warn(
          `[Performance] ${componentName} render #${renderCount.current} took ${renderTime.toFixed(2)}ms`
        );
      }

      startTime.current = performance.now();
    }
  });
}

/**
 * Track route change performance
 */
export function useRoutePerformance() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const handleRouteChange = () => {
        const navEntry = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;

        if (navEntry) {
          console.log("[Performance] Route Metrics:", {
            "DNS Lookup": `${(navEntry.domainLookupEnd - navEntry.domainLookupStart).toFixed(2)}ms`,
            "TCP Connection": `${(navEntry.connectEnd - navEntry.connectStart).toFixed(2)}ms`,
            "TTFB": `${(navEntry.responseStart - navEntry.requestStart).toFixed(2)}ms`,
            "Response Time": `${(navEntry.responseEnd - navEntry.responseStart).toFixed(2)}ms`,
            "DOM Interactive": `${(navEntry.domInteractive - navEntry.fetchStart).toFixed(2)}ms`,
            "DOM Complete": `${(navEntry.domComplete - navEntry.fetchStart).toFixed(2)}ms`,
          });
        }
      };

      // Run after page load
      if (document.readyState === "complete") {
        handleRouteChange();
      } else {
        window.addEventListener("load", handleRouteChange);
        return () => window.removeEventListener("load", handleRouteChange);
      }
    }
  }, []);
}

/**
 * Monitor query waterfall
 * Helps identify sequential queries that should be parallel
 */
export function useQueryWaterfall(queryKeys: string[]) {
  const queryTimes = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      queryKeys.forEach((key) => {
        if (!queryTimes.current.has(key)) {
          queryTimes.current.set(key, performance.now());
        }
      });

      // Check for waterfall pattern (queries starting >100ms apart)
      const times = Array.from(queryTimes.current.entries());
      for (let i = 1; i < times.length; i++) {
        const [prevKey, prevTime] = times[i - 1];
        const [currKey, currTime] = times[i];
        const gap = currTime - prevTime;

        if (gap > 100) {
          console.warn(
            `[Performance] Query waterfall detected: ${prevKey} → ${currKey} (${gap.toFixed(2)}ms gap)`
          );
        }
      }
    }
  }, [queryKeys]);
}

/**
 * Debounce hook for search/filter inputs
 * Reduces unnecessary API calls
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Import useState
import { useState } from "react";
