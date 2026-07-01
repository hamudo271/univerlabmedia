import { useLocation } from 'react-router-dom';

/**
 * Thin top-of-page progress bar that replays a quick fill animation on every
 * route change (and on first load), giving SPA navigations a visible loading
 * cue. Keyed by pathname so the CSS animation restarts each time.
 */
export default function TopProgressBar() {
  const { pathname } = useLocation();
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]">
      <div
        key={pathname}
        className="bg-brand-gradient h-full shadow-[0_0_10px_var(--accent-primary)]"
        style={{ animation: 'route-progress 0.7s ease-out forwards' }}
      />
    </div>
  );
}
