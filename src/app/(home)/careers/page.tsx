import { Suspense } from "react";
import { Metadata } from "next";
import RoleSelection from "./_components/RoleSelection";
import { ErrorBoundary } from "@/components/error-boundary";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  DollarSign,
  GraduationCap,
  Clock,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join our team at EverKind Community Support. We're looking for compassionate professionals to make a difference in our community.",
};

export default function CareersPage() {
  const benefits = [
    { icon: DollarSign, text: "Competitive Salary" },
    { icon: GraduationCap, text: "Professional Development" },
    { icon: Clock, text: "Flexible Hours" },
    { icon: Heart, text: "Meaningful Work" },
  ];

  return (
    <div className="min-h-screen">
      {/* Modern Hero Section */}
      <section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-mesh-gradient" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 left-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-secondary/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 sm:space-y-8">
            {/* Badge */}
            <div className="animate-fade-in">
              <Badge variant="glass" className="gap-1.5 px-4 py-2 text-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                We&apos;re Hiring
              </Badge>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight animate-slide-up overflow-visible">
              Join Our <span className="text-gradient-animate">Team</span>
            </h1>

            {/* Description */}
            <p
              className="text-muted-foreground text-lg sm:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              We&apos;re looking for{" "}
              <strong>compassionate and dedicated professionals</strong> to join
              our mission of providing exceptional community support services.
              Make a difference in people&apos;s lives every day.
            </p>

            {/* Benefits */}
            <div
              className="flex flex-wrap justify-center gap-4 sm:gap-6 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.text}
                  className="flex items-center gap-2 px-4 py-2 rounded-full glass-light hover:glass transition-all duration-300"
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                >
                  <benefit.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {benefit.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection and Application */}
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
