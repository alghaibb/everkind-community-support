import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { getServerSession } from "@/lib/get-session";

export default async function StaffLoginButton() {
  const session = await getServerSession();

  // If user is already logged in, don't show the login button
  if (session?.user) {
    return null;
  }

  // Only show login button to non-authenticated users
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <Button asChild className="gap-2">
          <Link href="/login">
            <LogIn className="h-4 w-4" />
            Staff Login
          </Link>
        </Button>
      </div>
    </>
  );
}
