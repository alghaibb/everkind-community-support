import { Suspense } from "react";
import { CareersPageContent } from "./_components/CareersPageContent";
import { CareersTableSkeleton } from "./_components/CareersTableSkeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Applications",
  description: "Review job applications from potential staff members.",
};

export default async function CareersPage() {
  return (
    <Suspense fallback={<CareersTableSkeleton />}>
      <CareersPageContent />
    </Suspense>
  );
}
