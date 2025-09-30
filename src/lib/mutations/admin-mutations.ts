import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminQueryKeys } from "@/lib/queries/admin-queries";
import {
  ContactMessagesResponse,
  CareerApplicationsResponse,
  StaffResponse,
} from "@/types/admin";
import { deleteContactMessage } from "@/app/(main)/admin/messages/actions";
import { deleteCareerSubmission } from "@/app/(main)/admin/careers/actions";
import {
  createStaff,
  updateStaff,
  deleteStaff,
  toggleStaffStatus,
  UpdateStaffData,
} from "@/app/(main)/admin/staff/actions";
import {
  createParticipant,
  updateParticipant,
  deleteParticipant,
} from "@/app/(main)/admin/participants/actions";
import { UpdateParticipantFormData } from "@/lib/validations/participant.schema";
import { Participant } from "@/types/admin";

// Delete contact message mutation with optimistic updates
export function useDeleteContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      const result = await deleteContactMessage(messageId);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },

    // Optimistic update - remove message immediately
    onMutate: async (messageId: string) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.messages() });

      // Get all message list queries (different search params)
      const messageQueries = queryClient.getQueriesData({
        queryKey: adminQueryKeys.messages(),
      });

      // Store previous data for rollback
      const previousData = messageQueries.map(([queryKey, data]) => ({
        queryKey,
        data,
      }));

      // Optimistically remove the message from all queries
      messageQueries.forEach(([queryKey, data]) => {
        if (data && typeof data === "object" && "messages" in data) {
          const messagesData = data as ContactMessagesResponse;
          const updatedMessages = messagesData.messages.filter(
            (message) => message.id !== messageId
          );

          queryClient.setQueryData(queryKey, {
            ...messagesData,
            messages: updatedMessages,
            totalCount: messagesData.totalCount - 1,
          });
        }
      });

      return { previousData };
    },

    // On success, invalidate queries to get fresh data
    onSuccess: () => {
      toast.success("Contact message deleted successfully");
      // Invalidate to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.messages() });
    },

    // On error, rollback optimistic update
    onError: (error, messageId, context) => {
      console.error("Failed to delete message:", error);

      // Rollback optimistic updates
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error(
        error.message || "Failed to delete message. Please try again."
      );
    },
  });
}

// Delete career submission mutation with optimistic updates
export function useDeleteCareerSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (careerId: string) => {
      const result = await deleteCareerSubmission(careerId);
      if (result.error) {
        throw new Error(result.error);
      }
      return result;
    },

    // Optimistic update - remove career submission immediately
    onMutate: async (careerId: string) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.careers() });

      // Get all career list queries (different search params)
      const careerQueries = queryClient.getQueriesData({
        queryKey: adminQueryKeys.careers(),
      });

      // Store previous data for rollback
      const previousData = careerQueries.map(([queryKey, data]) => ({
        queryKey,
        data,
      }));

      // Optimistically remove the career submission from all queries
      careerQueries.forEach(([queryKey, data]) => {
        if (data && typeof data === "object" && "applications" in data) {
          const careerData = data as CareerApplicationsResponse;
          const updatedApplications = careerData.applications.filter(
            (application) => application.id !== careerId
          );

          queryClient.setQueryData(queryKey, {
            ...careerData,
            applications: updatedApplications,
            totalCount: careerData.totalCount - 1,
            stats: {
              ...careerData.stats,
              total: careerData.stats.total - 1,
              // Update weekly/monthly stats if needed (simplified for now)
              thisWeek: Math.max(
                0,
                careerData.stats.thisWeek - (Math.random() > 0.5 ? 1 : 0)
              ),
              thisMonth: Math.max(
                0,
                careerData.stats.thisMonth - (Math.random() > 0.5 ? 1 : 0)
              ),
            },
          });
        }
      });

      return { previousData };
    },

    // On success, invalidate queries to get fresh data
    onSuccess: () => {
      toast.success("Career submission deleted successfully");
      // Invalidate to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.careers() });
    },

    // On error, rollback optimistic update
    onError: (error, careerId, context) => {
      console.error("Failed to delete career submission:", error);

      // Rollback optimistic updates
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error(
        error.message || "Failed to delete career submission. Please try again."
      );
    },
  });
}

// Staff mutations
export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStaff,

    // Optimistic update - add new staff immediately
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.staff() });

      const staffQueries = queryClient.getQueriesData({
        queryKey: adminQueryKeys.staff(),
      });

      const previousData = staffQueries.map(([queryKey, data]) => ({
        queryKey,
        data,
      }));

      // Note: For create, we can't reliably add optimistic data without the generated ID
      // The success handler will invalidate and refetch

      return { previousData };
    },

    onSuccess: () => {
      toast.success("Staff member created successfully");
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.staff() });
    },

    onError: (error, newStaffData, context) => {
      console.error("Failed to create staff:", error);

      // Rollback optimistic updates
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error("Failed to create staff member. Please try again.");
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      staffId,
      data,
    }: {
      staffId: string;
      data: UpdateStaffData;
    }) => updateStaff(staffId, data),

    // Optimistic update - update staff immediately
    onMutate: async ({ staffId }) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.staff() });

      const staffQueries = queryClient.getQueriesData({
        queryKey: adminQueryKeys.staff(),
      });

      const previousData = staffQueries.map(([queryKey, data]) => ({
        queryKey,
        data,
      }));

      // Optimistically update the staff member in all queries
      staffQueries.forEach(([queryKey, data]) => {
        if (data && typeof data === "object" && "staff" in data) {
          const staffData = data as StaffResponse;
          const updatedStaff = staffData.staff.map((staff) =>
            staff.id === staffId ? { ...staff, ...data } : staff
          );

          queryClient.setQueryData(queryKey, {
            ...staffData,
            staff: updatedStaff,
          });
        }
      });

      return { previousData };
    },

    onSuccess: () => {
      toast.success("Staff member updated successfully");
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.staff() });
    },

    onError: (error, variables, context) => {
      console.error("Failed to update staff:", error);

      // Rollback optimistic updates
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error("Failed to update staff member. Please try again.");
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStaff,

    // Optimistic update - remove staff immediately
    onMutate: async (staffId: string) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.staff() });

      const staffQueries = queryClient.getQueriesData({
        queryKey: adminQueryKeys.staff(),
      });

      const previousData = staffQueries.map(([queryKey, data]) => ({
        queryKey,
        data,
      }));

      // Optimistically remove the staff member from all queries
      staffQueries.forEach(([queryKey, data]) => {
        if (data && typeof data === "object" && "staff" in data) {
          const staffData = data as StaffResponse;
          const updatedStaff = staffData.staff.filter(
            (staff) => staff.id !== staffId
          );

          queryClient.setQueryData(queryKey, {
            ...staffData,
            staff: updatedStaff,
            totalCount: staffData.totalCount - 1,
            stats: {
              ...staffData.stats,
              total: staffData.stats.total - 1,
              active: Math.max(0, staffData.stats.active - 1), // Approximate
            },
          });
        }
      });

      return { previousData };
    },

    onSuccess: () => {
      toast.success("Staff member deleted successfully");
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.staff() });
    },

    onError: (error, staffId, context) => {
      console.error("Failed to delete staff:", error);

      // Rollback optimistic updates
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error("Failed to delete staff member. Please try again.");
    },
  });
}

export function useToggleStaffStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleStaffStatus,

    // Optimistic update - toggle status immediately
    onMutate: async (staffId: string) => {
      await queryClient.cancelQueries({ queryKey: adminQueryKeys.staff() });

      const staffQueries = queryClient.getQueriesData({
        queryKey: adminQueryKeys.staff(),
      });

      const previousData = staffQueries.map(([queryKey, data]) => ({
        queryKey,
        data,
      }));

      // Optimistically toggle the staff status in all queries
      staffQueries.forEach(([queryKey, data]) => {
        if (data && typeof data === "object" && "staff" in data) {
          const staffData = data as StaffResponse;
          const updatedStaff = staffData.staff.map((staff) =>
            staff.id === staffId
              ? { ...staff, isActive: !staff.isActive }
              : staff
          );

          const activeCountChange = updatedStaff.find((s) => s.id === staffId)
            ?.isActive
            ? 1
            : -1;

          queryClient.setQueryData(queryKey, {
            ...staffData,
            staff: updatedStaff,
            stats: {
              ...staffData.stats,
              active: staffData.stats.active + activeCountChange,
            },
          });
        }
      });

      return { previousData };
    },

    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: adminQueryKeys.staff() });
    },

    onError: (error, staffId, context) => {
      console.error("Failed to toggle staff status:", error);

      // Rollback optimistic updates
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error("Failed to update staff status. Please try again.");
    },
  });
}

// Participant mutations
export function useCreateParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createParticipant,

    // For create, we can't reliably add optimistic data without the generated ID
    // The success handler will invalidate and refetch
    onSuccess: () => {
      toast.success("Participant created successfully");
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.participants(),
      });
    },

    onError: (error) => {
      console.error("Failed to create participant:", error);
      toast.error("Failed to create participant. Please try again.");
    },
  });
}

export function useUpdateParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateParticipant,

    // Optimistic update - update participant immediately
    onMutate: async ({
      id,
      ...updateData
    }: UpdateParticipantFormData & { id: string }) => {
      await queryClient.cancelQueries({
        queryKey: adminQueryKeys.participants(),
      });

      const participantQueries = queryClient.getQueriesData({
        queryKey: adminQueryKeys.participants(),
      });

      const previousData = participantQueries.map(([queryKey, data]) => ({
        queryKey,
        data,
      }));

      // Optimistically update the participant in all queries
      participantQueries.forEach(([queryKey, data]) => {
        if (data && typeof data === "object" && "participants" in data) {
          const participantsData = data as {
            participants: Participant[];
            total: number;
          };
          const updatedParticipants = participantsData.participants.map(
            (participant) =>
              participant.id === id
                ? { ...participant, ...updateData }
                : participant
          );

          queryClient.setQueryData(queryKey, {
            ...participantsData,
            participants: updatedParticipants,
          });
        }
      });

      return { previousData };
    },

    onSuccess: () => {
      toast.success("Participant updated successfully");
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.participants(),
      });
    },

    onError: (error, variables, context) => {
      console.error("Failed to update participant:", error);

      // Rollback optimistic updates
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error("Failed to update participant. Please try again.");
    },
  });
}

export function useDeleteParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteParticipant,

    // Optimistic update - remove participant immediately
    onMutate: async (participantId: string) => {
      await queryClient.cancelQueries({
        queryKey: adminQueryKeys.participants(),
      });

      const participantQueries = queryClient.getQueriesData({
        queryKey: adminQueryKeys.participants(),
      });

      const previousData = participantQueries.map(([queryKey, data]) => ({
        queryKey,
        data,
      }));

      // Optimistically remove the participant from all queries
      participantQueries.forEach(([queryKey, data]) => {
        if (data && typeof data === "object" && "participants" in data) {
          const participantsData = data as {
            participants: Participant[];
            total: number;
          };
          const updatedParticipants = participantsData.participants.filter(
            (participant) => participant.id !== participantId
          );

          queryClient.setQueryData(queryKey, {
            ...participantsData,
            participants: updatedParticipants,
            total: participantsData.total - 1,
          });
        }
      });

      return { previousData };
    },

    onSuccess: () => {
      toast.success("Participant deleted successfully");
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.participants(),
      });
    },

    onError: (error, participantId, context) => {
      console.error("Failed to delete participant:", error);

      // Rollback optimistic updates
      if (context?.previousData) {
        context.previousData.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error("Failed to delete participant. Please try again.");
    },
  });
}

// Custom Email Verification Toggle (Not available in Better Auth)
export function useToggleEmailVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { toggleEmailVerification } = await import(
        "@/app/(main)/admin/users/actions"
      );
      const result = await toggleEmailVerification(userId);
      if (!result.success) {
        throw new Error(result.error || "Failed to toggle email verification");
      }
      return result;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.usersList({}),
      });
    },
    onError: (error) => {
      console.error("Error toggling email verification:", error);
      toast.error("Failed to toggle email verification");
    },
  });
}

// Custom User Management Mutations (Working versions)
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      role?: "ADMIN" | "STAFF";
    }) => {
      const { updateUser } = await import("@/app/(main)/admin/users/actions");
      const result = await updateUser(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to update user");
      }
      return result.user;
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.usersList({}),
      });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { deleteUser } = await import("@/app/(main)/admin/users/actions");
      const result = await deleteUser(userId);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete user");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.usersList({}),
      });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    },
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; reason: string }) => {
      const { banUser } = await import("@/app/(main)/admin/users/actions");
      const result = await banUser(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to ban user");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("User banned successfully");
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.usersList({}),
      });
    },
    onError: (error) => {
      console.error("Error banning user:", error);
      toast.error("Failed to ban user");
    },
  });
}

export function useRevokeUserSessions() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { revokeUserSessions } = await import(
        "@/app/(main)/admin/users/actions"
      );
      const result = await revokeUserSessions(userId);
      if (!result.success) {
        throw new Error(result.error || "Failed to revoke sessions");
      }
      return result;
    },
    onSuccess: () => {
      toast.success("User sessions revoked successfully");
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.usersList({}),
      });
    },
    onError: (error) => {
      console.error("Error revoking sessions:", error);
      toast.error("Failed to revoke sessions");
    },
  });
}
