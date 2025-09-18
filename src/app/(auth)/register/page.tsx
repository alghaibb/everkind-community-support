import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account to access your dashboard",
};

export default async function RegisterPage() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="flex justify-center mb-4 sm:mb-6">
        <Link href="/" className="inline-block">
          <Image
            src="/ekcs-logo.png"
            alt="EverKind Community Support"
            width={120}
            height={120}
            className="h-20 w-auto sm:h-24"
            priority
          />
        </Link>
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">Register</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Create a new account to access your dashboard
        </p>
      </div>
      <Card>
        <CardHeader className="space-y-1 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">Register</CardTitle>
          <CardDescription className="text-sm">
            Create a new account to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8 space-y-6">
          <RegisterForm />

          <Separator />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Button asChild variant="link" className="px-0 text-sm">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
