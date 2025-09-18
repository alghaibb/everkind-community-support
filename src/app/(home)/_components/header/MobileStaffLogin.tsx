"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";

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
    <Link
      href="/login"
      className="flex items-center gap-2 px-3 py-2 text-lg font-medium hover:text-primary transition-colors border-t pt-4 mt-2"
      onClick={onClose}
    >
      <LogIn className="h-5 w-5" />
      Staff Login
    </Link>
  );
}
