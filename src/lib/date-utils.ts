/**
 * Date utilities for consistent date calculations across the application
 */

/**
 * Get date ranges for common time periods
 * Centralizes date calculations to avoid duplication and ensure consistency
 */
export const getDateRanges = () => {
  const now = new Date();
  const dayInMs = 24 * 60 * 60 * 1000;

  return {
    // Last 7 days
    weekly: {
      gte: new Date(now.getTime() - 7 * dayInMs),
    },
    // Last 30 days
    monthly: {
      gte: new Date(now.getTime() - 30 * dayInMs),
    },
    // Last 90 days
    quarterly: {
      gte: new Date(now.getTime() - 90 * dayInMs),
    },
    // Current year
    yearly: {
      gte: new Date(now.getFullYear(), 0, 1),
    },
    // Today
    today: {
      gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
      lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
    },
  };
};

/**
 * Format date for display in admin panels
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDisplayDate(
  date: Date | string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  if (!date) return "N/A";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid Date";

    return new Intl.DateTimeFormat("en-AU", options).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}

/**
 * Calculate relative time (e.g., "2 days ago", "in 3 hours")
 * @param date - Date to calculate relative time for
 * @returns Relative time string
 */
export function getRelativeTime(
  date: Date | string | null | undefined
): string {
  if (!date) return "Unknown";

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "Invalid Date";

    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? "" : "s"} ago`;

    return formatDisplayDate(dateObj, { month: "short", day: "numeric" });
  } catch (error) {
    console.error("Error calculating relative time:", error);
    return "Unknown";
  }
}

/**
 * Check if a date is within a specific range
 * @param date - Date to check
 * @param range - Date range object with gte/lt properties
 * @returns Whether date is in range
 */
export function isDateInRange(
  date: Date | string | null | undefined,
  range: { gte?: Date; lt?: Date }
): boolean {
  if (!date) return false;

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return false;

    const time = dateObj.getTime();

    if (range.gte && time < range.gte.getTime()) return false;
    if (range.lt && time >= range.lt.getTime()) return false;

    return true;
  } catch (error) {
    console.error("Error checking date range:", error);
    return false;
  }
}
