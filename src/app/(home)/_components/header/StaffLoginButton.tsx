import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, Users, Heart, ChevronDown } from "lucide-react";
import { getServerSession } from "@/lib/get-session";

export default async function StaffLoginButton() {
  const session = await getServerSession();

  if (session?.user) {
    return null;
  }

  return (
    <div className="hidden md:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="gap-2">
            <LogIn className="h-4 w-4" />
            Log In
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem asChild>
            <Link href="/staff-login" className="cursor-pointer">
              <Users className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>Staff Portal</span>
                <span className="text-xs text-muted-foreground">
                  For staff and administrators
                </span>
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/family-login" className="cursor-pointer">
              <Heart className="mr-2 h-4 w-4" />
              <div className="flex flex-col">
                <span>Family Portal</span>
                <span className="text-xs text-muted-foreground">
                  For family members
                </span>
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
