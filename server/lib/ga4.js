import jwt from "jsonwebtoken";
import { readFileSync } from "node:fs";
import { Buffer } from "node:buffer";

/**
 * GA4 Data API client (service-account, REST — no SDK dependency).
 *
 * Free-quota strategy: the Data API allows 25,000 requests/day per property.
 * Reports are fetched with ONE batchRunReports call and cached in memory for
 * an hour (REPORT_TTL), realtime active-users for a minute — so a day of
 * heavy dashboard use costs at most ~24 report calls + ~1,440 realtime calls,
 * a fraction of the quota. Force refresh is additionally cooldown-limited.
 *
 * Credentials (either):
 *   GA_SERVICE_ACCOUNT_JSON  entire service-account JSON as one env value
 *   GA_SERVICE_ACCOUNT_FILE  path to the JSON file (local dev)
 * Property:
 *   GA4_PROPERTY_ID          numeric property id. If unset, auto-discovered
 *                            via the Admin API (requires that API enabled).
 */

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const DATA_API = "https://analyticsdata.googleapis.com/v1beta";
const ADMIN_API = "https://analyticsadmin.googleapis.com/v1beta";

const REPORT_TTL = Number(process.env.GA_STATS_CACHE_MS) || 60 * 60 * 1000; // 1h
const REALTIME_TTL = 60 * 1000; // 1min
const FORCE_COOLDOWN = 5 * 60 * 1000; // manual refresh at most every 5min

// ── Credentials ─────────────────────────────────────────────────────────────

let creds = null;
let credsTried = false;
// Why loading failed, so the dashboard can name the actual problem instead of
// lumping "variable absent" together with "variable present but mangled".
let credsFailure = null; // { reason, detail }

/** Metadata safe to show in the UI — never any key material. */
function describe(raw) {
  const head = raw.trimStart().slice(0, 1);
  return `길이 ${raw.length}자, 첫 글자 "${head}"`;
}

function loadCreds() {
  if (credsTried) return creds;
  credsTried = true;

  const envJson = process.env.GA_SERVICE_ACCOUNT_JSON;
  const envB64 = process.env.GA_SERVICE_ACCOUNT_BASE64;
  const envFile = process.env.GA_SERVICE_ACCOUNT_FILE;

  let raw = null;
  try {
    if (envJson && envJson.trim()) {
      raw = envJson;
    } else if (envB64 && envB64.trim()) {
      raw = Buffer.from(envB64.trim(), "base64").toString("utf8");
    } else if (envFile) {
      raw = readFileSync(envFile, "utf8");
    }
  } catch (err) {
    credsFailure = { reason: "creds-unreadable", detail: err.message };
    console.error("[ga4] cannot read credentials source:", err.message);
    return null;
  }

  if (!raw || !raw.trim()) {
    credsFailure = { reason: "no-credentials" };
    console.error(
      "[ga4] GA_SERVICE_ACCOUNT_JSON / _BASE64 / _FILE are all empty — stats disabled."
    );
    return null;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    credsFailure = {
      reason: "creds-not-json",
      detail: `${describe(raw)} — ${err.message}`,
    };
    console.error(`[ga4] credentials are not valid JSON (${describe(raw)}):`, err.message);
    return null;
  }

  const missing = ["client_email", "private_key", "token_uri"].filter((k) => !parsed[k]);
  if (missing.length) {
    credsFailure = {
      reason: "creds-incomplete",
      detail: `누락된 필드: ${missing.join(", ")}`,
    };
    console.error("[ga4] service-account JSON missing fields:", missing.join(", "));
    return null;
  }

  creds = parsed;
  console.log(`[ga4] credentials loaded for ${parsed.client_email}`);
  return creds;
}

// ── OAuth token (cached until shortly before expiry) ────────────────────────

let tokenCache = { token: null, exp: 0 };

async function getAccessToken() {
  const c = loadCreds();
  if (!c) throw new GaError("no-credentials");
  if (tokenCache.token && Date.now() < tokenCache.exp) return tokenCache.token;

  const now = Math.floor(Date.now() / 1000);
  const assertion = jwt.sign(
    { iss: c.client_email, scope: SCOPE, aud: c.token_uri, iat: now, exp: now + 3600 },
    c.private_key,
    { algorithm: "RS256" }
  );
  const res = await fetch(c.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    console.error("[ga4] token exchange failed:", JSON.stringify(data).slice(0, 300));
    throw new GaError("bad-credentials");
  }
  tokenCache = { token: data.access_token, exp: Date.now() + (data.expires_in - 60) * 1000 };
  return tokenCache.token;
}

// ── Property resolution ─────────────────────────────────────────────────────

// The site's measurement id — used to pick the right property when the
// service account can see several (e.g. account-level access).
const MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID || "G-6T1VR34XHP";

let discoveredProperty = null;

async function resolveProperty(token) {
  const envId = process.env.GA4_PROPERTY_ID;
  if (envId) return `properties/${String(envId).replace(/^properties\//, "")}`;
  if (discoveredProperty) return discoveredProperty;

  const headers = { Authorization: `Bearer ${token}` };
  const res = await fetch(`${ADMIN_API}/accountSummaries?pageSize=200`, { headers });
  const data = await res.json();
  if (!res.ok) {
    const reason = data?.error?.details?.some((d) => d.reason === "SERVICE_DISABLED")
      ? "admin-api-disabled"
      : "no-property-access";
    throw new GaError(reason, data?.error?.message);
  }
  const props = data.accountSummaries?.flatMap((a) => a.propertySummaries || []) || [];
  if (!props.length) {
    throw new GaError("no-property-access", "서비스 계정이 접근 가능한 GA4 속성이 없습니다.");
  }

  // Find the property whose web stream carries our measurement id.
  let picked = props.length === 1 ? props[0] : null;
  if (!picked) {
    for (const p of props) {
      try {
        const sRes = await fetch(`${ADMIN_API}/${p.property}/dataStreams`, { headers });
        const sData = await sRes.json();
        const match = (sData.dataStreams || []).some(
          (s) => s.webStreamData?.measurementId === MEASUREMENT_ID
        );
        if (match) {
          picked = p;
          break;
        }
      } catch {
        /* try the next property */
      }
    }
  }
  if (!picked) {
    const list = props.map((p) => `${p.displayName}(${p.property})`).join(", ");
    throw new GaError(
      "wrong-property",
      `접근 가능한 속성 중 측정 ID ${MEASUREMENT_ID}를 쓰는 속성이 없습니다. 접근 가능: ${list}`
    );
  }
  discoveredProperty = picked.property; // "properties/123456789"
  console.log(`[ga4] auto-discovered ${picked.property} (${picked.displayName})`);
  return discoveredProperty;
}

// ── Report fetching ─────────────────────────────────────────────────────────

class GaError extends Error {
  constructor(reason, detail) {
    super(detail || reason);
    this.reason = reason;
    this.detail = detail;
  }
}

async function gaPost(token, path, body) {
  const res = await fetch(`${DATA_API}/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data?.error?.message || `GA4 API HTTP ${res.status}`;
    const reason = data?.error?.details?.some((d) => d.reason === "SERVICE_DISABLED")
      ? "data-api-disabled"
      : res.status === 403
        ? "no-property-access"
        : "api-error";
    console.error("[ga4]", path, res.status, msg.slice(0, 300));
    throw new GaError(reason, msg);
  }
  return data;
}

const num = (v) => (v == null ? 0 : Number(v));
const rows = (report) =>
  (report?.rows || []).map((r) => ({
    dims: (r.dimensionValues || []).map((d) => d.value),
    mets: (r.metricValues || []).map((m) => num(m.value)),
  }));

async function fetchReports() {
  const token = await getAccessToken();
  const property = await resolveProperty(token);

  // One API call for all four reports (batch counts as a single request).
  const batch = await gaPost(token, `${property}:batchRunReports`, {
    requests: [
      {
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        metrics: [
          { name: "activeUsers" },
          { name: "newUsers" },
          { name: "screenPageViews" },
          { name: "sessions" },
          { name: "averageSessionDuration" },
          { name: "engagementRate" },
        ],
      },
      {
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
        orderBys: [{ dimension: { dimensionName: "date" } }],
      },
      {
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "pagePath" }],
        metrics: [{ name: "screenPageViews" }, { name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 10,
      },
      {
        dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [{ name: "sessions" }, { name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 8,
      },
    ],
  });

  const [totalsR, dailyR, pagesR, channelsR] = batch.reports || [];
  const t = rows(totalsR)[0]?.mets || [];

  return {
    propertyId: property.replace("properties/", ""),
    range: { start: "28daysAgo", end: "today" },
    totals: {
      activeUsers: t[0] ?? 0,
      newUsers: t[1] ?? 0,
      pageViews: t[2] ?? 0,
      sessions: t[3] ?? 0,
      avgSessionSec: Math.round(t[4] ?? 0),
      engagementRate: t[5] ?? 0,
    },
    daily: rows(dailyR).map((r) => ({
      date: r.dims[0],
      users: r.mets[0],
      views: r.mets[1],
    })),
    topPages: rows(pagesR).map((r) => ({
      path: r.dims[0],
      views: r.mets[0],
      users: r.mets[1],
    })),
    channels: rows(channelsR).map((r) => ({
      channel: r.dims[0],
      sessions: r.mets[0],
      users: r.mets[1],
    })),
  };
}

async function fetchRealtime() {
  const token = await getAccessToken();
  const property = await resolveProperty(token);
  const data = await gaPost(token, `${property}:runRealtimeReport`, {
    metrics: [{ name: "activeUsers" }],
  });
  return { activeUsers: num(data?.rows?.[0]?.metricValues?.[0]?.value) };
}

// ── Public API with caching ─────────────────────────────────────────────────

let reportCache = { data: null, at: 0 };
let realtimeCache = { data: null, at: 0 };
let lastForce = 0;

export function gaConfigured() {
  return Boolean(loadCreds());
}

/**
 * Cached stats bundle for the admin dashboard. Never throws — returns
 * { configured:false, reason } so the UI can render setup guidance.
 */
export async function getStats({ force = false } = {}) {
  if (!gaConfigured()) {
    return {
      configured: false,
      reason: credsFailure?.reason || "no-credentials",
      detail: credsFailure?.detail,
    };
  }

  const now = Date.now();
  const canForce = force && now - lastForce > FORCE_COOLDOWN;
  if (canForce) lastForce = now;

  try {
    if (!reportCache.data || now - reportCache.at > REPORT_TTL || canForce) {
      reportCache = { data: await fetchReports(), at: now };
    }
    if (!realtimeCache.data || now - realtimeCache.at > REALTIME_TTL) {
      realtimeCache = { data: await fetchRealtime(), at: now };
    }
    return {
      configured: true,
      cachedAt: new Date(reportCache.at).toISOString(),
      realtime: realtimeCache.data,
      ...reportCache.data,
    };
  } catch (err) {
    // Serve stale data if we have it (e.g. transient API hiccup).
    if (reportCache.data) {
      return {
        configured: true,
        cachedAt: new Date(reportCache.at).toISOString(),
        stale: true,
        realtime: realtimeCache.data || { activeUsers: 0 },
        ...reportCache.data,
      };
    }
    const reason = err instanceof GaError ? err.reason : "api-error";
    return { configured: false, reason, detail: err.detail || err.message };
  }
}
