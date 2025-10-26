"use client";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { useModal } from "@/hooks/use-modal";
import { MODAL_TYPES } from "../../constants";
import { format } from "date-fns";

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: string;
  ndisNumber: string;
  status: string;
  planEndDate: string;
  supportCoordinator?: string;
  disabilities: string[];
  createdAt: string;
}

interface ParticipantsTableProps {
  participants: Participant[];
}

const STATUS_COLORS = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-yellow-100 text-yellow-800",
  PENDING: "bg-blue-100 text-blue-800",
  DISCHARGED: "bg-gray-100 text-gray-800",
};

export default function ParticipantsTable({
  participants,
}: ParticipantsTableProps) {
  const { onOpen } = useModal();

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

  if (participants.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No participants found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className="min-w-[1000px]">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Participant</TableHead>
            <TableHead className="min-w-[120px]">NDIS Number</TableHead>
            <TableHead className="min-w-[100px]">Status</TableHead>
            <TableHead className="min-w-[150px]">Primary Disability</TableHead>
            <TableHead className="min-w-[150px]">Support Coordinator</TableHead>
            <TableHead className="min-w-[120px]">Plan End Date</TableHead>
            <TableHead className="min-w-[100px]">Created</TableHead>
            <TableHead className="w-[70px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((participant) => (
            <TableRow key={participant.id}>
              <TableCell className="max-w-[200px]">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="text-xs">
                      {getInitials(participant.firstName, participant.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">
                      {getDisplayName(participant)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Born {formatDate(participant.dateOfBirth)}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {participant.ndisNumber}
              </TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell className="max-w-[150px]">
                <div
                  className="truncate"
                  title={participant.disabilities.join(", ")}
                >
                  {participant.disabilities[0] || "Not specified"}
                  {participant.disabilities.length > 1 && (
                    <span className="text-muted-foreground ml-1">
                      +{participant.disabilities.length - 1} more
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-[150px]">
                <div
                  className="truncate"
                  title={participant.supportCoordinator || "Not assigned"}
                >
                  {participant.supportCoordinator || "Not assigned"}
                </div>
              </TableCell>
              <TableCell>{formatDate(participant.planEndDate)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDate(participant.createdAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() =>
                        onOpen(MODAL_TYPES.VIEW_PARTICIPANT, {
                          participant,
                        })
                      }
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        onOpen(MODAL_TYPES.EDIT_PARTICIPANT, {
                          participant,
                        })
                      }
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() =>
                        onOpen(MODAL_TYPES.DELETE_PARTICIPANT, {
                          participant,
                        })
                      }
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
