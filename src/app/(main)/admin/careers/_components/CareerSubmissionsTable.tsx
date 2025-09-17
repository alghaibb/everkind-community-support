"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, Download, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { CareerSubmission } from "@/generated/prisma";

interface CareerSubmissionsTableProps {
  submissions: CareerSubmission[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export default function CareerSubmissionsTable({
  submissions,
  currentPage,
  totalPages,
  totalCount,
}: CareerSubmissionsTableProps) {
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Support Worker":
        return "default";
      case "Registered Nurse":
        return "secondary";
      case "Enrolled Nurse":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No applications found
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">
                    {submission.firstName} {submission.lastName}
                  </TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.phone}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(submission.role)}>
                      {submission.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(submission.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/careers/${submission.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {submission.resume && (
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={submission.resume}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * 10 + 1} to{" "}
            {Math.min(currentPage * 10, totalCount)} of {totalCount} results
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              asChild
            >
              <Link
                href={`/admin/careers?page=${currentPage - 1}`}
                className={currentPage === 1 ? "pointer-events-none" : ""}
              >
                Previous
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              asChild
            >
              <Link
                href={`/admin/careers?page=${currentPage + 1}`}
                className={
                  currentPage === totalPages ? "pointer-events-none" : ""
                }
              >
                Next
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
