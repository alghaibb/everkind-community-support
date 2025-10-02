import { Suspense } from "react";
import { SchedulingPageContent } from "./_components/SchedulingPageContent";
import { SchedulingSkeleton } from "./_components/SchedulingSkeleton";
import { Metadata } from "next";
import { getServerSession } from "@/lib/get-session";
import { forbidden, unauthorized } from "next/navigation";

export const metadata: Metadata = {
  title: "Scheduling",
  description:
    "Manage staff schedules, participant appointments, and service delivery tracking.",
};

export default async function SchedulingPage() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return unauthorized();
  }

  if (user.userType !== "INTERNAL" || user.role !== "ADMIN") {
    return forbidden();
  }

  return <SchedulingPageContent />;
}
