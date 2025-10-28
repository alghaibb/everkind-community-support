"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Save, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  useStaffList,
  useCreateShift,
  useUpdateShift,
} from "@/lib/queries/admin-queries";

// Validation schema
const shiftSchema = z.object({
  staffId: z.string().min(1, "Staff member is required"),
  shiftDate: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  notes: z.string().optional(),
});

type ShiftFormData = z.infer<typeof shiftSchema>;

interface Shift {
  id: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: string;
  notes?: string;
  staff: {
    id: string;
    user: {
      name: string;
    };
    staffRole: string;
    employeeId?: string;
  };
}

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
  editShift?: Shift;
}

export function ShiftModal({
  isOpen,
  onClose,
  initialDate,
  editShift,
}: ShiftModalProps) {
  // Fetch staff list
  const { data: staffData, isLoading: isLoadingStaff } = useStaffList({});
  const createShiftMutation = useCreateShift();
  const updateShiftMutation = useUpdateShift();

  const staff = staffData?.staff || [];
  const isSubmitting =
    createShiftMutation.isPending || updateShiftMutation.isPending;

  const form = useForm<ShiftFormData>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      staffId: "",
      shiftDate: "",
      startTime: "09:00",
      endTime: "17:00",
      notes: "",
    },
  });

  // Reset form when modal opens/closes or editShift changes
  useEffect(() => {
    if (isOpen) {
      if (editShift) {
        form.reset({
          staffId: editShift.staff.id,
          shiftDate: format(new Date(editShift.shiftDate), "yyyy-MM-dd"),
          startTime: editShift.startTime,
          endTime: editShift.endTime,
          notes: editShift.notes || "",
        });
      } else if (initialDate) {
        form.reset({
          staffId: "",
          shiftDate: format(initialDate, "yyyy-MM-dd"),
          startTime: "09:00",
          endTime: "17:00",
          notes: "",
        });
      } else {
        form.reset({
          staffId: "",
          shiftDate: "",
          startTime: "09:00",
          endTime: "17:00",
          notes: "",
        });
      }
    }
  }, [isOpen, editShift, initialDate, form]);

  const onSubmit = async (data: ShiftFormData) => {
    try {
      if (editShift) {
        await updateShiftMutation.mutateAsync({
          id: editShift.id,
          ...data,
        });
        toast.success("Shift updated successfully!");
      } else {
        await createShiftMutation.mutateAsync(data);
        toast.success("Shift created successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Shift submission error:", error);
      toast.error("Failed to save shift");
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {editShift ? "Edit Shift" : "Add New Shift"}
          </DialogTitle>
          <DialogDescription>
            {editShift
              ? "Update the shift details for this staff member."
              : "Create a new shift for a staff member."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="staffId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Staff Member</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingStaff}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingStaff ? (
                        <SelectItem value="" disabled>
                          Loading staff...
                        </SelectItem>
                      ) : staff.length === 0 ? (
                        <SelectItem value="" disabled>
                          No staff available
                        </SelectItem>
                      ) : (
                        staff.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.user.name} (
                            {member.staffRole.replace("_", " ")})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shiftDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoadingStaff}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting
                  ? "Saving..."
                  : editShift
                    ? "Update Shift"
                    : "Create Shift"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
