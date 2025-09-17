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
import Link from "next/link";
import { Eye, Mail, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ContactMessage } from "@/generated/prisma";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContactMessagesTableProps {
  messages: ContactMessage[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export default function ContactMessagesTable({
  messages,
  currentPage,
  totalPages,
  totalCount,
}: ContactMessagesTableProps) {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );

  return (
    <>
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No messages found
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">
                      {message.firstName} {message.lastName}
                    </TableCell>
                    <TableCell>
                      {message.subject ? (
                        <span className="line-clamp-1">{message.subject}</span>
                      ) : (
                        <Badge variant="outline">No subject</Badge>
                      )}
                    </TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.phone}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(message.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`mailto:${message.email}`}>
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
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
                  href={`/admin/messages?page=${currentPage - 1}`}
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
                  href={`/admin/messages?page=${currentPage + 1}`}
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

      {/* Message View Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        {selectedMessage && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Message Details</DialogTitle>
              <DialogDescription>
                From {selectedMessage.firstName} {selectedMessage.lastName}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-sm">{selectedMessage.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-sm">{selectedMessage.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Subject
                  </p>
                  <p className="text-sm">
                    {selectedMessage.subject || "No subject"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Received
                  </p>
                  <p className="text-sm">
                    {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Message
                </p>
                <p className="mt-2 whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">
                  {selectedMessage.message}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" asChild>
                  <a href={`mailto:${selectedMessage.email}`}>
                    <Mail className="mr-2 h-4 w-4" />
                    Reply
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}
