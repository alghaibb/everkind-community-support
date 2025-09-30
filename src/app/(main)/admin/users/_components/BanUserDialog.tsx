"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useModal } from "@/hooks/use-modal";
import { useBanUser } from "@/lib/mutations/admin-mutations";
import { AdminUser } from "@/types/admin";
import { MODAL_TYPES } from "@/app/(main)/admin/constants";
import { UserX, AlertTriangle } from "lucide-react";

const banUserSchema = z.object({
  reason: z
    .string()
    .min(1, "Reason is required")
    .max(500, "Reason must be less than 500 characters"),
});

type BanUserFormData = z.infer<typeof banUserSchema>;

function BanUserDialog() {
  const { isOpen, type, data, onClose } = useModal();
  const banUserMutation = useBanUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isModalOpen = isOpen && type === MODAL_TYPES.BAN_USER;
  const user = data?.user as AdminUser | undefined;

  const form = useForm<BanUserFormData>({
    resolver: zodResolver(banUserSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = async (formData: BanUserFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await banUserMutation.mutateAsync({
        id: user.id,
        reason: formData.reason,
      });
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error banning user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!user) return null;

  return (
    <AlertDialog open={isModalOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
            <UserX className="h-5 w-5" />
            Ban User
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-orange-50 border border-orange-200">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900">Warning</h4>
              <p className="text-sm text-orange-700 mt-1">
                You are about to ban <strong>{user.name}</strong>. This will:
              </p>
              <ul className="text-sm text-orange-700 mt-2 space-y-1">
                <li>• Revoke all active sessions</li>
                <li>• Prevent future logins</li>
                <li>• Mark the user as inactive</li>
              </ul>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for ban</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide a reason for banning this user..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  type="submit"
                  variant="destructive"
                  disabled={isSubmitting || banUserMutation.isPending}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {isSubmitting ? "Banning..." : "Ban User"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default BanUserDialog;
