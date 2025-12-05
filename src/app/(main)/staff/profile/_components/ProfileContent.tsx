"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit,
  AlertTriangle,
} from "lucide-react";
import { useStaffProfile } from "@/lib/queries/staff-queries";
import { ProfileSkeleton } from "./ProfileSkeleton";
import { format } from "date-fns";

export function ProfileContent() {
  const { data: profile, isLoading, error } = useStaffProfile();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Failed to load profile
              </h3>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "An error occurred"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const initials = profile.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formatRole = (role: string) => {
    return role
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const certifications = [
    {
      key: "workingWithChildrenCheck",
      label: "Working With Children Check",
      value: profile.certifications.workingWithChildrenCheck,
    },
    {
      key: "ndisScreeningCheck",
      label: "NDIS Screening Check",
      value: profile.certifications.ndisScreeningCheck,
    },
    {
      key: "policeCheck",
      label: "Police Check",
      value: profile.certifications.policeCheck,
    },
    {
      key: "firstAidCPR",
      label: "First Aid & CPR",
      value: profile.certifications.firstAidCPR,
    },
    {
      key: "covidVaccinations",
      label: "COVID Vaccinations",
      value: profile.certifications.covidVaccinations,
    },
    {
      key: "influenzaVaccination",
      label: "Influenza Vaccination",
      value: profile.certifications.influenzaVaccination,
    },
    {
      key: "cert3IndividualSupport",
      label: "Cert III Individual Support",
      value: profile.certifications.cert3IndividualSupport,
    },
  ];

  return (
    <div className="space-y-6 xs:space-y-7 sm:space-y-8 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            My Profile
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            View and manage your profile information
          </p>
        </div>
        <Button variant="outline" className="gap-2 shrink-0 w-full sm:w-auto">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="border-border/50 shadow-soft-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-24 w-24 rounded-2xl border-4 border-primary/20">
                  <AvatarImage
                    src={profile.user.image}
                    alt={profile.user.name}
                  />
                  <AvatarFallback className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold">{profile.user.name}</h2>
                  <Badge variant="info" className="mt-1">
                    {formatRole(profile.staffRole)}
                  </Badge>
                  {profile.employeeId && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Employee ID: {profile.employeeId}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Contact Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{profile.user.email}</p>
                  </div>
                </div>

                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{profile.phone}</p>
                    </div>
                  </div>
                )}

                {profile.address && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="font-medium">{profile.address}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {format(new Date(profile.startDate), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          {(profile.emergencyContact || profile.emergencyPhone) && (
            <Card className="border-border/50 shadow-soft-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {profile.emergencyContact && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Contact Name
                      </p>
                      <p className="font-medium">{profile.emergencyContact}</p>
                    </div>
                  )}
                  {profile.emergencyPhone && (
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{profile.emergencyPhone}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Certifications Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-soft-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div
                    key={cert.key}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <span className="text-sm font-medium">{cert.label}</span>
                    {cert.value ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* NDIS Modules */}
          {profile.ndisModules.length > 0 && (
            <Card className="border-border/50 shadow-soft-lg">
              <CardHeader>
                <CardTitle className="text-base">
                  NDIS Modules Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.ndisModules.map((module) => (
                    <Badge key={module} variant="secondary">
                      {module}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
