"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { CareerApplication } from "@/lib/types/admin";
import { createStaffFromCareer } from "../actions";
import { StaffRole } from "@/generated/prisma";
import { useModal } from "@/hooks/use-modal";
import { STAFF_ROLE_OPTIONS, MODAL_TYPES } from "../../constants";

export default function CreateStaffFromCareer() {
  const { isOpen, type, data, onClose } = useModal();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [startDate, setStartDate] = useState("");

  const isModalOpen = isOpen && type === MODAL_TYPES.CREATE_STAFF;
  const career = data?.application as CareerApplication;

  const handleCreateStaff = () => {
    if (!career || !staffRole || !startDate) {
      setError("Please fill in all required fields");
      return;
    }

    startTransition(async () => {
      setError("");
      const result = await createStaffFromCareer(
        career.id,
        staffRole as StaffRole,
        startDate
      );

      if ("success" in result) {
        toast.success(result.message);
        onClose();
      } else {
        setError(result.error);
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

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Name</Label>
              <p className="font-medium">
                {career.firstName} {career.lastName}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Email</Label>
              <p className="font-medium">{career.email}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">
              Applied Role
            </Label>
            <p className="font-medium">{career.role}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="staffRole">Staff Role *</Label>
            <Select value={staffRole} onValueChange={setStaffRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select staff role" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onClose()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateStaff}
            disabled={isPending}
            loading={isPending}
            loadingText="Creating Account..."
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create Staff Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
