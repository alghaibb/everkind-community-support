"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export default function LogoutButton({
  className,
  variant,
  size,
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    const { error } = await authClient.signOut();

    if (error) {
      toast.error(error.message || "Failed to logout");
    } else {
      // Clear service worker cache on logout
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" });
      }

      toast.success("Logged out successfully");
      router.push("/");
      router.refresh();
    }

    setIsLoading(false);
  }

  return (
    <Button
      onClick={handleLogout}
      className={cn("w-full", className)}
      loading={isLoading}
      loadingText="Logging out..."
      disabled={isLoading}
      variant={variant}
      size={size}
    >
      <LogOut className="h-5 w-5 shrink-0 text-background" />
      <span>Logout</span>
    </Button>
  );
}
