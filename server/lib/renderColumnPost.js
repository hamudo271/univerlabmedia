/**
 * Server-side meta/content injection for /column/:slug.
 *
 * The site is a client-rendered SPA, so the raw HTML shell carries no
 * per-post metadata — bad for link-preview scrapers (KakaoTalk, Facebook,
 * X) and non-JS crawlers. This reads the built dist/index.html once and,
 * for a given post, swaps in post-specific <title>/description/canonical/OG
 * tags, appends an Article JSON-LD block, and pre-fills #root with the post
 * body (which React harmlessly replaces on mount for real users).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_HTML = path.join(__dirname, "..", "..", "dist", "index.html");
const SITE_URL = "https://univerlabmedia.co.kr";
const SITE_NAME = "유니버랩 미디어";

let templateCache = null;
function template() {
  if (templateCache !== null) return templateCache;
  try {
    templateCache = fs.readFileSync(INDEX_HTML, "utf8");
  } catch {
    templateCache = "";
  }
  return templateCache;
}

/** Escape text for use inside an HTML attribute value. */
function attr(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Escape text for HTML text content. */
function text(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Make a JS object safe to embed inside a <script> tag. */
function jsonForScript(obj) {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function fmtDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

/**
 * Returns the HTML string for a post, or null if the template is unavailable
 * (e.g. running before a build) so the caller can fall through to the SPA.
 */
export function renderColumnPost(post) {
  let html = template();
  if (!html) return null;

  const url = `${SITE_URL}/column/${encodeURIComponent(post.slug)}`;
  const desc = (post.excerpt || post.title || "").slice(0, 200);
  const image = post.thumbnailUrl
    ? post.thumbnailUrl.startsWith("http")
      ? post.thumbnailUrl
      : `${SITE_URL}${post.thumbnailUrl}`
    : `${SITE_URL}/og-image.png`;
  const fullTitle = `${post.title} | ${SITE_NAME}`;

  const replacements = [
    // <title>
    [
      /<title>[\s\S]*?<\/title>/,
      `<title>${text(fullTitle)}</title>`,
    ],
    // meta description
    [
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${attr(desc)}" />`,
    ],
    // canonical
    [
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${attr(url)}" />`,
    ],
    // og:type
    [
      /<meta property="og:type" content="[^"]*" \/>/,
      `<meta property="og:type" content="article" />`,
    ],
    // og:url
    [
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${attr(url)}" />`,
    ],
    // og:title
    [
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${attr(fullTitle)}" />`,
    ],
    // og:description
    [
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${attr(desc)}" />`,
    ],
    // og:image
    [
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${attr(image)}" />`,
    ],
    // twitter:title
    [
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${attr(fullTitle)}" />`,
    ],
    // twitter:description
    [
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${attr(desc)}" />`,
    ],
    // twitter:image
    [
      /<meta name="twitter:image" content="[^"]*" \/>/,
      `<meta name="twitter:image" content="${attr(image)}" />`,
    ],
  ];

  for (const [re, val] of replacements) {
    html = html.replace(re, val);
  }

  // Article JSON-LD before </head>
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    image: [image],
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/favicon.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  html = html.replace(
    "</head>",
    `    <script type="application/ld+json">${jsonForScript(ld)}</script>\n  </head>`
  );

  // Pre-fill #root for non-JS crawlers + hand the data to the client for an
  // instant first paint (React replaces this on mount).
  const crawlerBody =
    `<article>` +
    `<p>${text(post.category || "")}${
      post.publishedAt ? ` · ${fmtDate(post.publishedAt)}` : ""
    }</p>` +
    `<h1>${text(post.title)}</h1>` +
    (post.thumbnailUrl
      ? `<img src="${attr(image)}" alt="${attr(post.title)}" />`
      : "") +
    `<div>${post.content || ""}</div>` +
    `</article>`;

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${crawlerBody}</div>\n    <script>window.__POST__=${jsonForScript(
      post
    )}</script>`
  );

  return html;
}
