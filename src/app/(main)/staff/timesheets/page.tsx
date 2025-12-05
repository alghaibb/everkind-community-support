import { Suspense } from "react";
import { Metadata } from "next";
import { TimesheetsContent } from "./_components/TimesheetsContent";
import { TimesheetsSkeleton } from "./_components/TimesheetsSkeleton";

export const metadata: Metadata = {
  title: "Timesheets | EverKind Staff",
  description: "Log and manage your work hours",
};

export default function TimesheetsPage() {
  return (
    <Suspense fallback={<TimesheetsSkeleton />}>
      <TimesheetsContent />
    </Suspense>
  );
}
