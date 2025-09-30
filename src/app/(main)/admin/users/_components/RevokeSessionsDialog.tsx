"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal";
import { useRevokeUserSessions } from "@/lib/mutations/admin-mutations";
import { AdminUser } from "@/types/admin";
import { MODAL_TYPES } from "@/app/(main)/admin/constants";
import { LogOut, Info } from "lucide-react";

function RevokeSessionsDialog() {
  const { isOpen, type, data, onClose } = useModal();
  const revokeSessionsMutation = useRevokeUserSessions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isModalOpen = isOpen && type === MODAL_TYPES.REVOKE_SESSIONS;
  const user = data?.user as AdminUser | undefined;

  const handleRevoke = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await revokeSessionsMutation.mutateAsync(user.id);
      onClose();
    } catch (error) {
      console.error("Error revoking sessions:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <AlertDialog open={isModalOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-blue-600">
            <LogOut className="h-5 w-5" />
            Revoke User Sessions
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Session Revocation</h4>
              <p className="text-sm text-blue-700 mt-1">
                You are about to revoke all active sessions for{" "}
                <strong>{user.name}</strong>.
              </p>
              <p className="text-sm text-blue-700 mt-2">
                This will immediately log them out from all devices and they
                will need to sign in again.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">This action will:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Log out the user from all devices</li>
              <li>• Invalidate all current sessions</li>
              <li>• Require the user to sign in again</li>
              <li>• Take effect immediately</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRevoke}
              disabled={isSubmitting || revokeSessionsMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? "Revoking..." : "Revoke Sessions"}
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default RevokeSessionsDialog;
