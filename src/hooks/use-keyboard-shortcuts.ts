"use client";

import { useEffect } from "react";
import { useModal } from "./use-modal";
import { MODAL_TYPES } from "@/app/(main)/admin/constants";

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description?: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs, textareas, or contenteditable elements
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      shortcuts.forEach((shortcut) => {
        const ctrlMatch = shortcut.ctrl ? event.ctrlKey || event.metaKey : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts]);
}

/**
 * Hook for admin-specific keyboard shortcuts
 */
export function useAdminKeyboardShortcuts() {
  const { onOpen, onClose, isOpen } = useModal();

  useKeyboardShortcuts([
    {
      key: "k",
      ctrl: true,
      description: "Open global search",
      action: () => {
        // TODO: Implement global search modal
        console.log("Global search (Ctrl+K) - To be implemented");
      },
    },
    {
      key: "n",
      ctrl: true,
      description: "Create new item",
      action: () => {
        const pathname = window.location.pathname;
        if (pathname.includes("/admin/participants")) {
          onOpen(MODAL_TYPES.CREATE_PARTICIPANT);
        } else if (pathname.includes("/admin/staff")) {
          onOpen(MODAL_TYPES.CREATE_STAFF);
        }
        // Add more routes as needed
      },
    },
    {
      key: "Escape",
      description: "Close modal",
      action: () => {
        if (isOpen) {
          onClose();
        }
      },
    },
  ]);
}

