import FamilyLoginForm from "./FamilyLoginForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FamilyLoginPage() {
  return (
    <div className="container relative h-screen flex flex-col lg:max-w-none lg:px-0">
      <div className="absolute top-4 right-4 z-10">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
      <div className="flex-1 flex-col items-center justify-center grid lg:grid-cols-2">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <div className="mr-2 h-6 w-6 rounded bg-white/20" />
            EverKind Community Support
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Stay connected with your loved one&apos;s care. View updates,

                schedules, and communicate with the care team.&rdquo;
              </p>
              <footer className="text-sm">Family Portal</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Family Portal
              </h1>
              <p className="text-sm text-muted-foreground">
                Access your family member&apos;s care information
              </p>
            </div>
            <FamilyLoginForm />
            <Separator />
            <Button asChild variant="link">
              <Link href="/staff-login">Staff member? Click here to login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
