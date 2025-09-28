"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Phone, Shield, Heart, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { MODAL_TYPES } from "../../constants";
import { format } from "date-fns";
import { Participant } from "@/types/admin";

const STATUS_COLORS = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-yellow-100 text-yellow-800",
  PENDING: "bg-blue-100 text-blue-800",
  DISCHARGED: "bg-gray-100 text-gray-800",
};

export default function ViewParticipantModal() {
  const { isOpen, type, data, onClose } = useModal();
  const participant = data?.participant as Participant;

  const isModalOpen = isOpen && type === MODAL_TYPES.VIEW_PARTICIPANT;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const getDisplayName = (participant: Participant) => {
    if (participant.preferredName) {
      return `${participant.preferredName} (${participant.firstName} ${participant.lastName})`;
    }
    return `${participant.firstName} ${participant.lastName}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount?: number | null) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!participant) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {getInitials(participant.firstName, participant.lastName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                {getDisplayName(participant)}
                <Badge
                  variant="secondary"
                  className={
                    STATUS_COLORS[
                      participant.status as keyof typeof STATUS_COLORS
                    ] || ""
                  }
                >
                  {participant.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                NDIS Number: {participant.ndisNumber}
              </p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Participant details and support plan information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <p className="font-medium">{getDisplayName(participant)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Date of Birth
                  </label>
                  <p className="font-medium">
                    {formatDate(participant.dateOfBirth)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Gender
                  </label>
                  <p className="font-medium">
                    {participant.gender || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Member Since
                  </label>
                  <p className="font-medium">
                    {formatDate(participant.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Email
                  </label>
                  <p className="font-medium break-all">
                    {participant.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Phone
                  </label>
                  <p className="font-medium">
                    {participant.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Address
                </label>
                <p className="font-medium whitespace-pre-line">
                  {participant.address}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Emergency Contact</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Name
                    </label>
                    <p className="font-medium">
                      {participant.emergencyContact}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Phone
                    </label>
                    <p className="font-medium">{participant.emergencyPhone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Relationship
                    </label>
                    <p className="font-medium">
                      {participant.emergencyRelation}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* NDIS Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                NDIS Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    NDIS Number
                  </label>
                  <p className="font-mono font-medium">
                    {participant.ndisNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Plan Budget
                  </label>
                  <p className="font-medium">
                    {formatCurrency(participant.planBudget || undefined)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Plan Start Date
                  </label>
                  <p className="font-medium">
                    {formatDate(participant.planStartDate)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Plan End Date
                  </label>
                  <p className="font-medium">
                    {formatDate(participant.planEndDate)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Plan Manager
                  </label>
                  <p className="font-medium">
                    {participant.planManager || "Not assigned"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Support Coordinator
                  </label>
                  <p className="font-medium">
                    {participant.supportCoordinator || "Not assigned"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Medical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Disabilities
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {participant.disabilities &&
                  participant.disabilities.length > 0 ? (
                    participant.disabilities.map((disability, index) => (
                      <Badge key={index} variant="outline">
                        {disability}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">None specified</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Medications
                  </label>
                  <div className="mt-1">
                    {participant.medications &&
                    participant.medications.length > 0 ? (
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {participant.medications.map((medication, index) => (
                          <li key={index}>{medication}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">None specified</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Allergies
                  </label>
                  <div className="mt-1">
                    {participant.allergies &&
                    participant.allergies.length > 0 ? (
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {participant.allergies.map((allergy, index) => (
                          <li key={index}>{allergy}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">None specified</p>
                    )}
                  </div>
                </div>
              </div>

              {participant.medicalNotes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Medical Notes
                  </label>
                  <p className="mt-1 text-sm whitespace-pre-line">
                    {participant.medicalNotes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Support Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Support Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Support Needs
                </label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {participant.supportNeeds &&
                  participant.supportNeeds.length > 0 ? (
                    participant.supportNeeds.map((need, index) => (
                      <Badge key={index} variant="secondary">
                        {need}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">None specified</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Communication Method
                  </label>
                  <p className="font-medium">
                    {participant.communicationMethod || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Behavioral Notes
                  </label>
                  <p className="font-medium whitespace-pre-line">
                    {participant.behavioralNotes || "None specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
