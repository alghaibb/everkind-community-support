"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { MODAL_TYPES } from "../../constants";
import { useModal } from "@/hooks/use-modal";
import { useDeleteCareerSubmission } from "@/lib/mutations/admin-mutations";
import { CareerApplication } from "@/types/admin";

export default function DeleteCareerSubmissionDialog() {
  const { isOpen, type, data, onClose } = useModal();
  const deleteSubmissionMutation = useDeleteCareerSubmission();

  const isModalOpen = isOpen && type === MODAL_TYPES.DELETE_CAREER_SUBMISSION;
  const application = data?.application as CareerApplication;

  if (!application) return null;

  const handleDelete = () => {
    deleteSubmissionMutation.mutate(application.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Career Submission</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Are you sure you want to delete this career application from{" "}
          <strong>
            {application.firstName} {application.lastName}
          </strong>
          ?
          <br />
          <span className="text-sm text-muted-foreground mt-2 block">
            Position: {application.role}
          </span>
          <br />
          This action cannot be undone.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteSubmissionMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSubmissionMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteSubmissionMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Application"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
