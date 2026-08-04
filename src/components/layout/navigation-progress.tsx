'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * Thin progress bar across the top of the viewport during route changes.
 *
 * The App Router gives no router events to hook into, so this detects the start
 * of a navigation from the click itself and ends it when the pathname actually
 * changes. That ordering matters: the bar appears on the tap, before React has
 * begun rendering anything, which is precisely the window where the site felt
 * broken on mobile.
 *
 * Skeletons alone are not enough here. A prerendered page can still take a
 * moment to fetch its payload on a slow connection, and during that window the
 * old page is still on screen with no indication anything is happening.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    function onClick(e: MouseEvent) {
      // Ignore modified clicks — the browser handles those itself.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      // Same-document and external links do not trigger a route change.
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      start();
    }

    function start() {
      clearTimers();
      setVisible(true);
      setProgress(8);
      // Ease toward 90% so the bar always looks alive, then wait for the real
      // navigation to finish it. Never reaches 100 on its own.
      timers.current.push(setTimeout(() => setProgress(35), 90));
      timers.current.push(setTimeout(() => setProgress(62), 260));
      timers.current.push(setTimeout(() => setProgress(80), 600));
      timers.current.push(setTimeout(() => setProgress(90), 1200));
    }

    document.addEventListener('click', onClick, { capture: true });
    return () => {
      document.removeEventListener('click', onClick, { capture: true });
      clearTimers();
    };
  }, []);

  // Pathname changed => the navigation committed. Complete and fade out.
  useEffect(() => {
    clearTimers();
    setProgress(100);
    const t = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 220);
    timers.current.push(t);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 print:hidden"
      role="progressbar"
      aria-label="Loading page"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div
        className="h-full bg-primary shadow-[0_0_8px_rgba(0,0,0,0.15)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
      />
    </div>
  );
}
