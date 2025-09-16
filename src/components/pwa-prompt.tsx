"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Download, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

/**
 * PWA Install Prompt Component
 * Shows install prompt for supported devices and browsers
 */
export default function PWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [hasSeenPrompt, setHasSeenPrompt] = useLocalStorage(
    "pwa-prompt-dismissed",
    false
  );

  useEffect(() => {
    // Check if running in standalone mode
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Check if iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!hasSeenPrompt) {
        setShowPrompt(true);
      }
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    // Show iOS prompt if on iOS and not standalone
    if (isIOS && !isStandalone && !hasSeenPrompt) {
      setTimeout(() => setShowPrompt(true), 3000); // Show after 3 seconds
    }

    // For testing in development - show prompt after 5 seconds if not seen before
    if (
      process.env.NODE_ENV === "development" &&
      !hasSeenPrompt &&
      !isStandalone
    ) {
      setTimeout(() => setShowPrompt(true), 5000);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, [isIOS, isStandalone, hasSeenPrompt]);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      setDeferredPrompt(null);
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setHasSeenPrompt(true);
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto"
        >
          <Card className="border-0 shadow-2xl bg-card/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    Install EKCS App
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {isIOS
                      ? "Add to your home screen for quick access to our services."
                      : "Install our app for faster access and offline support."}
                  </p>

                  <div className="flex gap-2">
                    {isIOS ? (
                      <div className="text-xs text-muted-foreground">
                        Tap <strong>Share</strong> →{" "}
                        <strong>Add to Home Screen</strong>
                      </div>
                    ) : (
                      <Button
                        onClick={handleInstall}
                        size="sm"
                        className="h-8 px-3 text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Install
                      </Button>
                    )}

                    <Button
                      onClick={handleDismiss}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
