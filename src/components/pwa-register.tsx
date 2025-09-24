"use client";

import { useEffect } from "react";

/**
 * PWA Service Worker Registration
 * Registers the service worker for offline functionality
 */
export default function PWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "[PWA] Service Worker registered successfully:",
            registration
          );

          // Force update and activation for development
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    console.log(
                      "[PWA] New service worker available, activating..."
                    );
                    // Force activation of new service worker
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    window.location.reload();
                  } else {
                    console.log(
                      "[PWA] Service worker installed for first time"
                    );
                  }
                }
              });
            }
          });

          // Listen for service worker messages
          navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data && event.data.type === "SKIP_WAITING") {
              console.log(
                "[PWA] Skipping waiting, activating new service worker"
              );
              registration.waiting?.postMessage({ type: "SKIP_WAITING" });
            }
          });
        })
        .catch((error) => {
          console.error("[PWA] Service Worker registration failed:", error);
        });
    }
  }, []);

  return null; // This component doesn't render anything
}
