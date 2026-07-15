import { Router } from "express";
import { authRequired } from "../middleware/authRequired.js";
import { getStats } from "../lib/ga4.js";

const router = Router();

// Stats come from the GA4 Data API (no database involved).
router.use(authRequired);

/**
 * GET /api/admin/stats
 * Cached GA4 dashboard bundle. `?refresh=1` forces a re-fetch, rate-limited
 * server-side so it cannot burn quota.
 */
router.get("/", async (req, res, next) => {
  try {
    const stats = await getStats({ force: req.query.refresh === "1" });
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;
