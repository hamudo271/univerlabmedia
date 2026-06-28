/**
 * Final Express error handler. Logs the error and returns JSON.
 * Always place this AFTER all routes.
 */
export function errorHandler(err, req, res, _next) {
  const status = err.status || err.statusCode || 500;
  const message =
    status >= 500
      ? "Internal server error"
      : err.message || "Request failed";

  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, err);
  }

  res.status(status).json({ error: message });
}

/** 404 fallback for unknown /api/* routes. */
export function apiNotFound(req, res) {
  res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` });
}
