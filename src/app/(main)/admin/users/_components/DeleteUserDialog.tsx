"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModal } from "@/hooks/use-modal";
import { useDeleteUser } from "@/lib/mutations/admin-mutations";
import { AdminUser } from "@/types/admin";
import { MODAL_TYPES } from "@/app/(main)/admin/constants";
import { Trash2, AlertTriangle } from "lucide-react";

function DeleteUserDialog() {
  const { isOpen, type, data, onClose } = useModal();
  const deleteUserMutation = useDeleteUser();
  const [confirmationText, setConfirmationText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isModalOpen = isOpen && type === MODAL_TYPES.DELETE_USER;
  const user = data?.user as AdminUser | undefined;

  const expectedText = "DELETE";
  const canDelete = confirmationText === expectedText;

  const handleDelete = async () => {
    if (!user || !canDelete) return;

    setIsSubmitting(true);
    try {
      await deleteUserMutation.mutateAsync(user.id);
      onClose();
      setConfirmationText("");
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setConfirmationText("");
    onClose();
  };

  if (!user) return null;

  return (
    <AlertDialog open={isModalOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 className="h-5 w-5" />
            Delete User
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">Danger Zone</h4>
              <p className="text-sm text-red-700 mt-1">
                You are about to permanently delete <strong>{user.name}</strong>
                . This action:
              </p>
              <ul className="text-sm text-red-700 mt-2 space-y-1">
                <li>• Cannot be undone</li>
                <li>• Will delete all user data</li>
                <li>• Will revoke all sessions</li>
                <li>• Will remove all associated records</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type <code className="bg-gray-100 px-1 rounded">DELETE</code> to
              confirm:
            </Label>
            <Input
              id="confirmation"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              disabled={
                !canDelete || isSubmitting || deleteUserMutation.isPending
              }
            >
              {isSubmitting ? "Deleting..." : "Delete User"}
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteUserDialog;
