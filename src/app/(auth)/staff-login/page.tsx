import Link from "next/link";
import { Button } from "@/components/ui/button";
import StaffLoginForm from "./StaffLoginForm";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

export default function StaffLoginPage() {
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <div className="mr-2 h-6 w-6 rounded bg-white/20" />
            EverKind Community Support
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Welcome to the staff portal. Access your schedule,
                participant information, and support resources.&rdquo;
              </p>
              <footer className="text-sm">Staff Portal</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Staff Login
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your credentials to access the staff portal
              </p>
            </div>
            <StaffLoginForm />
            <Separator />
            <Button asChild variant="link">
              <Link href="/family-login">
                Family member? Click here to login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
