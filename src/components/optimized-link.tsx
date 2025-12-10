/**
 * Optimized Link component with smart prefetching
 * Use this instead of Next Link for better performance
 */

import Link, { LinkProps } from "next/link";
import { AnchorHTMLAttributes, forwardRef } from "react";

interface OptimizedLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>,
    LinkProps {
  children: React.ReactNode;
  // Disable prefetch for heavy pages
  disablePrefetch?: boolean;
  // Priority prefetch for critical navigation (above fold)
  priority?: boolean;
}

/**
 * Smart Link component with optimized prefetching
 * 
 * - Prefetches by default (Next.js 16 behavior)
 * - Disable for heavy pages (large dashboards)
 * - Enable priority for above-fold links
 */
export const OptimizedLink = forwardRef<HTMLAnchorElement, OptimizedLinkProps>(
  function OptimizedLink(
    { children, disablePrefetch = false, priority = false, ...props },
    ref
  ) {
    return (
      <Link
        ref={ref}
        prefetch={disablePrefetch ? false : priority ? true : undefined}
        {...props}
      >
        {children}
      </Link>
    );
  }
);
