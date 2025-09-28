"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  Shield,
  FileText,
  MapPin,
  DollarSign,
  Edit,
  Clock,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { formatPhoneNumber } from "@/lib/phone-utils";
import { StaffMember } from "@/types/admin";
import { useModal } from "@/hooks/use-modal";
import { MODAL_TYPES } from "../../constants";

export default function StaffDetailsModal() {
  const { isOpen, type, data, onOpen, onClose } = useModal();

  const isModalOpen = isOpen && type === MODAL_TYPES.VIEW_STAFF;
  const staff = data?.staff as StaffMember;

  if (!staff) return null;

  const handleEdit = () => {
    onOpen(MODAL_TYPES.EDIT_STAFF, { staff });
  };

  const getRoleDisplayName = (role: string) => {
    return role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getStatusBadge = () => {
    return staff.isActive ? (
      <Badge className="bg-green-100 text-green-800">Active</Badge>
    ) : (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        Inactive
      </Badge>
    );
  };

  const formatAvailability = (availability: Record<string, unknown>) => {
    if (!availability) return null;

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    return days
      .map((day) => {
        const dayData = availability[day] as
          | Record<string, unknown>
          | undefined;
        if (!dayData) return null;

        const dayName = day.charAt(0).toUpperCase() + day.slice(1);

        // Check different availability formats
        const isAvailable = dayData.available !== false;
        const hasTimeSlots =
          dayData.am !== undefined || dayData.pm !== undefined;
        const hasTimeRange = dayData.startTime && dayData.endTime;

        if (!isAvailable) {
          return (
            <div
              key={day}
              className="flex items-center justify-between text-sm"
            >
              <span className="capitalize">{dayName}:</span>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                Unavailable
              </Badge>
            </div>
          );
        }

        let timeDisplay = "Available";

        if (hasTimeRange) {
          timeDisplay = `${dayData.startTime} - ${dayData.endTime}`;
        } else if (hasTimeSlots) {
          const slots = [];
          if (dayData.am) slots.push("AM");
          if (dayData.pm) slots.push("PM");
          timeDisplay = slots.length > 0 ? slots.join(", ") : "Available";
        }

        return (
          <div key={day} className="flex items-center justify-between text-sm">
            <span className="capitalize">{dayName}:</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {timeDisplay}
            </Badge>
          </div>
        );
      })
      .filter(Boolean);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="truncate">{staff.user.name}</span>
            {getStatusBadge()}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {getRoleDisplayName(staff.staffRole)} • Employee ID:{" "}
            {staff.employeeId || "Not assigned"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <User className="h-4 w-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{staff.user.email}</span>
                </div>

                {staff.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="font-medium">
                      {formatPhoneNumber(staff.phone)}
                    </span>
                  </div>
                )}

                {staff.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-medium">{staff.address}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Started:</span>
                  <span className="font-medium">
                    {format(new Date(staff.startDate), "MMM dd, yyyy")}
                    <span className="text-muted-foreground ml-1">
                      (
                      {formatDistanceToNow(new Date(staff.startDate), {
                        addSuffix: true,
                      })}
                      )
                    </span>
                  </span>
                </div>

                {staff.endDate && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Ended:</span>
                    <span className="font-medium">
                      {format(new Date(staff.endDate), "MMM dd, yyyy")}
                    </span>
                  </div>
                )}

                {staff.hourlyRate && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Hourly Rate:</span>
                    <span className="font-medium">
                      ${staff.hourlyRate.toString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                <Award className="h-4 w-4" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 pt-0">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Role:</span>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary"
                  >
                    {getRoleDisplayName(staff.staffRole)}
                  </Badge>
                </div>

                {staff.employeeId && (
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Employee ID:</span>
                    <span className="font-medium">{staff.employeeId}</span>
                  </div>
                )}

                {staff.ahpraRegistration && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      AHPRA Registration:
                    </span>
                    <span className="font-medium">
                      {staff.ahpraRegistration}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${staff.cert3IndividualSupport ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span>CERT 3</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${staff.covidVaccinations ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span>COVID Vaccine</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${staff.influenzaVaccination ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span>Flu Vaccine</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${staff.workingWithChildrenCheck ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span>WWCC</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${staff.ndisScreeningCheck ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span>NDIS Check</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${staff.policeCheck ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span>Police Check</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${staff.firstAidCPR ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span>First Aid</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${staff.workingRights ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span>Work Rights</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {(staff.emergencyContact || staff.emergencyPhone) && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Phone className="h-4 w-4" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="grid gap-2">
                  {staff.emergencyContact && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Contact:</span>
                      <span className="font-medium">
                        {staff.emergencyContact}
                      </span>
                    </div>
                  )}

                  {staff.emergencyPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">
                        {formatPhoneNumber(staff.emergencyPhone)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Availability */}
          {staff.availability && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Clock className="h-4 w-4" />
                  Weekly Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {formatAvailability(staff.availability)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* NDIS Modules */}
          {staff.ndisModules.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Award className="h-4 w-4" />
                  NDIS Modules Completed ({staff.ndisModules.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1">
                  {staff.ndisModules.map((module, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {module}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {staff.certificates.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <FileText className="h-4 w-4" />
                  Documents ({staff.certificates.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {staff.certificates.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <FileText className="h-3 w-3 text-muted-foreground" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Staff
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
