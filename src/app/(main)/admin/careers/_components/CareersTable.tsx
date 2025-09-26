"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  UserPlus,
  Download,
  Mail,
  Phone,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { formatPhoneNumber } from "@/lib/phone-utils";
import { CareerApplication } from "@/lib/types/admin";
import { useModal } from "@/hooks/use-modal";
import { useDeleteCareerSubmission } from "@/lib/mutations/admin-mutations";
import {
  ROLE_COLORS,
  APPLICATION_STATUS,
  STATUS_VARIANTS,
  MODAL_TYPES,
} from "../../constants";

type Application = CareerApplication;

interface CareersTableProps {
  applications: Application[];
  totalPages: number;
  currentPage: number;
}

const getComplianceStatus = (application: Application) => {
  const isCompliant = (value: string | null) =>
    value && value !== "No" && value !== "N/A" && value.trim() !== "";

  const checks = [
    isCompliant(application.workingWithChildrenCheck),
    isCompliant(application.ndisScreeningCheck),
    isCompliant(application.policeCheck),
    isCompliant(application.firstAidCPR),
  ];

  const passedChecks = checks.filter(Boolean).length;
  const totalChecks = checks.length;

  if (passedChecks === totalChecks) {
    return { status: "complete", color: "text-green-600", icon: CheckCircle };
  } else if (passedChecks > totalChecks / 2) {
    return { status: "partial", color: "text-yellow-600", icon: AlertCircle };
  } else {
    return { status: "incomplete", color: "text-red-600", icon: XCircle };
  }
};

export default function CareersTable({
  applications,
  totalPages,
  currentPage,
}: CareersTableProps) {
  const { onOpen } = useModal();
  const deleteSubmissionMutation = useDeleteCareerSubmission();

  const handleViewDetails = (application: Application) => {
    onOpen(MODAL_TYPES.VIEW_APPLICATION, { application });
  };

  const handleCreateStaff = (application: Application) => {
    onOpen(MODAL_TYPES.CREATE_STAFF, { application });
  };

  const handleDeleteSubmission = (application: Application) => {
    onOpen(MODAL_TYPES.DELETE_CAREER_SUBMISSION, { application });
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No applications found</h3>
        <p className="text-muted-foreground">
          No career applications match your current filters.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {applications.map((application) => {
          const compliance = getComplianceStatus(application);
          const ComplianceIcon = compliance.icon;

          return (
            <div
              key={application.id}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="font-medium">
                    {application.firstName} {application.lastName}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        ROLE_COLORS[
                          application.role as keyof typeof ROLE_COLORS
                        ] || ""
                      }`}
                    >
                      {application.role}
                    </Badge>
                    {application.status &&
                      application.status !== APPLICATION_STATUS.PENDING && (
                        <Badge
                          variant={
                            STATUS_VARIANTS[
                              application.status as keyof typeof STATUS_VARIANTS
                            ]
                          }
                          className="text-xs"
                        >
                          {application.status}
                        </Badge>
                      )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(application)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleCreateStaff(application)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create Staff
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {application.resume && (
                      <DropdownMenuItem asChild>
                        <Link href={application.resume} target="_blank">
                          <Download className="h-4 w-4 mr-2" />
                          Resume
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href={`mailto:${application.email}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteSubmission(application)}
                      className="text-destructive focus:text-destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Delete Application
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Contact Info */}
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {application.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {formatPhoneNumber(application.phone)}
                </div>
              </div>

              {/* Experience */}
              <div className="text-sm">
                <p className="line-clamp-2">{application.experience}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <ComplianceIcon className={`h-4 w-4 ${compliance.color}`} />
                  <span className={`text-sm ${compliance.color} capitalize`}>
                    {compliance.status}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDistanceToNow(new Date(application.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => {
                const compliance = getComplianceStatus(application);
                const ComplianceIcon = compliance.icon;

                return (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {application.firstName} {application.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {application.email}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <Badge
                          variant="secondary"
                          className={
                            ROLE_COLORS[
                              application.role as keyof typeof ROLE_COLORS
                            ] || ""
                          }
                        >
                          {application.role}
                        </Badge>
                        {application.status &&
                          application.status !== APPLICATION_STATUS.PENDING && (
                            <Badge
                              variant={
                                STATUS_VARIANTS[
                                  application.status as keyof typeof STATUS_VARIANTS
                                ]
                              }
                              className="text-xs"
                            >
                              {application.status}
                            </Badge>
                          )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ComplianceIcon
                          className={`h-4 w-4 ${compliance.color}`}
                        />
                        <span
                          className={`text-sm ${compliance.color} capitalize`}
                        >
                          {compliance.status}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(application.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewDetails(application)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleCreateStaff(application)}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Create Staff Account
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {application.resume && (
                            <DropdownMenuItem asChild>
                              <Link href={application.resume} target="_blank">
                                <Download className="h-4 w-4 mr-2" />
                                Download Resume
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem asChild>
                            <Link href={`mailto:${application.email}`}>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteSubmission(application)}
                            className="text-destructive focus:text-destructive"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Delete Application
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              asChild
            >
              <Link href={`/admin/careers?page=${currentPage - 1}`}>
                Previous
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              asChild
            >
              <Link href={`/admin/careers?page=${currentPage + 1}`}>Next</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
