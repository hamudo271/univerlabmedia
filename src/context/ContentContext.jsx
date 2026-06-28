import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { contentApi } from "../lib/api.js";
import { defaults as CONTENT_DEFAULTS } from "../../shared/content-defaults.js";

/**
 * ContentContext — loads the site's content map once on mount and exposes it
 * via `useContent()`. Falls back to `shared/content-defaults.js` on network
 * failure so the site still renders offline or during dev without the API.
 *
 * Shape of `content`:
 *   {
 *     home:          { hero:{…}, secrets:{…}, … },
 *     company:       { … },
 *     service:       { … },
 *     serviceDetail: { shared:{…}, services:{ items:[…] } },
 *     portfolio:     { … },
 *     column:        { … },
 *     pricing:       { … },
 *     contact:       { … },
 *     notFound:      { … },
 *     global:        { site:{…}, header:{…}, footer:{…} },
 *   }
 */

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(CONTENT_DEFAULTS);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const data = await contentApi.all();
      // Deep-merge with defaults so new schema fields don't break the UI
      // even if the saved row is stale.
      setContent(mergeDeep(CONTENT_DEFAULTS, data));
      setError(null);
    } catch (err) {
      console.warn("[content] falling back to defaults:", err.message);
      setError(err);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ content, loaded, error, refresh, setContent }),
    [content, loaded, error, refresh]
  );

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

/**
 * Primary hook. Optionally pass a page key to get just that slice, e.g.
 *   const home = useContent("home");
 *   const { hero } = useContent("home");
 * Without a key, returns the entire content map.
 */
export function useContent(key) {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    // Outside provider (e.g. in standalone admin build) — return defaults.
    return key ? CONTENT_DEFAULTS[key] : CONTENT_DEFAULTS;
  }
  return key ? ctx.content[key] : ctx.content;
}

/** Full context, for admin-side refresh triggers. */
export function useContentContext() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContentContext must be used within ContentProvider");
  return ctx;
}

// ─── utils ────────────────────────────────────────────────────────────────
function mergeDeep(base, override) {
  if (override === null || override === undefined) return base;
  if (Array.isArray(override)) return override; // arrays replace wholesale
  if (typeof override !== "object") return override;
  const out = { ...base };
  for (const [k, v] of Object.entries(override)) {
    out[k] = mergeDeep(base?.[k], v);
  }
  return out;
}
