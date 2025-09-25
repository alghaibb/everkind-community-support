import { Suspense } from "react";
import { MessagesPageContent } from "./_components/MessagesPageContent";
import { MessagesTableSkeleton } from "./_components/MessagesTableSkeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Messages",
  description:
    "Manage and respond to contact inquiries from families and potential clients.",
};

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesTableSkeleton />}>
      <MessagesPageContent />
    </Suspense>
  );
}
