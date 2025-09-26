import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminQueryKeys } from "@/lib/queries/admin-queries";
import {
  ContactMessagesResponse,
  CareerApplicationsResponse,
} from "@/lib/types/admin";
import { deleteContactMessage } from "@/app/(main)/admin/messages/actions";
import { deleteCareerSubmission } from "@/app/(main)/admin/careers/actions";

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
