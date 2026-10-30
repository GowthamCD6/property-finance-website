import React, { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop
 * Ensures that upon navigating to any route, the browser instantly resets
 * the viewport to the very top (Hero Section) before paint, eliminating any
 * unwanted bottom-to-top scroll animation or scroll position carryover.
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, search, hash } = useLocation();

  useLayoutEffect(() => {
    // Disable automatic browser scroll restoration so it never restores old scroll positions
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (!hash) {
      // Instant reset to the very top
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      // If a specific section hash is present (e.g. #calculator), scroll to that element
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;

