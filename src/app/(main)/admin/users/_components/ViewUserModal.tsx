"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useModal } from "@/hooks/use-modal";
import { AdminUser } from "@/types/admin";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Building,
  Home,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Briefcase,
  Heart,
} from "lucide-react";

function ViewUserModal() {
  const { isOpen, type, data, onClose } = useModal();
  const isModalOpen = isOpen && type === "view-user";
  const user = data?.user as AdminUser | undefined;

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatLastActive = (lastActive: string | null) => {
    if (!lastActive) return "Never logged in";

    const date = new Date(lastActive);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return "Active today";
    if (diffInDays === 1) return "Active yesterday";
    if (diffInDays < 7) return `Active ${diffInDays} days ago`;
    if (diffInDays < 30)
      return `Active ${Math.floor(diffInDays / 7)} weeks ago`;

    return `Last active on ${date.toLocaleDateString("en-AU", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}`;
  };

  const getRoleIcon = (role: string | null) => {
    if (role === "ADMIN") return <Shield className="h-4 w-4" />;
    if (role === "STAFF") return <User className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  const getUserTypeIcon = (userType: string) => {
    if (userType === "INTERNAL") return <Building className="h-4 w-4" />;
    return <Home className="h-4 w-4" />;
  };

  const getRoleBadgeVariant = (role: string | null) => {
    if (role === "ADMIN") return "destructive";
    if (role === "STAFF") return "default";
    return "secondary";
  };

  const getUserTypeBadgeVariant = (userType: string) => {
    if (userType === "INTERNAL") return "default";
    return "outline";
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[95vh] overflow-hidden">
        <div className="max-h-[calc(95vh-120px)] overflow-y-auto pr-2">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <User className="h-5 w-5 sm:h-6 sm:w-6" />
              User Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6">
            {/* User Overview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  {user.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={getRoleBadgeVariant(user.role || null)}
                    className="gap-1"
                  >
                    {getRoleIcon(user.role || null)}
                    {user.role || "N/A"}
                  </Badge>
                  <Badge
                    variant={getUserTypeBadgeVariant(user.userType || "")}
                    className="gap-1"
                  >
                    {getUserTypeIcon(user.userType || "")}
                    {user.userType}
                  </Badge>
                  <Badge
                    variant={user.isActive ? "default" : "secondary"}
                    className="gap-1"
                  >
                    {user.isActive ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <XCircle className="h-3 w-3" />
                    )}
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                  {user.emailVerified && (
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Email Verified
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-muted-foreground block">
                          Email Address
                        </span>
                        <p className="text-base break-all mt-1">{user.email}</p>
                      </div>
                    </div>

                    {user.additionalInfo?.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-medium text-muted-foreground block">
                            Phone Number
                          </span>
                          <p className="text-base mt-1">
                            {user.additionalInfo.phone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-muted-foreground block">
                          Member Since
                        </span>
                        <p className="text-base mt-1">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <UserCheck className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-muted-foreground block">
                          Last Active
                        </span>
                        <p className="text-base mt-1">
                          {formatLastActive(user.lastActive)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-medium text-muted-foreground block">
                          Last Updated
                        </span>
                        <p className="text-base mt-1">
                          {formatDate(user.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
            {user.additionalInfo && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    {user.additionalInfo.type === "staff" ? (
                      <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                    {user.additionalInfo.type === "staff"
                      ? "Staff Information"
                      : "Family Information"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    {user.additionalInfo.type === "staff" && (
                      <>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Staff Role:</span>
                          <span>
                            {user.additionalInfo.staffRole.replace("_", " ")}
                          </span>
                        </div>

                        {user.additionalInfo.employeeId && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Employee ID:</span>
                            <span>{user.additionalInfo.employeeId}</span>
                          </div>
                        )}

                        {user.additionalInfo.startDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Start Date:</span>
                            <span>
                              {formatDate(user.additionalInfo.startDate)}
                            </span>
                          </div>
                        )}

                        {user.additionalInfo.endDate && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">End Date:</span>
                            <span>
                              {formatDate(user.additionalInfo.endDate)}
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    {user.additionalInfo.type === "family" && (
                      <>
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Relationship:</span>
                          <span>{user.additionalInfo.relationship}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <UserCheck className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            Emergency Contact:
                          </span>
                          <Badge
                            variant={
                              user.additionalInfo.emergencyContact
                                ? "default"
                                : "secondary"
                            }
                          >
                            {user.additionalInfo.emergencyContact
                              ? "Yes"
                              : "No"}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ViewUserModal;
