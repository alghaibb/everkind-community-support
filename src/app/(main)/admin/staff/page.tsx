import { Suspense } from "react";
import { StaffPageContent } from "./_components/StaffPageContent";
import { StaffTableSkeleton } from "./_components/StaffTableSkeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Management",
  description: "Manage team members, roles, and staff information.",
};

export default function StaffPage() {
  return (
    <Suspense fallback={<StaffTableSkeleton />}>
      <StaffPageContent />
    </Suspense>
  );
}
