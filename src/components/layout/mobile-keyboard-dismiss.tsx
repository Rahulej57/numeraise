"use client";

import { useEffect } from "react";

/**
 * Automatically dismisses the mobile virtual keyboard when:
 * 1. The user scrolls the page (touchmove > 8px or window scroll)
 * 2. The user taps / touches outside any input field (cards, charts, background)
 * 3. Prevents the mobile keyboard from persistently blocking the screen
 */
export function MobileKeyboardDismiss() {
  useEffect(() => {
    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;

      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")
      ) {
        const target = e.target as HTMLElement | null;
        // If touching outside input controls or labels, dismiss keyboard
        if (target && !target.closest("input, textarea, select, [role='combobox']")) {
          (activeEl as HTMLElement).blur();
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX);

      // If user is scrolling the screen (moved > 8px), dismiss keyboard
      if (deltaY > 8 || deltaX > 8) {
        const activeEl = document.activeElement;
        if (
          activeEl &&
          (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")
        ) {
          (activeEl as HTMLElement).blur();
        }
      }
    };

    const handleScroll = () => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")
      ) {
        (activeEl as HTMLElement).blur();
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}
