/**
 * Thin fetch wrapper. Centralizes base URL, auth header injection, and
 * JSON encoding. Throws { status, message } on non-2xx so callers can react
 * uniformly.
 */

const BASE = "/api";
const TOKEN_KEY = "univerlab_admin_token";

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

export function clearToken() {
  setToken(null);
}

async function request(method, path, { body, auth = false, signal } = {}) {
  const headers = {};
  if (body && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body:
      body === undefined || body === null
        ? undefined
        : body instanceof FormData
          ? body
          : JSON.stringify(body),
    signal,
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const err = new Error(data?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function safeJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const api = {
  get: (path, opts) => request("GET", path, opts),
  post: (path, body, opts) => request("POST", path, { ...opts, body }),
  put: (path, body, opts) => request("PUT", path, { ...opts, body }),
  patch: (path, body, opts) => request("PATCH", path, { ...opts, body }),
  del: (path, opts) => request("DELETE", path, opts),
};

// ── Domain helpers ────────────────────────────────────────────────────────
export const contentApi = {
  all: () => api.get("/content"),
  save: (key, value) => api.put(`/content/${key}`, value, { auth: true }),
};

export const authApi = {
  login: (password) => api.post("/auth/login", { password }),
  me: () => api.get("/auth/me", { auth: true }),
};

export const uploadsApi = {
  list: () => api.get("/uploads", { auth: true }),
  create: (file) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post("/uploads", fd, { auth: true });
  },
};

// ── Blog / column posts ────────────────────────────────────────────────────
// Public (no auth) — used by the /column pages and the home highlights.
export const postsApi = {
  list: ({ page = 1, category } = {}) => {
    const qs = new URLSearchParams({ page: String(page) });
    if (category) qs.set("category", category);
    return api.get(`/posts?${qs.toString()}`);
  },
  latest: (limit = 3) => api.get(`/posts/latest?limit=${limit}`),
  get: (slug) => api.get(`/posts/${encodeURIComponent(slug)}`),
};

// Admin (auth) — CRUD from the /admin/posts screens.
export const adminPostsApi = {
  list: () => api.get("/admin/posts", { auth: true }),
  get: (id) => api.get(`/admin/posts/${id}`, { auth: true }),
  create: (data) => api.post("/admin/posts", data, { auth: true }),
  update: (id, data) => api.put(`/admin/posts/${id}`, data, { auth: true }),
  setStatus: (id, status) =>
    api.patch(`/admin/posts/${id}/status`, { status }, { auth: true }),
  remove: (id) => api.del(`/admin/posts/${id}`, { auth: true }),
};
