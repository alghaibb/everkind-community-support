import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import StaffLoginButton from "./StaffLoginButton";
import { UserDropdown } from "@/components/ui/user-dropdown";
import { getServerSession } from "@/lib/get-session";

export default async function Header() {
  const session = await getServerSession();
  const user = session?.user;

  const userForDropdown = user
    ? {
        ...user,
        role: user.role || undefined,
      }
    : null;

  const showAdminRoutes = userForDropdown?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
          >
            <Image
              src="/ekcs-logo.png"
              alt="EverKind Community Support"
              width={150}
              height={150}
              priority
              className="drop-shadow-sm"
            />
          </Link>

          <div className="hidden md:flex flex-1 justify-center">
            <Navbar />
          </div>

          {/* Desktop User Dropdown */}
          <div className="hidden md:block">
            {userForDropdown ? (
              <UserDropdown
                user={userForDropdown}
                showAdminRoutes={showAdminRoutes}
              />
            ) : (
              <StaffLoginButton />
            )}
          </div>

          <div className="md:hidden flex-1 flex justify-end">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
