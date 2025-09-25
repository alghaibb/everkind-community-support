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
import { useDeleteContactMessage } from "@/lib/mutations/admin-mutations";
import { ContactMessage } from "@/lib/types/admin";

export default function DeleteContactMessageDialog() {
  const { isOpen, type, data, onClose } = useModal();
  const deleteMessageMutation = useDeleteContactMessage();

  const isModalOpen = isOpen && type === MODAL_TYPES.DELETE_CONTACT_MESSAGE;
  const message = data?.message as ContactMessage;

  if (!message) return null;

  const handleDelete = () => {
    deleteMessageMutation.mutate(message.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <AlertDialog open={isModalOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Contact Message</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Are you sure you want to delete this contact message from{" "}
          <strong>
            {message.firstName} {message.lastName}
          </strong>
          ?
          <br />
          <span className="text-sm text-muted-foreground mt-2 block">
            Subject: {message.subject}
          </span>
          <br />
          This action cannot be undone.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMessageMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMessageMutation.isPending}
            className="bg-destructive hover:bg-destructive/90"
          >
            {deleteMessageMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Message"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
