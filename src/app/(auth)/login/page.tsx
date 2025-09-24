import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function LoginPage() {
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
        <h1 className="text-2xl sm:text-3xl font-bold">Staff Portal</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Log in to access your dashboard
        </p>
      </div>

      <Card>
        <CardHeader className="space-y-1 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">Login</CardTitle>
          <CardDescription className="text-sm">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8 space-y-6">
          <LoginForm />

          <Separator />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Don&apos;t have an account?{" "}
            </span>
            <Button asChild variant="link" className="px-0 text-sm">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
