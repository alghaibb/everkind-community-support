import { Suspense } from "react";
import { Metadata } from "next";
import RoleSelection from "./_components/RoleSelection";
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
      {/* Modern Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary/5 via-accent/5 to-background overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">
                We&apos;re Hiring
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent leading-tight">
              Join Our Team
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We&apos;re looking for compassionate and dedicated professionals
              to join our mission of providing exceptional community support
              services. Make a difference in people&apos;s lives every day.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Competitive Salary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Professional Development</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Flexible Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                <span>Meaningful Work</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Role Selection and Application */}
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="py-20">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center min-h-[400px]">
                  <Spinner variant="circle" />
                </div>
              </div>
            </div>
          }
        >
          <RoleSelection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
