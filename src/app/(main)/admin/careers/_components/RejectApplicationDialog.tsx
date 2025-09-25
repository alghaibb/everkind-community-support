"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { CareerApplication } from "@/lib/types/admin";
import { rejectApplication } from "../actions";
import { useModal } from "@/hooks/use-modal";
import { MODAL_TYPES } from "../../constants";

export default function RejectApplicationDialog() {
  const { isOpen, type, data, onClose } = useModal();
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  const isModalOpen = isOpen && type === MODAL_TYPES.REJECT_APPLICATION;
  const application = data?.application as CareerApplication;

  const handleReject = () => {
    if (!application) return;

    startTransition(async () => {
      const result = await rejectApplication(
        application.id,
        reason.trim() || undefined
      );
      if ("success" in result) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
      }
      onClose();
      setReason("");
    });
  };

  const handleClose = () => {
    if (isPending) return;
    onClose();
    setReason("");
  };

  if (!application) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-lg">Reject Application</DialogTitle>
              <DialogDescription className="text-sm">
                {application.firstName} {application.lastName} -{" "}
                {application.role}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">This action cannot be undone</p>
                <p>
                  The applicant will be automatically notified via email at{" "}
                  <span className="font-medium">{application.email}</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for rejection (optional)
            </Label>
            <Textarea
              id="reason"
              placeholder="Provide additional context for internal records..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="resize-none"
              disabled={isPending}
            />
            <p className="text-xs text-muted-foreground">
              This reason is for internal records only and will not be shared
              with the applicant.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isPending}
            loading={isPending}
            loadingText="Rejecting..."
          >
            Reject & Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
