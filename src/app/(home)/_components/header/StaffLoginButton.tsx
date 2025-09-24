import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { getServerSession } from "@/lib/get-session";

export default async function StaffLoginButton() {
  const session = await getServerSession();

  if (session?.user) {
    return null;
  }

  return (
    <>
      <div className="hidden md:block">
        <Button asChild className="gap-2">
          <Link href="/login">
            <LogIn className="h-4 w-4" />
            Log In
          </Link>
        </Button>
      </div>
    </>
  );
}
