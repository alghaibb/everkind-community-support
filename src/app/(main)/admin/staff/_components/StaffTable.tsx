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
  Edit,
  UserX,
  UserCheck,
  Mail,
  Phone,
  Calendar,
  FileText,
  Award,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { formatPhoneNumber } from "@/lib/phone-utils";
import { StaffMember } from "@/types/admin";
import { useModal } from "@/hooks/use-modal";
import { useToggleStaffStatus } from "@/lib/mutations/admin-mutations";
import { MODAL_TYPES } from "../../constants";

interface StaffTableProps {
  staff: StaffMember[];
  totalPages: number;
  currentPage: number;
}

export default function StaffTable({
  staff,
  totalPages,
  currentPage,
}: StaffTableProps) {
  const { onOpen } = useModal();
  const toggleStatusMutation = useToggleStaffStatus();

  // Ensure staff is always an array
  const safeStaff = Array.isArray(staff) ? staff : [];

  const handleViewDetails = (staffMember: StaffMember) => {
    onOpen(MODAL_TYPES.VIEW_STAFF, { staff: staffMember });
  };

  const handleEditStaff = (staffMember: StaffMember) => {
    onOpen(MODAL_TYPES.EDIT_STAFF, { staff: staffMember });
  };

  const handleToggleStatus = (staffMember: StaffMember) => {
    toggleStatusMutation.mutate(staffMember.id);
  };

  const getRoleDisplayName = (role: string) => {
    return role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (safeStaff.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No staff found</h3>
        <p className="text-muted-foreground">
          No staff members match your current filters.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {safeStaff.map((staffMember) => (
          <div
            key={staffMember.id}
            className="rounded-lg border bg-card p-4 space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="font-medium">{staffMember.user.name}</div>
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary"
                  >
                    {getRoleDisplayName(staffMember.staffRole)}
                  </Badge>
                  <Badge
                    variant={staffMember.isActive ? "default" : "secondary"}
                    className={`text-xs ${
                      staffMember.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {staffMember.isActive ? "Active" : "Inactive"}
                  </Badge>
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
                    onClick={() => handleViewDetails(staffMember)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleEditStaff(staffMember)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Staff
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleToggleStatus(staffMember)}
                  >
                    {staffMember.isActive ? (
                      <>
                        <UserX className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`mailto:${staffMember.user.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Contact Info */}
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {staffMember.user.email}
              </div>
              {staffMember.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {formatPhoneNumber(staffMember.phone)}
                </div>
              )}
              {staffMember.employeeId && (
                <div className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  Employee ID: {staffMember.employeeId}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Started{" "}
                {formatDistanceToNow(new Date(staffMember.startDate), {
                  addSuffix: true,
                })}
              </div>
              <div className="text-xs text-muted-foreground">
                {staffMember.ndisModules.length} NDIS modules completed
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {safeStaff.map((staffMember) => (
                <TableRow key={staffMember.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{staffMember.user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {staffMember.user.email}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {getRoleDisplayName(staffMember.staffRole)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="text-sm">
                      {staffMember.employeeId || "Not assigned"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={staffMember.isActive ? "default" : "secondary"}
                      className={
                        staffMember.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {staffMember.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(staffMember.startDate), {
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
                          onClick={() => handleViewDetails(staffMember)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleEditStaff(staffMember)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Staff
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(staffMember)}
                        >
                          {staffMember.isActive ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`mailto:${staffMember.user.email}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
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
              <Link href={`/admin/staff?page=${currentPage - 1}`}>
                Previous
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              asChild
            >
              <Link href={`/admin/staff?page=${currentPage + 1}`}>Next</Link>
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
