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
  FileText,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  Award,
  Clock,
  UserPlus,
  UserX,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { formatPhoneNumber } from "@/lib/phone-utils";
import { CareerApplication } from "@/types/admin";
import { useModal } from "@/hooks/use-modal";
import {
  ROLE_ICONS,
  ROLE_COLORS,
  MODAL_TYPES,
  COMPLIANCE_CHECK_CONFIG,
  ICON_SIZES,
  DOCUMENT_CONFIG,
} from "../../constants";

type Application = CareerApplication;

const getStatusIcon = (status: string) => {
  if (!status || status === "No" || status === "N/A" || status.trim() === "") {
    return <XCircle className={`${ICON_SIZES.sm} text-red-600`} />;
  }
  if (
    status.toLowerCase() === "yes" ||
    (status.trim() !== "" && status !== "No" && status !== "N/A")
  ) {
    return <CheckCircle className={`${ICON_SIZES.sm} text-green-600`} />;
  }
  return <AlertCircle className={`${ICON_SIZES.sm} text-yellow-600`} />;
};

const getStatusColor = (status: string) => {
  if (!status || status === "No" || status === "N/A" || status.trim() === "") {
    return "bg-red-100 text-red-800";
  }
  if (
    status.toLowerCase() === "yes" ||
    (status.trim() !== "" && status !== "No" && status !== "N/A")
  ) {
    return "bg-green-100 text-green-800";
  }
  return "bg-yellow-100 text-yellow-800";
};

export default function ApplicationDetails() {
  const { isOpen, type, data, onClose, onOpen } = useModal();

  const isModalOpen = isOpen && type === MODAL_TYPES.VIEW_APPLICATION;
  const application = data?.application as Application;

  if (!application) return null;
  const RoleIcon =
    ROLE_ICONS[application.role as keyof typeof ROLE_ICONS] || User;
  const roleColor =
    ROLE_COLORS[application.role as keyof typeof ROLE_COLORS] || "";

  const complianceChecks = COMPLIANCE_CHECK_CONFIG.map((check) => ({
    label: check.label,
    status:
      (application as CareerApplication)[check.key] ||
      ("defaultValue" in check ? check.defaultValue : null),
    required:
      typeof check.required === "function"
        ? check.required(application.role)
        : check.required,
  }));

  const passedChecks = complianceChecks.filter(
    (check) =>
      check.status &&
      check.status !== "No" &&
      check.status !== "N/A" &&
      check.status.trim() !== ""
  ).length;
  const totalRequiredChecks = complianceChecks.filter(
    (check) => check.required
  ).length;

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
            <RoleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="truncate">
              {application.firstName} {application.lastName}
            </span>
          </DialogTitle>
          <DialogDescription className="text-sm">
            Application for {application.role} position
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
              <div className="space-y-2 text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Email:</span>
                  </div>
                  <span className="break-all">{application.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Phone:</span>
                  </div>
                  <span>{formatPhoneNumber(application.phone)}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Applied:</span>
                  </div>
                  <span>{format(new Date(application.createdAt), "PPP")}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Time ago:</span>
                  </div>
                  <span>
                    {formatDistanceToNow(new Date(application.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Role:</span>
                  <Badge variant="secondary" className={roleColor}>
                    {application.role}
                  </Badge>
                </div>
              </div>

              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DOCUMENT_CONFIG.map((doc) => {
                    const url = (application as CareerApplication)[doc.key];
                    if (!url) return null;

                    return (
                      <Button
                        key={doc.key}
                        asChild
                        variant="outline"
                        size="sm"
                        className="justify-start"
                      >
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-3 w-3 mr-2" />
                          {doc.label}
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Compliance Status
                <Badge variant="secondary">
                  {passedChecks}/{totalRequiredChecks} Complete
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complianceChecks
                  .filter((check) => check.required)
                  .map((check) => (
                    <div
                      key={check.label}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(check.status || "")}
                        <span className="text-sm">{check.label}</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(check.status || "")}
                      >
                        {check.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          {application.availability && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm sm:text-base">
                  <Clock className="h-4 w-4" />
                  Weekly Availability
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {formatAvailability(application.availability)}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Experience & Background
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {application.experience}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onClose()}>
            Close
          </Button>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={() =>
                onOpen(MODAL_TYPES.REJECT_APPLICATION, { application })
              }
            >
              <UserX className="h-4 w-4 mr-2" />
              Reject Application
            </Button>

            <Button asChild>
              <a href={`mailto:${application.email}`}>
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </a>
            </Button>

            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create Staff Account
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
