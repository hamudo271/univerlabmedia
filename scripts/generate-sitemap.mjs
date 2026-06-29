/**
 * Build-time sitemap generator.
 *
 * Reads the real route list (incl. dynamic service-detail pages) from
 * shared/content-defaults.js and writes public/sitemap.xml with a current
 * <lastmod>. Runs before `vite build`, so the bundled dist always ships a
 * complete, up-to-date sitemap that both Google and Naver can crawl.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { defaults } from "../shared/content-defaults.js";

const SITE_URL = "https://univerlabmedia.co.kr";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(__dirname, "../public/sitemap.xml");

const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

// Static routes (priority / change frequency tuned for an agency site).
const routes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/company", changefreq: "monthly", priority: "0.8" },
  { path: "/service", changefreq: "monthly", priority: "0.9" },
  { path: "/portfolio", changefreq: "weekly", priority: "0.8" },
  { path: "/pricing", changefreq: "monthly", priority: "0.9" },
  { path: "/column", changefreq: "weekly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
];

// Dynamic service-detail pages, derived from content so new services are
// picked up automatically.
for (const svc of defaults.serviceDetail?.services?.items ?? []) {
  routes.push({
    path: `/service/${svc.id}`,
    changefreq: "monthly",
    priority: "0.8",
  });
}

const body = routes
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(OUT, xml, "utf8");
console.log(`[sitemap] wrote ${routes.length} URLs to public/sitemap.xml (lastmod ${today})`);
