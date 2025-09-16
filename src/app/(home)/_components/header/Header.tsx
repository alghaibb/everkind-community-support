import Image from "next/image";
import Link from "next/link";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/ekcs-logo.png"
              alt="EverKind Community Support"
              width={150}
              height={150}
              priority
            />
          </Link>

          <div className="hidden md:flex flex-1 justify-center">
            <Navbar />
          </div>

          <div className="md:hidden flex-1 flex justify-end">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
