"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileStaffLoginProps {
  showStaffLogin: boolean;
  onClose: () => void;
}

export default function MobileStaffLogin({
  showStaffLogin,
  onClose,
}: MobileStaffLoginProps) {
  if (!showStaffLogin) return null;

  return (
    <div className="border-t border-border pt-4 mt-2 flex items-center justify-center">
      <Button asChild className="gap-2" variant="ghost">
        <Link href="/login" onClick={onClose}>
          <LogIn className="h-5 w-5 shrink-0" />
          Log In
        </Link>
      </Button>
    </div>
  );
}
