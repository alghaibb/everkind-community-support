"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  User,
  Phone,
  Award,
  Shield,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { StaffMember } from "@/types/admin";
import { useModal } from "@/hooks/use-modal";
import { useUpdateStaff } from "@/lib/mutations/admin-mutations";
import { MODAL_TYPES, STAFF_ROLE_OPTIONS } from "../../constants";

export default function EditStaffModal() {
  const { isOpen, type, data, onClose } = useModal();
  const updateStaffMutation = useUpdateStaff();

  const isModalOpen = isOpen && type === MODAL_TYPES.EDIT_STAFF;
  const staff = data?.staff as StaffMember;

  const [formData, setFormData] = useState({
    staffRole: "",
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
    ndisModules: [] as string[],
    hourlyRate: "",
  });

  // Initialize form data when staff data is available
  useEffect(() => {
    if (staff) {
      setFormData({
        staffRole: staff.staffRole,
        employeeId: staff.employeeId || "",
        startDate: format(new Date(staff.startDate), "yyyy-MM-dd"),
        endDate: staff.endDate ? format(new Date(staff.endDate), "yyyy-MM-dd") : "",
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
        ndisModules: staff.ndisModules,
        hourlyRate: staff.hourlyRate?.toString() || "",
      });
    }
  }, [staff]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff) return;

    const updateData = {
      ...formData,
      hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : undefined,
      endDate: formData.endDate || undefined,
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

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleNdIsModule = (module: string) => {
    setFormData(prev => ({
      ...prev,
      ndisModules: prev.ndisModules.includes(module)
        ? prev.ndisModules.filter(m => m !== module)
        : [...prev.ndisModules, module]
    }));
  };

  if (!staff) return null;

  const ndisModules = [
    "Module 1: Understanding Disability",
    "Module 2: Communication",
    "Module 3: Legal and Ethical",
    "Module 4: Service Planning",
    "Module 5: Daily Living Skills",
    "Module 6: Behaviour Support",
    "Module 7: Health and Safety",
  ];

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

        <form onSubmit={handleSubmit} className="space-y-6">
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
                <div className="grid gap-2">
                  <Label htmlFor="staffRole">Role</Label>
                  <Select
                    value={formData.staffRole}
                    onValueChange={(value) => handleInputChange("staffRole", value)}
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
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange("employeeId", e.target.value)}
                    placeholder="Enter employee ID"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="hourlyRate">Hourly Rate</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
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
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="Enter emergency contact name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                    placeholder="Enter emergency contact phone"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Enter address"
                    rows={3}
                  />
                </div>
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
                <div className="grid gap-2">
                  <Label htmlFor="ahpraRegistration">AHPRA Registration</Label>
                  <Input
                    id="ahpraRegistration"
                    value={formData.ahpraRegistration}
                    onChange={(e) => handleInputChange("ahpraRegistration", e.target.value)}
                    placeholder="Enter AHPRA registration number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="cert3IndividualSupport"
                      checked={formData.cert3IndividualSupport}
                      onCheckedChange={(checked) => handleInputChange("cert3IndividualSupport", checked)}
                    />
                    <Label htmlFor="cert3IndividualSupport" className="text-sm">CERT 3</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="workingRights"
                      checked={formData.workingRights}
                      onCheckedChange={(checked) => handleInputChange("workingRights", checked)}
                    />
                    <Label htmlFor="workingRights" className="text-sm">Work Rights</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="covidVaccinations"
                      checked={formData.covidVaccinations}
                      onCheckedChange={(checked) => handleInputChange("covidVaccinations", checked)}
                    />
                    <Label htmlFor="covidVaccinations" className="text-sm">COVID Vaccine</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="influenzaVaccination"
                      checked={formData.influenzaVaccination}
                      onCheckedChange={(checked) => handleInputChange("influenzaVaccination", checked)}
                    />
                    <Label htmlFor="influenzaVaccination" className="text-sm">Flu Vaccine</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="workingWithChildrenCheck"
                      checked={formData.workingWithChildrenCheck}
                      onCheckedChange={(checked) => handleInputChange("workingWithChildrenCheck", checked)}
                    />
                    <Label htmlFor="workingWithChildrenCheck" className="text-sm">WWCC</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ndisScreeningCheck"
                      checked={formData.ndisScreeningCheck}
                      onCheckedChange={(checked) => handleInputChange("ndisScreeningCheck", checked)}
                    />
                    <Label htmlFor="ndisScreeningCheck" className="text-sm">NDIS Check</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="policeCheck"
                      checked={formData.policeCheck}
                      onCheckedChange={(checked) => handleInputChange("policeCheck", checked)}
                    />
                    <Label htmlFor="policeCheck" className="text-sm">Police Check</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="firstAidCPR"
                      checked={formData.firstAidCPR}
                      onCheckedChange={(checked) => handleInputChange("firstAidCPR", checked)}
                    />
                    <Label htmlFor="firstAidCPR" className="text-sm">First Aid</Label>
                  </div>
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
                <div className="grid grid-cols-1 gap-2">
                  {ndisModules.map((module) => (
                    <div key={module} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={module}
                        checked={formData.ndisModules.includes(module)}
                        onChange={() => toggleNdIsModule(module)}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor={module} className="text-sm cursor-pointer">
                        {module}
                      </Label>
                    </div>
                  ))}
                </div>
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
              disabled={updateStaffMutation.isPending}
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
      </DialogContent>
    </Dialog>
  );
}
