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
import { Card, CardContent } from "@/components/ui/card";
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
  Reply,
  Mail,
  Phone,
  Calendar,
  FileText,
  Trash,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { formatPhoneNumber } from "@/lib/phone-utils";
import { ContactMessage } from "@/lib/types/admin";
import { useModal } from "@/hooks/use-modal";
import { MODAL_TYPES } from "../../constants";

interface MessagesTableProps {
  messages: ContactMessage[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export default function MessagesTable({
  messages,
  totalPages,
  currentPage,
  totalCount,
}: MessagesTableProps) {
  const { onOpen } = useModal();

  const handleViewMessage = (message: ContactMessage) => {
    onOpen(MODAL_TYPES.VIEW_MESSAGE, { message });
  };

  const handleReplyMessage = (message: ContactMessage) => {
    onOpen(MODAL_TYPES.REPLY_MESSAGE, { message });
  };

  const handleDeleteMessage = (message: ContactMessage) => {
    onOpen(MODAL_TYPES.DELETE_CONTACT_MESSAGE, { message });
  };

  const truncateMessage = (message: string, maxLength = 30) => {
    return message.length > maxLength
      ? message.substring(0, maxLength) + "..."
      : message;
  };

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No messages found</h3>
            <p className="text-muted-foreground">
              No messages match your current filters.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[250px]">Contact</TableHead>
              <TableHead className="min-w-[200px]">Subject</TableHead>
              <TableHead className="min-w-[300px]">Message</TableHead>
              <TableHead className="min-w-[120px]">Received</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {message.firstName} {message.lastName}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate max-w-[180px]">
                        {message.email}
                      </span>
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <span>{formatPhoneNumber(message.phone)}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium max-w-[180px] truncate">
                    {message.subject}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-[280px] text-sm text-muted-foreground">
                    {truncateMessage(message.message)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 flex-shrink-0" />
                    <span className="whitespace-nowrap">
                      {formatDistanceToNow(message.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewMessage(message)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleReplyMessage(message)}
                      >
                        <Reply className="mr-2 h-4 w-4" />
                        Send Reply
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteMessage(message)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
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

      {/* Tablet Compact Table */}
      <div className="hidden md:block lg:hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contact & Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="min-w-[200px]">
                  <div className="space-y-1">
                    <div className="font-medium text-sm">
                      {message.firstName} {message.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {message.email}
                    </div>
                    <div className="font-medium text-sm text-blue-600">
                      {message.subject}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="min-w-[250px]">
                  <div className="text-sm text-muted-foreground">
                    {truncateMessage(message.message, 80)}
                  </div>
                </TableCell>
                <TableCell className="min-w-[80px]">
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(message.createdAt, {
                      addSuffix: true,
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleViewMessage(message)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleReplyMessage(message)}
                      >
                        <Reply className="mr-2 h-4 w-4" />
                        Reply
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-3">
        {messages.map((message) => (
          <Card key={message.id} className="mx-4">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="font-medium text-sm">
                    {message.firstName} {message.lastName}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{message.email}</span>
                  </div>
                  {message.phone && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <span>{formatPhoneNumber(message.phone)}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewMessage(message)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReplyMessage(message)}
                    className="h-8 w-8 p-0"
                  >
                    <Reply className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-sm text-blue-600">
                  {message.subject}
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {truncateMessage(message.message, 120)}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span>
                    {formatDistanceToNow(message.createdAt, {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {messages.length} of {totalCount} messages
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.set("page", (currentPage - 1).toString());
                window.history.pushState({}, "", `?${params.toString()}`);
                window.location.reload();
              }}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => {
                const params = new URLSearchParams(window.location.search);
                params.set("page", (currentPage + 1).toString());
                window.history.pushState({}, "", `?${params.toString()}`);
                window.location.reload();
              }}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
