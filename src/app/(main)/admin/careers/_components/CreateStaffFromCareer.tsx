"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, UserPlus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CareerSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  cert3IndividualSupport: string;
  ahpraRegistration?: string;
  covidVaccinations: string;
  influenzaVaccination: string;
  workingWithChildrenCheck: string;
  ndisScreeningCheck: string;
  policeCheck: string;
  workingRights: string;
  ndisModules: string;
  firstAidCPR: string;
  experience: string;
  availability: unknown;
  resume?: string;
  certificates: string[];
}

interface CreateStaffFromCareerProps {
  career: CareerSubmission;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateStaffFromCareer({
  career,
  open,
  onOpenChange,
}: CreateStaffFromCareerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const router = useRouter();

  const handleCreateStaff = async () => {
    if (!staffRole || !startDate) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/admin/staff/create-from-career", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          careerId: career.id,
          staffRole,
          startDate,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create staff account");
      }

      toast.success("Staff account created successfully! Welcome email sent.");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating staff account:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create staff account"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const staffRoleOptions = [
    { value: "SUPPORT_WORKER", label: "Support Worker" },
    { value: "ENROLLED_NURSE", label: "Enrolled Nurse" },
    { value: "REGISTERED_NURSE", label: "Registered Nurse" },
    { value: "COORDINATOR", label: "Coordinator" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
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
                {staffRoleOptions.map((option) => (
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
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateStaff} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Staff Account
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
