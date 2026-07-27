/**
 * Server-side meta/content injection for the static public pages.
 *
 * Same idea as renderColumnPost.js, but for the evergreen marketing routes.
 * The SPA shell ships one hard-coded <title>/description and a canonical that
 * points at the homepage, so every page looked like a contentless duplicate of
 * `/` to crawlers that do not run JS (Naver's Yeti in particular). This swaps
 * in per-route title/description/canonical/OG, injects WebPage + BreadcrumbList
 * JSON-LD with real publish/modify dates, and pre-fills #root with the page's
 * own CMS copy so there is something to read before React mounts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { attr, text, jsonForScript } from "./html.js";
import { defaults } from "../../shared/content-defaults.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INDEX_HTML = path.join(__dirname, "..", "..", "dist", "index.html");
const SITE_URL = "https://univerlabmedia.co.kr";
const SITE_NAME = "유니버랩 미디어";
// The site went live with the initial deploy. Used as datePublished for the
// evergreen pages; dateModified comes from the CMS row's updated_at.
const SITE_PUBLISHED = "2026-06-28T00:00:00+09:00";

/** Routes rendered from a single content key. `nav` ones are cross-linked. */
const ROUTES = {
  "/": { key: "home", type: "WebPage", name: "홈", nav: true },
  "/company": { key: "company", type: "AboutPage", name: "회사 소개", nav: true },
  "/service": { key: "service", type: "WebPage", name: "서비스 소개", nav: true },
  "/portfolio": {
    key: "portfolio",
    type: "CollectionPage",
    name: "제작 사례",
    nav: true,
  },
  "/column": {
    key: "column",
    type: "CollectionPage",
    name: "칼럼",
    nav: true,
  },
  "/pricing": { key: "pricing", type: "WebPage", name: "가격 안내", nav: true },
  "/contact": {
    key: "contact",
    type: "ContactPage",
    name: "문의하기",
    nav: true,
  },
  // Legal pages have no CMS blob; their copy lives in src/pages/Legal.jsx.
  "/policy": {
    key: "global",
    type: "WebPage",
    name: "이용약관",
    seo: {
      title: "이용약관",
      description:
        "유니버랩 미디어 웹사이트 및 영상 제작 서비스 이용약관입니다.",
    },
  },
  "/privacy": {
    key: "global",
    type: "WebPage",
    name: "개인정보처리방침",
    seo: {
      title: "개인정보처리방침",
      description:
        "유니버랩 미디어가 수집하는 개인정보의 항목, 이용 목적, 보유 기간 및 정보주체의 권리를 안내합니다.",
    },
  },
};

/** Content key a route needs loaded from the CMS, or null if not ours. */
export function contentKeyForPath(pathname) {
  if (ROUTES[pathname]) return ROUTES[pathname].key;
  if (/^\/service\/[^/]+$/.test(pathname)) return "serviceDetail";
  return null;
}

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

const HEADING_KEYS = new Set(["headline", "title"]);
const PARA_KEYS = new Set(["subhead", "body", "desc", "description", "closing"]);
const IMG_RE = /\.(png|jpe?g|webp|avif|gif)$/i;
const MAX_BLOCKS = 24;
const MAX_IMAGES = 8;

/**
 * Walk a page's content blob collecting headings, paragraphs and images so the
 * pre-rendered body reflects what the page actually says.
 */
function harvest(node, out, depth = 0) {
  if (!node || depth > 6) return;
  if (Array.isArray(node)) {
    for (const v of node.slice(0, 12)) harvest(v, out, depth + 1);
    return;
  }
  if (typeof node !== "object") return;

  // Images live on the object that also carries their label.
  const alt = node.title || node.name || node.headline || "";
  if (out.images.length < MAX_IMAGES) {
    if (typeof node.src === "string" && IMG_RE.test(node.src)) {
      out.images.push({ src: node.src, alt });
    } else if (typeof node.videoId === "string" && node.videoId) {
      out.images.push({
        src: `https://img.youtube.com/vi/${node.videoId}/hqdefault.jpg`,
        alt,
      });
    }
  }

  for (const [k, v] of Object.entries(node)) {
    if (k === "seo") continue;
    if (typeof v === "string") {
      const s = v.trim();
      if (!s || out.blocks.length >= MAX_BLOCKS) continue;
      if (HEADING_KEYS.has(k)) out.blocks.push({ tag: "h2", s });
      else if (PARA_KEYS.has(k)) out.blocks.push({ tag: "p", s });
    } else {
      harvest(v, out, depth + 1);
    }
  }
}

/** Resolve the per-route SEO copy + prerender body for a path. */
function pageFor(pathname, content) {
  const svc = /^\/service\/([^/]+)$/.exec(pathname);
  if (svc) {
    const items = (content || defaults.serviceDetail)?.services?.items ?? [];
    const item = items.find((i) => i.id === svc[1]);
    if (!item) return null;
    return {
      name: item.title,
      type: "Service",
      title: item.title,
      description: (item.desc || item.subtitle || "").slice(0, 200),
      source: item,
      breadcrumb: [{ name: "서비스 소개", path: "/service" }],
    };
  }

  const route = ROUTES[pathname];
  if (!route) return null;
  const blob = content || defaults[route.key] || {};
  // Routes carrying their own seo (the legal pages) have no CMS copy to
  // harvest, so the prerender is just their heading plus the shared NAP.
  const seo = route.seo || blob.seo || defaults[route.key]?.seo || {};
  return {
    name: route.name,
    type: route.type,
    title: seo.title || route.name,
    description: seo.description || "",
    source: route.seo ? {} : blob,
    breadcrumb: [],
  };
}

/**
 * Returns the HTML for a static route, or null when the route is not ours or
 * the built template is unavailable (so the caller falls through to the SPA).
 */
export function renderStaticPage(pathname, { content, updatedAt, global: globalContent } = {}) {
  let html = template();
  if (!html) return null;

  const page = pageFor(pathname, content);
  if (!page) return null;

  const isHome = pathname === "/";
  const url = `${SITE_URL}${pathname}`;
  const fullTitle = isHome
    ? `${SITE_NAME} | ${page.title}`
    : `${page.title} | ${SITE_NAME}`;
  const desc = page.description.slice(0, 200);
  const image = `${SITE_URL}/og-image.png`;
  const modified = updatedAt
    ? new Date(updatedAt).toISOString()
    : SITE_PUBLISHED;

  const replacements = [
    [/<title>[\s\S]*?<\/title>/, `<title>${text(fullTitle)}</title>`],
    [
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${attr(desc)}" />`,
    ],
    [
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${attr(url)}" />`,
    ],
    [
      /<meta property="og:url" content="[^"]*" \/>/,
      `<meta property="og:url" content="${attr(url)}" />`,
    ],
    [
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${attr(fullTitle)}" />`,
    ],
    [
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${attr(desc)}" />`,
    ],
    [
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${attr(fullTitle)}" />`,
    ],
    [
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${attr(desc)}" />`,
    ],
  ];
  for (const [re, val] of replacements) html = html.replace(re, val);

  // Publish/modify dates — Korean SEO crawlers look for these as OG meta as
  // well as in JSON-LD, so emit both.
  const dateMeta =
    `    <meta property="article:published_time" content="${attr(SITE_PUBLISHED)}" />\n` +
    `    <meta property="article:modified_time" content="${attr(modified)}" />\n`;

  const ld = {
    "@context": "https://schema.org",
    "@type": page.type,
    name: fullTitle,
    headline: page.title,
    description: desc || undefined,
    url,
    inLanguage: "ko-KR",
    datePublished: SITE_PUBLISHED,
    dateModified: modified,
    image: [image],
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/favicon.png` },
    },
  };

  const crumbs = [
    { name: "홈", path: "/" },
    ...page.breadcrumb,
    ...(isHome ? [] : [{ name: page.name, path: pathname }]),
  ];
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path === "/" ? "" : c.path}` || SITE_URL,
    })),
  };

  html = html.replace(
    "</head>",
    dateMeta +
      `    <script type="application/ld+json">${jsonForScript(ld)}</script>\n` +
      `    <script type="application/ld+json">${jsonForScript(breadcrumbLd)}</script>\n` +
      "  </head>"
  );

  // Pre-fill #root so non-JS crawlers see real copy. React replaces this on
  // mount, exactly like the /column/:slug renderer does.
  const out = { blocks: [], images: [] };
  harvest(page.source, out);
  // Every page should carry at least one image in the markup — several of the
  // copy-only pages have none of their own, so fall back to the OG image.
  if (!out.images.length) out.images.push({ src: "/og-image.png", alt: page.title });

  // Name/address/phone, repeated on every page exactly as the real footer
  // renders it. Local-search crawlers score NAP consistency off the page text,
  // so the prerender has to carry it too or the pages read as NAP-less.
  const f = (globalContent || defaults.global)?.footer || {};
  const nap =
    `<address>` +
    [f.businessName, f.address, f.phone, f.email]
      .filter(Boolean)
      .map((v) => `<span>${text(v)}</span>`)
      .join("") +
    `</address>`;

  const body =
    `<article>` +
    `<h1>${text(page.title)}</h1>` +
    (desc ? `<p>${text(desc)}</p>` : "") +
    out.blocks
      .map((b) => `<${b.tag}>${text(b.s)}</${b.tag}>`)
      .join("") +
    // Lazy so these never compete with the real hero for bandwidth — crawlers
    // read the markup, browsers throw the whole subtree away on mount anyway.
    out.images
      .map(
        (im) =>
          `<img src="${attr(im.src)}" alt="${attr(
            im.alt || page.title
          )}" loading="lazy" decoding="async" width="320" height="180" />`
      )
      .join("") +
    `<nav>` +
    Object.entries(ROUTES)
      .filter(([, r]) => r.nav)
      .map(([p, r]) => `<a href="${attr(p)}">${text(r.name)}</a>`)
      .join("") +
    `<a href="/policy">이용약관</a><a href="/privacy">개인정보처리방침</a>` +
    `</nav>` +
    nap +
    `</article>`;

  // Take the prerender out of the layout entirely. Painting it and then having
  // React replace it a full bundle-load later shifted the page hard (CLS went
  // 0 -> 0.73 when this shipped visible). Clipped instead of display:none so
  // the text stays in the accessibility/extraction path for non-JS crawlers.
  const hidden =
    "position:absolute;width:1px;height:1px;margin:-1px;padding:0;" +
    "overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0";

  html = html.replace(
    '<div id="root"></div>',
    `<div id="root"><div style="${hidden}">${body}</div></div>`
  );
  return html;
}
