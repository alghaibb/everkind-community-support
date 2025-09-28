"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { User, Phone, Award, Shield, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { StaffMember } from "@/types/admin";
import { useModal } from "@/hooks/use-modal";
import { useUpdateStaff } from "@/lib/mutations/admin-mutations";
import { MODAL_TYPES, STAFF_ROLE_OPTIONS } from "../../constants";
import {
  EditStaffFormData,
  editStaffSchema,
} from "@/lib/validations/staff.schema";

const NDIS_MODULES = [
  "Module 1: Understanding Disability",
  "Module 2: Communication",
  "Module 3: Legal and Ethical",
  "Module 4: Service Planning",
  "Module 5: Daily Living Skills",
  "Module 6: Behaviour Support",
  "Module 7: Health and Safety",
] as const;

export default function EditStaffModal() {
  const { isOpen, type, data, onClose } = useModal();
  const updateStaffMutation = useUpdateStaff();

  const isModalOpen = isOpen && type === MODAL_TYPES.EDIT_STAFF;
  const staff = data?.staff as StaffMember;

  const form = useForm({
    resolver: zodResolver(editStaffSchema),
    defaultValues: {
      staffRole: "SUPPORT_WORKER",
      employeeId: "",
      startDate: "",
      endDate: "",
      phone: "",
      emergencyContact: "",
      emergencyPhone: "",
      address: "",
      cert3IndividualSupport: false,
      ahpraRegistration: "",
      covidVaccinations: false,
      influenzaVaccination: false,
      workingWithChildrenCheck: false,
      ndisScreeningCheck: false,
      policeCheck: false,
      firstAidCPR: false,
      workingRights: false,
      ndisModules: [],
      hourlyRate: "",
    },
  });

  // Initialize form data when staff data is available
  useEffect(() => {
    if (staff && isModalOpen) {
      form.reset({
        staffRole: staff.staffRole as
          | "SUPPORT_WORKER"
          | "ENROLLED_NURSE"
          | "REGISTERED_NURSE"
          | "COORDINATOR",
        employeeId: staff.employeeId || "",
        startDate: format(new Date(staff.startDate), "yyyy-MM-dd"),
        endDate: staff.endDate
          ? format(new Date(staff.endDate), "yyyy-MM-dd")
          : "",
        phone: staff.phone || "",
        emergencyContact: staff.emergencyContact || "",
        emergencyPhone: staff.emergencyPhone || "",
        address: staff.address || "",
        cert3IndividualSupport: staff.cert3IndividualSupport,
        ahpraRegistration: staff.ahpraRegistration || "",
        covidVaccinations: staff.covidVaccinations,
        influenzaVaccination: staff.influenzaVaccination,
        workingWithChildrenCheck: staff.workingWithChildrenCheck,
        ndisScreeningCheck: staff.ndisScreeningCheck,
        policeCheck: staff.policeCheck,
        firstAidCPR: staff.firstAidCPR,
        workingRights: staff.workingRights,
        ndisModules: staff.ndisModules || [],
        hourlyRate: staff.hourlyRate?.toString() || "",
      });
    }
  }, [staff, isModalOpen, form]);

  const handleSubmit = (data: EditStaffFormData) => {
    if (!staff) return;

    const updateData = {
      ...data,
      hourlyRate: data.hourlyRate ? parseFloat(data.hourlyRate) : undefined,
      endDate: data.endDate || undefined,
    };

    updateStaffMutation.mutate(
      { staffId: staff.id, data: updateData },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  if (!staff) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="truncate">Edit Staff: {staff.user.name}</span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            Update staff information and qualifications
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {/* Basic Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <User className="h-4 w-4" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <FormField
                    control={form.control}
                    name="staffRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role *</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {STAFF_ROLE_OPTIONS.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter employee ID" {...field} />
                        </FormControl>
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
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hourlyRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hourly Rate</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Phone className="h-4 w-4" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="0412 345 678"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emergencyContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter emergency contact name"
                            {...field}
                          />
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
                        <FormLabel>Emergency Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="0412 345 678"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter full address"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Professional Qualifications */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Award className="h-4 w-4" />
                    Professional Qualifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <FormField
                    control={form.control}
                    name="ahpraRegistration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AHPRA Registration</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter AHPRA registration number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cert3IndividualSupport"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            CERT 3 Individual Support
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="workingRights"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Work Rights
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="covidVaccinations"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            COVID-19 Vaccine
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="influenzaVaccination"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Influenza Vaccine
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="workingWithChildrenCheck"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Working with Children Check
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ndisScreeningCheck"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            NDIS Screening Check
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="policeCheck"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Police Check
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="firstAidCPR"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            First Aid & CPR
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* NDIS Modules */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                    <Shield className="h-4 w-4" />
                    NDIS Modules
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <FormField
                    control={form.control}
                    name="ndisModules"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-1 gap-2">
                          {NDIS_MODULES.map((module) => (
                            <FormItem
                              key={module}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value?.includes(module)}
                                  onChange={(e) => {
                                    const currentModules = field.value || [];
                                    return e.target.checked
                                      ? field.onChange([
                                          ...currentModules,
                                          module,
                                        ])
                                      : field.onChange(
                                          currentModules?.filter(
                                            (value) => value !== module
                                          )
                                        );
                                  }}
                                  className="rounded border-gray-300"
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal cursor-pointer">
                                {module}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <Separator />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updateStaffMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  updateStaffMutation.isPending || !form.formState.isValid
                }
              >
                {updateStaffMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Staff"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
