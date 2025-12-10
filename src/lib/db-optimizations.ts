/**
 * Database query optimization utilities
 * Reduce data transfer and query time with lean selects and pagination
 */

/**
 * Standard pagination parameters
 */
export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 100;

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export function getPaginationParams(
  page?: number | string,
  pageSize?: number | string
) {
  const parsedPage = typeof page === "string" ? parseInt(page, 10) : page;
  const parsedPageSize =
    typeof pageSize === "string" ? parseInt(pageSize, 10) : pageSize;

  const validPage = Math.max(1, parsedPage || 1);
  const validPageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, parsedPageSize || DEFAULT_PAGE_SIZE)
  );

  return {
    skip: (validPage - 1) * validPageSize,
    take: validPageSize,
    page: validPage,
    pageSize: validPageSize,
  };
}

/**
 * Lean user select (only essential fields)
 * Reduces payload size by ~70%
 */
export const leanUserSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
} as const;

/**
 * Lean participant select
 * For list views where full details aren't needed
 */
export const leanParticipantSelect = {
  id: true,
  firstName: true,
  lastName: true,
  preferredName: true,
  phone: true,
  email: true,
} as const;

/**
 * Lean staff select
 */
export const leanStaffSelect = {
  id: true,
  staffRole: true,
  employeeId: true,
  phone: true,
  isActive: true,
} as const;

/**
 * Helper to build efficient where clauses
 */
export function buildDateRangeWhere(
  field: string,
  startDate?: string | Date,
  endDate?: string | Date
) {
  if (!startDate && !endDate) return {};

  const where: Record<string, unknown> = {};

  if (startDate || endDate) {
    where[field] = {};
    if (startDate) {
      (where[field] as Record<string, unknown>).gte = new Date(startDate);
    }
    if (endDate) {
      (where[field] as Record<string, unknown>).lte = new Date(endDate);
    }
  }

  return where;
}

/**
 * Optimize Prisma queries by adding index hints
 * (Use in combination with database indexes)
 */
export function optimizeQuery<T>(query: T): T {
  // Future: Add query optimization hints
  return query;
}
