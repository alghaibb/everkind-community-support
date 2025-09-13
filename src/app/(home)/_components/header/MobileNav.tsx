"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "../../constants";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expandedServices, setExpandedServices] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <SheetTitle className="sr-only">Toggle menu</SheetTitle>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col space-y-4 mt-8">
          {navLinks.map((link) => (
            <div key={link.href}>
              {link.subLinks ? (
                <div>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-3 py-2 text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setExpandedServices(!expandedServices)}
                  >
                    {link.label}
                    {expandedServices ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  {expandedServices && (
                    <div className="ml-4 mt-2 space-y-2">
                      {link.subLinks.map((subLink) => (
                        <Link
                          key={subLink.href}
                          href={subLink.href}
                          className="block px-3 py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={link.href}
                  className="block px-3 py-2 text-lg font-medium hover:text-primary transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
