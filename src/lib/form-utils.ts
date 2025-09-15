/**
 * Common form utilities and validation helpers
 */

/**
 * Validates if at least one availability slot is selected
 * @param availability - Availability data object
 * @returns boolean indicating if any time slot is selected
 */
export function hasAvailabilitySelected(
  availability: Record<string, { am: boolean; pm: boolean }> | undefined
): boolean {
  if (!availability || typeof availability !== "object") {
    return false;
  }

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  return days.some((day) => {
    const dayAvailability = availability[day];
    return dayAvailability && (dayAvailability.am || dayAvailability.pm);
  });
}

/**
 * Checks if a field value is considered empty
 * @param value - The field value to check
 * @returns boolean indicating if the field is empty
 */
export function isFieldEmpty(value: unknown): boolean {
  if (value === null || value === undefined || value === "") {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  return false;
}

/**
 * Creates a standardized error response for server actions
 * @param message - Error message to return
 * @param error - Optional error object for logging
 * @returns Standardized error response
 */
export function createErrorResponse(message: string, error?: unknown) {
  if (error) {
    console.error(message, error);
  }
  return { error: message };
}

/**
 * Creates a standardized success response for server actions
 * @param message - Success message to return
 * @returns Standardized success response
 */
export function createSuccessResponse(message: string) {
  return { success: message };
}
