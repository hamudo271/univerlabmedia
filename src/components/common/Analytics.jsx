import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// GA4 measurement ID. This is public by design — it ships in the page source —
// so a default keeps production working without build-time config. Override per
// environment with VITE_GA_ID.
const GA_ID = import.meta.env.VITE_GA_ID || 'G-6T1VR34XHP';

// Only the live domain reports. Keeps localhost, Railway preview URLs and forks
// from polluting the property.
const PROD_HOST = 'univerlabmedia.co.kr';
const enabled = () =>
  Boolean(GA_ID) &&
  (window.location.hostname === PROD_HOST || window.location.hostname.endsWith(`.${PROD_HOST}`));

let injected = false;
function loadGtag() {
  if (injected) return;
  injected = true;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  // gtag must push `arguments` verbatim — a rest-arg array breaks the SDK.
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  // page_view is sent per route below instead, so it carries the title that
  // react-helmet-async has actually committed for the new page.
  window.gtag('config', GA_ID, { send_page_view: false });
}

/**
 * Loads GA4 and reports a page_view on every client-side route change.
 * Mounted inside the public site only, so /admin usage stays out of reports.
 */
export default function Analytics() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (enabled()) loadGtag();
  }, []);

  useEffect(() => {
    if (!enabled()) return undefined;
    // Defer a tick so <Helmet> has swapped document.title for this route.
    const t = setTimeout(() => {
      window.gtag?.('event', 'page_view', {
        page_path: pathname + search,
        page_title: document.title,
        page_location: window.location.href,
      });
    }, 0);
    return () => clearTimeout(t);
  }, [pathname, search]);

  return null;
}
