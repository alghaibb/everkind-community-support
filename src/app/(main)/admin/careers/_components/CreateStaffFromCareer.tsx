"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserPlus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { CareerApplication } from "@/types/admin";
import dynamic from "next/dynamic";

const Select = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.Select),
  { ssr: false }
);
const SelectContent = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectContent),
  { ssr: false }
);
const SelectItem = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectItem),
  { ssr: false }
);
const SelectTrigger = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectTrigger),
  { ssr: false }
);
const SelectValue = dynamic(
  () => import("@/components/ui/select").then((mod) => mod.SelectValue),
  { ssr: false }
);

import { createStaffFromCareer } from "../actions";
import { useModal } from "@/hooks/use-modal";
import { STAFF_ROLE_OPTIONS, MODAL_TYPES } from "../../constants";
import {
  CreateStaffFromCareerFormData,
  createStaffFromCareerSchema,
} from "@/lib/validations/staff.schema";

export default function CreateStaffFromCareer() {
  const { isOpen, type, data, onClose } = useModal();
  const [isPending, startTransition] = useTransition();
  const career = data?.application as CareerApplication;

  const form = useForm<CreateStaffFromCareerFormData>({
    resolver: zodResolver(createStaffFromCareerSchema),
    defaultValues: {
      staffRole: "SUPPORT_WORKER",
      startDate: "",
    },
  });

  const isModalOpen = isOpen && type === MODAL_TYPES.CREATE_STAFF;

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      form.reset();
    }
  }, [isModalOpen, form]);

  const onSubmit = (formData: CreateStaffFromCareerFormData) => {
    if (!career) return;

    startTransition(async () => {
      const result = await createStaffFromCareer(
        career.id,
        formData.staffRole,
        formData.startDate
      );

      if ("success" in result) {
        toast.success(result.message);
        onClose();
        form.reset();
      } else {
        // Set form error if it's a validation error, otherwise show toast
        if (
          result.error.includes("already exists") ||
          result.error.includes("duplicate")
        ) {
          form.setError("root", {
            type: "manual",
            message: result.error,
          });
        } else {
          toast.error(result.error);
        }
      }
    });
  };

  if (!career) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Create Staff Account
          </DialogTitle>
          <DialogDescription>
            Convert this career application into a staff account. This will
            create login credentials and send a welcome email with temporary
            password.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormLabel className="text-sm text-muted-foreground">
                  Name
                </FormLabel>
                <p className="font-medium">
                  {career.firstName} {career.lastName}
                </p>
              </div>
              <div>
                <FormLabel className="text-sm text-muted-foreground">
                  Email
                </FormLabel>
                <p className="font-medium">{career.email}</p>
              </div>
            </div>

            <div>
              <FormLabel className="text-sm text-muted-foreground">
                Applied Role
              </FormLabel>
              <p className="font-medium">{career.role}</p>
            </div>

            <FormField
              control={form.control}
              name="staffRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff Role *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {STAFF_ROLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                loading={isPending}
                loadingText="Creating Account..."
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create Staff Account
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
