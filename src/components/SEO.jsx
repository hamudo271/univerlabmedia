import React from "react";
import { Helmet } from "react-helmet-async";

/**
 * Site-wide SEO component. Renders <title>, meta description, canonical,
 * Open Graph, Twitter card tags consistently for every page.
 *
 * Usage:
 *   <SEO
 *     title="회사 소개"
 *     description="유니버랩 미디어의 정체성과 팀을 소개합니다."
 *     path="/company"
 *   />
 *
 * Props:
 *   title       – Page-specific title. Rendered as `${title} | ${SITE_NAME}`.
 *                 If omitted, falls back to SITE_NAME alone.
 *   description – Meta description. Trimmed to ~160 chars for best SERP display.
 *   path        – Route path (e.g. "/company"). Used to build canonical + og:url.
 *   image       – Optional absolute/relative image URL. Defaults to site og-image.
 *   type        – OpenGraph type. Default "website".
 *   noIndex     – If true, emits robots=noindex,nofollow.
 */

const SITE_NAME = "유니버랩 미디어";
const SITE_URL = "https://univerlabmedia.co.kr"; // primary domain (non-www canonical)
const DEFAULT_DESCRIPTION =
  "유니버랩 미디어는 영상 기획·촬영·편집·마케팅을 하나의 프로세스로 제공하는 영상 제작 전문 에이전시입니다. 700건 이상의 제작 경험으로 성과를 만듭니다.";
const DEFAULT_OG_IMAGE = "/og-image.png";

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  type = "website",
  noIndex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={SITE_NAME} />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}

export { SITE_NAME, SITE_URL, DEFAULT_DESCRIPTION };
