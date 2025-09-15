import { Suspense } from "react";
import { Metadata } from "next";
import RoleSelectionClient from "./_components/RoleSelection";
import { ErrorBoundary } from "@/components/error-boundary";
import { Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join our team at EverKind Community Support. We're looking for compassionate professionals to make a difference in our community.",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Join Our Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We&apos;re looking for compassionate and dedicated professionals
              to join our mission of providing exceptional community support
              services.
            </p>
          </div>
        </div>
      </section>

      {/* Role Selection and Application */}
      <ErrorBoundary>
        <Suspense fallback={<Spinner variant="circle" />}>
          <RoleSelectionClient />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
