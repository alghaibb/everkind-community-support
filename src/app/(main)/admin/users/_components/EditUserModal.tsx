"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useModal } from "@/hooks/use-modal";
import { useUpdateUser } from "@/lib/mutations/admin-mutations";
import { AdminUser } from "@/types/admin";
import { MODAL_TYPES } from "@/app/(main)/admin/constants";
import { emailSchema, nameSchema } from "@/lib/validations/shared.schema";
import { User, Mail } from "lucide-react";

const editUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  emailVerified: z.boolean(),
  role: z.enum(["ADMIN", "STAFF"]).optional(),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

function EditUserModal() {
  const { isOpen, type, data, onClose } = useModal();
  const updateUserMutation = useUpdateUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isModalOpen = isOpen && type === MODAL_TYPES.EDIT_USER;
  const user = data?.user as AdminUser | undefined;

  const form = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      emailVerified: user?.emailVerified || false,
      role: (user?.role as "ADMIN" | "STAFF") || "STAFF",
    },
  });

  // Reset form when user changes or emailVerified changes
  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        role: (user.role as "ADMIN" | "STAFF") || "STAFF",
      });
    }
  }, [user, form]);

  const onSubmit = async (formData: EditUserFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        name: formData.name,
        email: formData.email,
        emailVerified: formData.emailVerified,
        role: formData.role,
      });
      onClose();
      form.reset();
    } catch (error) {
      console.error("Error updating user:", error);
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
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit User
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter user name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STAFF">Staff</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailVerified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Verified
                    </FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Mark this email as verified
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
                disabled={isSubmitting || updateUserMutation.isPending}
              >
                {isSubmitting ? "Updating..." : "Update User"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditUserModal;
