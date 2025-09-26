"use client";

import { useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ContactMessage } from "@/types/admin";
import { useModal } from "@/hooks/use-modal";
import { MODAL_TYPES } from "../../constants";
import { sendReplyEmail } from "../actions";

const replySchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

type ReplyFormValues = z.infer<typeof replySchema>;

export default function ReplyMessageDialog() {
  const { isOpen, type, data, onClose } = useModal();
  const [isPending, startTransition] = useTransition();

  const isModalOpen = isOpen && type === MODAL_TYPES.REPLY_MESSAGE;
  const message = data?.message as ContactMessage;

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  // Initialize form when modal opens
  useEffect(() => {
    if (isModalOpen && message) {
      const defaultSubject = message.subject.startsWith("Re: ")
        ? message.subject
        : `Re: ${message.subject}`;

      form.reset({
        subject: defaultSubject,
        message: "",
      });
    }
  }, [isModalOpen, message, form]);

  async function onSubmit(values: ReplyFormValues) {
    if (!message) return;

    startTransition(async () => {
      try {
        await sendReplyEmail({
          to: message.email,
          toName: `${message.firstName} ${message.lastName}`,
          subject: values.subject,
          message: values.message,
          originalMessage: {
            subject: message.subject,
            message: message.message,
            createdAt: message.createdAt,
          },
        });

        toast.success("Reply sent successfully!");
        form.reset();
        onClose();
      } catch (error) {
        console.error("Failed to send reply:", error);
        toast.error("Failed to send reply. Please try again.");
      }
    });
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      onClose();
    }
  };

  if (!message) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reply to Message</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Recipient Info */}
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-sm">
                <span className="font-medium">To:</span> {message.firstName}{" "}
                {message.lastName} ({message.email})
              </div>
            </div>

            {/* Subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Reply subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your reply message here..."
                      rows={6}
                      className="resize-y w-full break-words whitespace-pre-wrap"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Original Message Reference */}
            <div className="space-y-2">
              <FormLabel className="text-sm font-medium text-muted-foreground">
                Original Message
              </FormLabel>
              <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-muted-foreground/20 max-h-[150px] overflow-y-auto">
                <div className="text-sm">
                  <div className="font-medium mb-2">{message.subject}</div>
                  <div className="text-muted-foreground text-xs mb-3">
                    From: {message.firstName} {message.lastName} (
                    {message.email})
                  </div>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.message}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t mt-6">
              <Button type="submit" disabled={isPending} className="sm:flex-1">
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Send Reply
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
                className="sm:flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
