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
import { UserPlus, AlertCircle, Phone } from "lucide-react";
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
import {
  STATUS_OPTIONS,
  GENDER_OPTIONS,
  COMMUNICATION_METHOD_OPTIONS,
} from "../constants";

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
      gender: GENDER_OPTIONS[0].value,
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
      communicationMethod: COMMUNICATION_METHOD_OPTIONS[0].value,
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

  const handleFormResult = (result: {
    success?: boolean;
    error?: string;
    message?: string;
  }) => {
    if (result.success) {
      toast.success(result.message || "Participant created successfully");
      onClose();
      form.reset();
    } else if (result.error) {
      // Show validation errors on form, others as toast
      const isValidationError =
        result.error.includes("already exists") ||
        result.error.includes("duplicate") ||
        result.error.includes("not found");

      if (isValidationError) {
        form.setError("root", { type: "manual", message: result.error });
      } else {
        toast.error(result.error);
      }
    }
  };

  async function onSubmit(formData: CreateParticipantFormData) {
    startTransition(async () => {
      const result = await createParticipant(formData);
      handleFormResult(result);
    });
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] w-[95vw] sm:w-[90vw] p-0">
        <div className="flex flex-col max-h-[95vh]">
          {/* Header */}
          <DialogHeader className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-muted/30 to-muted/50">
            <DialogTitle className="flex items-center text-lg sm:text-xl font-semibold">
              <div className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 bg-primary/10 rounded-lg mr-2 sm:mr-3">
                <UserPlus className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
              </div>
              <span className="truncate">Add New Participant</span>
            </DialogTitle>
            <DialogDescription className="mt-1 text-sm">
              Register a new NDIS participant and set up their comprehensive
              support plan
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div
            className="flex-1 overflow-y-auto px-4 sm:px-6 py-4"
            style={{ maxHeight: "calc(95vh - 140px)" }}
          >
            <Form {...form}>
              <form
                id="participant-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 sm:space-y-8"
              >
                {form.formState.errors.root && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {form.formState.errors.root.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Personal Information */}
                <div className="bg-card rounded-lg sm:rounded-xl border p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg mr-3">
                      <UserPlus className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold">
                      Personal Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            First Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter first name"
                              className="h-11"
                              {...field}
                            />
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
                          <FormLabel className="text-sm font-medium">
                            Last Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter last name"
                              className="h-11"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mt-6">
                    <FormField
                      control={form.control}
                      name="preferredName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter preferred name"
                              {...field}
                            />
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

                  <div className="mt-6">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {GENDER_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-card rounded-lg sm:rounded-xl border p-4 sm:p-6 shadow-sm">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="flex items-center justify-center w-8 h-8 bg-secondary/50 rounded-lg mr-3">
                      <Phone className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold">
                      Contact Information
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
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
                            <Input
                              placeholder="Enter phone number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6">
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
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6">
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
                            <Input
                              placeholder="e.g., Parent, Sibling"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* NDIS Information */}
                <div className="bg-card rounded-lg sm:rounded-xl border p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold">
                    NDIS Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
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
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
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
                <div className="bg-card rounded-lg sm:rounded-xl border p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Medical Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
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
                <div className="bg-card rounded-lg sm:rounded-xl border p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6">
                  <h3 className="text-base sm:text-lg font-semibold">
                    Support Requirements
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
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
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select communication method" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {COMMUNICATION_METHOD_OPTIONS.map(
                                    (option) => (
                                      <SelectItem
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
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
              </form>
            </Form>
          </div>

          {/* Footer */}
          <div className="border-t bg-muted/30 px-4 sm:px-6 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end sm:gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
                className="h-10 sm:h-11 px-4 sm:px-6 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                loading={isPending}
                loadingText="Creating..."
                className="h-10 sm:h-11 px-4 sm:px-6 order-1 sm:order-2"
                form="participant-form"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Create Participant</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
