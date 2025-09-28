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
import { Textarea } from "@/components/ui/textarea";
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
import dynamic from "next/dynamic";

// Dynamically import Select components to avoid hydration mismatch
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

import { useModal } from "@/hooks/use-modal";
import { MODAL_TYPES } from "../../constants";
import {
  CreateParticipantFormData,
  createParticipantSchema,
} from "@/lib/validations/participant.schema";
import { createParticipant } from "../actions";

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "PENDING", label: "Pending" },
  { value: "DISCHARGED", label: "Discharged" },
];

export default function CreateParticipantModal() {
  const { isOpen, type, onClose } = useModal();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(createParticipantSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      preferredName: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      phone: "",
      address: "",
      emergencyContact: "",
      emergencyPhone: "",
      emergencyRelation: "",
      ndisNumber: "",
      planStartDate: "",
      planEndDate: "",
      planBudget: "",
      planManager: "",
      supportCoordinator: "",
      disabilities: [],
      medications: [],
      allergies: [],
      medicalNotes: "",
      supportNeeds: [],
      communicationMethod: "",
      behavioralNotes: "",
      status: "ACTIVE",
    },
  });

  const isModalOpen = isOpen && type === MODAL_TYPES.CREATE_PARTICIPANT;

  // Reset form when modal closes
  useEffect(() => {
    if (!isModalOpen) {
      form.reset();
    }
  }, [isModalOpen, form]);

  async function onSubmit(formData: CreateParticipantFormData) {
    startTransition(async () => {
      const result = await createParticipant(formData);

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
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Add New Participant
          </DialogTitle>
          <DialogDescription>
            Register a new NDIS participant and set up their support plan
            details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preferredName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter preferred name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter gender" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter full address"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact *</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="Contact phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyRelation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Parent, Sibling" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* NDIS Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">NDIS Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="ndisNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NDIS Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="4100000001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STATUS_OPTIONS.map((option) => (
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
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="planStartDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Start Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="planEndDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan End Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="planBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Budget ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="50000"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? Number(e.target.value) : ""
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="planManager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Manager</FormLabel>
                      <FormControl>
                        <Input placeholder="Plan manager name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supportCoordinator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Coordinator</FormLabel>
                      <FormControl>
                        <Input placeholder="Coordinator name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Medical Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="disabilities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Disabilities *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter disabilities (one per line)"
                          className="min-h-[80px]"
                          value={
                            Array.isArray(field.value)
                              ? field.value.join("\n")
                              : ""
                          }
                          onChange={(e) => {
                            const lines = e.target.value
                              .split("\n")
                              .filter((line) => line.trim());
                            field.onChange(lines);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Medications</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter medications (one per line)"
                          className="min-h-[80px]"
                          value={
                            Array.isArray(field.value)
                              ? field.value.join("\n")
                              : ""
                          }
                          onChange={(e) => {
                            const lines = e.target.value
                              .split("\n")
                              .filter((line) => line.trim());
                            field.onChange(lines);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter allergies (one per line)"
                          className="min-h-[60px]"
                          value={
                            Array.isArray(field.value)
                              ? field.value.join("\n")
                              : ""
                          }
                          onChange={(e) => {
                            const lines = e.target.value
                              .split("\n")
                              .filter((line) => line.trim());
                            field.onChange(lines);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="medicalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional medical information"
                          className="min-h-[60px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Support Requirements */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Support Requirements</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supportNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support Needs *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter support needs (one per line)"
                          className="min-h-[80px]"
                          value={
                            Array.isArray(field.value)
                              ? field.value.join("\n")
                              : ""
                          }
                          onChange={(e) => {
                            const lines = e.target.value
                              .split("\n")
                              .filter((line) => line.trim());
                            field.onChange(lines);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="communicationMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Communication Method</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Verbal, Sign Language"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="behavioralNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Behavioral Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Behavioral support information"
                            className="min-h-[60px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

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
                loadingText="Creating Participant..."
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create Participant
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
