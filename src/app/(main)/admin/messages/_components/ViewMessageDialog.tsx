"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, Calendar, Reply } from "lucide-react";
import { format } from "date-fns";
import { formatPhoneNumber } from "@/lib/phone-utils";
import { ContactMessage } from "@/types/admin";
import { useModal } from "@/hooks/use-modal";
import { MODAL_TYPES } from "../../constants";

export default function ViewMessageDialog() {
  const { isOpen, type, data, onClose, onOpen } = useModal();

  const isModalOpen = isOpen && type === MODAL_TYPES.VIEW_MESSAGE;
  const message = data?.message as ContactMessage;

  if (!message) return null;

  const handleReply = () => {
    onClose();
    onOpen(MODAL_TYPES.REPLY_MESSAGE, { message });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact Message Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Full Name
                </div>
                <div className="font-medium">
                  {message.firstName} {message.lastName}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Email Address
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{message.email}</span>
                </div>
              </div>
              {message.phone && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{formatPhoneNumber(message.phone)}</span>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Received
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{format(message.createdAt, "PPP 'at' p")}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Subject */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Subject
            </div>
            <div className="font-medium text-lg">{message.subject}</div>
          </div>

          <Separator />

          {/* Message Content */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              Message
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.message}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button onClick={handleReply} className="flex-1">
              <Reply className="mr-2 h-4 w-4" />
              Send Reply
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
