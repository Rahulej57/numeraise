"use client";

import { useEffect } from "react";

/**
 * Production-grade mobile virtual keyboard dismiss handler:
 * 1. Automatically dismisses keyboard when the user deliberately scrolls the page with a finger swipe (>20px).
 * 2. Dismisses keyboard when user taps outside any interactive field (cards, chart, background).
 * 3. Prevents race condition where browser auto-scroll on tap would prematurely close the keyboard.
 */
export function MobileKeyboardDismiss() {
  useEffect(() => {
    let touchStartY = 0;
    let touchStartX = 0;
    let focusCooldownUntil = 0;

    // When an input is focused, give it a 500ms grace period so browser auto-scroll doesn't trigger dismissal
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
        focusCooldownUntil = Date.now() + 500;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;

      // Don't dismiss if we are in the focus grace period
      if (Date.now() < focusCooldownUntil) return;

      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")
      ) {
        const target = e.target as HTMLElement | null;
        // If touching outside input controls, sliders, or action buttons, dismiss keyboard
        if (
          target &&
          !target.closest("input, textarea, select, label, [role='slider'], button, [role='button'], a")
        ) {
          (activeEl as HTMLElement).blur();
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      // Don't dismiss if the user just tapped into an input within 500ms
      if (Date.now() < focusCooldownUntil) return;

      const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX);

      // Dismiss ONLY on intentional swipe scroll (> 20px)
      if (deltaY > 20 || deltaX > 20) {
        const activeEl = document.activeElement;
        if (
          activeEl &&
          (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")
        ) {
          (activeEl as HTMLElement).blur();
        }
      }
    };

    window.addEventListener("focusin", handleFocusIn, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return null;
}

