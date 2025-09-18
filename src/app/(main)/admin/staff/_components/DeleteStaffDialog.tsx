"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteStaffAccount } from "../actions";

interface DeleteStaffDialogProps {
  staff: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  open: boolean;
  onClose: () => void;
}

export default function DeleteStaffDialog({
  staff,
  open,
  onClose,
}: DeleteStaffDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const result = await deleteStaffAccount(staff.id);

      if (result.success) {
        toast.success("Account deleted successfully");
        onClose();
        router.refresh();
      } else {
        toast.error("Failed to delete account", {
          description: result.error || "Please try again",
        });
      }
    } catch (error) {
      console.error("Error deleting staff account:", error);
      toast.error("An error occurred", {
        description: "Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Staff Account</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>Are you sure you want to delete this staff account?</p>
            <div className="rounded-lg border p-3 space-y-2 bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">{staff.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{staff.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Role:</span>
                <Badge
                  variant={staff.role === "ADMIN" ? "destructive" : "default"}
                >
                  {staff.role}
                </Badge>
              </div>
            </div>
            <p className="text-sm text-destructive font-medium">
              This action cannot be undone. All data associated with this
              account will be permanently deleted.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Account"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
