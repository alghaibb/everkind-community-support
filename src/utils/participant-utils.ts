// Type guard for Prisma errors
export function isPrismaError(
  error: unknown
): error is { code: string; meta?: { target?: string[] } } {
  return (
    error !== null &&
    typeof error === "object" &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

// Handle participant-specific errors
export function handleParticipantError(error: unknown, action: string) {
  const actionText =
    action === "create" ? "create" : action === "update" ? "update" : "delete";

  if (isPrismaError(error)) {
    // Unique constraint violation
    if (error.code === "P2002") {
      const field = error.meta?.target?.[0];
      const fieldMessages = {
        ndisNumber: "A participant with this NDIS number already exists",
        email: "A participant with this email already exists",
        phone: "A participant with this phone number already exists",
      } as const;

      return {
        error:
          field && field in fieldMessages
            ? fieldMessages[field as keyof typeof fieldMessages]
            : "This participant already exists",
      };
    }

    // Record not found
    if (error.code === "P2025") {
      return { error: "Participant not found" };
    }
  }

  return { error: `Failed to ${actionText} participant. Please try again.` };
}

// Utility to serialize participant data for client
export function serializeParticipant(participant: {
  dateOfBirth: Date | string;
  planStartDate: Date | string;
  planEndDate: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  planBudget?: number | { toNumber(): number } | null;
  [key: string]: unknown;
}) {
  return {
    ...participant,
    dateOfBirth:
      participant.dateOfBirth instanceof Date
        ? participant.dateOfBirth.toISOString().split("T")[0]
        : participant.dateOfBirth,
    planStartDate:
      participant.planStartDate instanceof Date
        ? participant.planStartDate.toISOString().split("T")[0]
        : participant.planStartDate,
    planEndDate:
      participant.planEndDate instanceof Date
        ? participant.planEndDate.toISOString().split("T")[0]
        : participant.planEndDate,
    createdAt:
      participant.createdAt instanceof Date
        ? participant.createdAt.toISOString()
        : participant.createdAt,
    updatedAt:
      participant.updatedAt instanceof Date
        ? participant.updatedAt.toISOString()
        : participant.updatedAt,
    planBudget: participant.planBudget ? Number(participant.planBudget) : null,
  };
}
