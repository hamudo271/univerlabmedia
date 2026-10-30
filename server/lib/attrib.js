/**
 * 방문이 어디서 왔는지 판별한다. 방문 집계(/api/v)와 문의 저장(/api/contact)이
 * 같은 규칙을 써서, 유입 분석의 '채널'과 문의의 '유입'이 같은 말로 묶이게 한다.
 *
 * 판단 순서: 링크에 붙은 태그(utm_*, 광고 클릭 ID) → 직전 사이트(referrer)
 *           → 인앱 브라우저 이름 → 직접 방문.
 */

// [호스트 규칙, 그룹, 채널, 검색어가 담긴 파라미터]
const HOSTS = [
  [/(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|wrtn\.ai)$/, "AI 검색", "AI 검색"],
  [/^(adcr|ad\.search|searchad)\.naver\.com$/, "광고", "네이버 광고"],
  [/^(m\.)?search\.naver\.com$/, "검색", "네이버 검색", "query"],
  [/^(m\.)?blog\.naver\.com$/, "블로그·카페", "네이버 블로그"],
  [/^(m\.)?cafe\.naver\.com$/, "블로그·카페", "네이버 카페"],
  [/^(m\.)?(in|kin)\.naver\.com$/, "검색", "네이버 지식iN"],
  [/(^|\.)naver\.com$/, "검색", "네이버"],
  [/(^|\.)(googleadservices\.com|doubleclick\.net|googlesyndication\.com)$/, "광고", "구글 광고"],
  [/^(www\.|m\.)?google\.[a-z.]+$/, "검색", "구글 검색", "q"],
  [/^(m\.)?search\.daum\.net$/, "검색", "다음 검색", "q"],
  [/^(m\.)?cafe\.daum\.net$/, "블로그·카페", "다음 카페"],
  [/(^|\.)daum\.net$/, "검색", "다음"],
  [/(^|\.)bing\.com$/, "검색", "빙", "q"],
  [/(^|\.)zum\.com$/, "검색", "줌", "query"],
  [/(^|\.)(duckduckgo\.com|search\.yahoo\.com|ecosia\.org|yandex\.[a-z]+)$/, "검색", "기타 검색"],
  [/(^|\.)tistory\.com$/, "블로그·카페", "티스토리"],
  [/(^|\.)brunch\.co\.kr$/, "블로그·카페", "브런치"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "SNS", "유튜브"],
  [/(^|\.)instagram\.com$/, "SNS", "인스타그램"],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me|messenger\.com)$/, "SNS", "페이스북"],
  [/(^|\.)threads\.(net|com)$/, "SNS", "스레드"],
  [/(^|\.)tiktok\.com$/, "SNS", "틱톡"],
  [/(^|\.)(twitter\.com|x\.com|t\.co)$/, "SNS", "X(트위터)"],
  [/(^|\.)linkedin\.com$|^lnkd\.in$/, "SNS", "링크드인"],
  [/(^|\.)band\.us$/, "SNS", "밴드"],
  [/(^|\.)(kakao\.com|kakao\.co\.kr|kakaocdn\.net)$/, "메신저", "카카오톡"],
  [/(^|\.)(kmong\.com|soomgo\.com|wishket\.com|crowdpic\.net)$/, "외주 플랫폼", null],
];

// utm_source 값 → [채널 이름, 광고가 아닐 때의 그룹]
const SOURCES = {
  naver: ["네이버", "검색"], naverblog: ["네이버 블로그", "블로그·카페"], blog: ["블로그", "블로그·카페"],
  navercafe: ["네이버 카페", "블로그·카페"], google: ["구글", "검색"], daum: ["다음", "검색"],
  kakao: ["카카오톡", "메신저"], kakaotalk: ["카카오톡", "메신저"], kakaochannel: ["카카오톡", "메신저"],
  instagram: ["인스타그램", "SNS"], insta: ["인스타그램", "SNS"], ig: ["인스타그램", "SNS"],
  facebook: ["페이스북", "SNS"], fb: ["페이스북", "SNS"], meta: ["메타", "SNS"],
  youtube: ["유튜브", "SNS"], yt: ["유튜브", "SNS"], threads: ["스레드", "SNS"], tiktok: ["틱톡", "SNS"],
  linkedin: ["링크드인", "SNS"], band: ["밴드", "SNS"],
  kmong: ["크몽", "외주 플랫폼"], soomgo: ["숨고", "외주 플랫폼"], wishket: ["위시켓", "외주 플랫폼"],
  email: ["이메일", "메신저"], newsletter: ["뉴스레터", "메신저"], sms: ["문자", "메신저"],
  qr: ["QR코드", "오프라인"], offline: ["오프라인", "오프라인"],
};
const PAID = /^(cpc|ppc|cpm|cpv|paid|paidsearch|paid_search|paidsocial|paid_social|ad|ads|display|banner|sa|da|gfa|powerlink|brandsearch|search_ad)$/i;

export const GROUPS = ["검색", "광고", "AI 검색", "블로그·카페", "SNS", "메신저", "외주 플랫폼", "캠페인", "오프라인", "기타 사이트", "직접 방문"];

const clip = (s, n = 120) => String(s || "").trim().slice(0, n) || null;

/** 집계용 페이지 주소: 쿼리·해시 없이, 끝 슬래시 없이. */
export function cleanPath(p) {
  let s = String(p || "/").split(/[?#]/)[0].slice(0, 200);
  if (!s.startsWith("/")) s = `/${s}`;
  s = s.replace(/\/{2,}/g, "/");
  if (s.length > 1 && s.endsWith("/")) s = s.slice(0, -1);
  return s || "/";
}

/** 주소의 쿼리 중 유입 판별에 쓰는 태그만 남긴다. */
export function pickTags(search) {
  let q;
  try {
    q = new URLSearchParams(String(search || ""));
  } catch {
    return {};
  }
  const out = {};
  for (const [k, v] of q) {
    if (/^(utm_(source|medium|campaign|term|content)|gclid|gbraid|wbraid|fbclid|n_(media|query|keyword|ad_group|campaign_type)|NaPm)$/.test(k) && v) {
      out[k] = String(v).slice(0, 160);
    }
  }
  return out;
}

export function parseUA(ua = "") {
  const s = String(ua);
  const bot = /bot|crawl|spider|slurp|facebookexternalhit|embedly|preview|headless|lighthouse|pingdom|uptime|monitor|curl|wget|python|axios|node-fetch|undici|go-http|java\/|scrapy|phantom|puppeteer|playwright|yeti|daum(oa|os)|kakaotalk-scrap|whatsapp|telegrambot|discordbot|slackbot/i.test(s);
  const tablet = /ipad|tablet|(android(?!.*mobile))|kindle|silk/i.test(s);
  const mobile = !tablet && /mobi|iphone|ipod|android.*mobile|windows phone/i.test(s);
  const os = /iphone|ipad|ipod/i.test(s) ? "iOS" : /android/i.test(s) ? "Android" : /windows/i.test(s) ? "Windows"
    : /mac os x|macintosh/i.test(s) ? "macOS" : /cros/i.test(s) ? "ChromeOS" : /linux/i.test(s) ? "Linux" : "기타";
  const inapp = /kakaotalk/i.test(s) ? "카카오톡" : /naver\(inapp|naver\//i.test(s) ? "네이버 앱" : /instagram/i.test(s) ? "인스타그램"
    : /fban|fbav|fb_iab/i.test(s) ? "페이스북" : /daumapps/i.test(s) ? "다음 앱" : /\bline\//i.test(s) ? "라인"
    : /band\//i.test(s) ? "밴드" : /threads/i.test(s) ? "스레드" : /tiktok|musical_ly|bytedance/i.test(s) ? "틱톡" : null;
  const browser = inapp ? `${inapp} 앱` : /samsungbrowser/i.test(s) ? "삼성 인터넷" : /whale/i.test(s) ? "웨일" : /edg\//i.test(s) ? "엣지"
    : /opr\/|opera/i.test(s) ? "오페라" : /firefox|fxios/i.test(s) ? "파이어폭스" : /crios|chrome/i.test(s) ? "크롬"
    : /safari/i.test(s) ? "사파리" : "기타";
  return { bot, device: tablet ? "태블릿" : mobile ? "모바일" : "PC", os, browser, inapp };
}

/**
 * 한 방문의 유입 채널.
 * ref: document.referrer, tags: pickTags(location.search), ua: User-Agent, own: 이 사이트 호스트 목록.
 */
export function classify({ ref = "", tags = {}, ua = "", own = [] } = {}) {
  let host = "";
  let refUrl = null;
  try {
    refUrl = new URL(ref);
    host = refUrl.hostname.toLowerCase();
  } catch {
    /* referrer 없음 */
  }
  if (host && own.some((o) => host === o || host.endsWith(`.${o}`))) host = "";

  const out = {
    grp: "직접 방문", channel: "직접 방문", src: null, medium: null,
    campaign: clip(tags.utm_campaign), keyword: null, refHost: host || null,
  };
  const setKeyword = (k) => {
    if (!out.keyword && k) out.keyword = clip(k, 80);
  };
  setKeyword(tags.utm_term);
  setKeyword(tags.n_keyword || tags.n_query);
  const rule = host && HOSTS.find(([re]) => re.test(host));
  if (rule && rule[3] && refUrl) setKeyword(refUrl.searchParams.get(rule[3]));

  // 1) 링크 태그
  const srcKey = String(tags.utm_source || "").toLowerCase().replace(/[\s_-]+/g, "");
  const med = String(tags.utm_medium || "").toLowerCase();
  if (srcKey) {
    const [label, grp] = SOURCES[srcKey] || [clip(tags.utm_source, 40), "캠페인"];
    out.src = clip(tags.utm_source, 60);
    out.medium = clip(tags.utm_medium, 60);
    if (PAID.test(med)) return { ...out, grp: "광고", channel: `${label.replace(/^네이버 (블로그|카페)$/, "네이버")} 광고` };
    if (srcKey === "naver" && /blog/.test(med)) return { ...out, grp: "블로그·카페", channel: "네이버 블로그" };
    return { ...out, grp, channel: label };
  }
  if (tags.n_media || tags.n_keyword || tags.n_query || tags.n_ad_group) {
    return { ...out, grp: "광고", channel: "네이버 광고", src: "naver", medium: "cpc" };
  }
  if (tags.NaPm && /tr(%3D|=)(sa|brnd|gfa)/i.test(tags.NaPm)) {
    const tr = (tags.NaPm.match(/tr(?:%3D|=)(\w+)/i) || [])[1] || "";
    return { ...out, grp: "광고", channel: tr === "brnd" ? "네이버 브랜드검색" : "네이버 광고", src: "naver", medium: "cpc" };
  }
  if (tags.gclid || tags.gbraid || tags.wbraid) {
    return { ...out, grp: "광고", channel: "구글 광고", src: "google", medium: "cpc" };
  }

  // 2) 직전 사이트
  if (rule) return { ...out, grp: rule[1], channel: rule[2] || host.replace(/^(www|m)\./, "") };
  if (host) return { ...out, grp: "기타 사이트", channel: host.replace(/^(www|m)\./, "") };

  // 3) referrer가 없을 때: 인앱 브라우저로 추정
  if (tags.fbclid) return { ...out, grp: "SNS", channel: /instagram/i.test(ua) ? "인스타그램" : "페이스북" };
  const { inapp } = parseUA(ua);
  const APPS = { 카카오톡: "메신저", "네이버 앱": "검색", 인스타그램: "SNS", 페이스북: "SNS", "다음 앱": "검색", 라인: "메신저", 밴드: "SNS", 스레드: "SNS", 틱톡: "SNS" };
  if (inapp && APPS[inapp]) {
    return { ...out, grp: APPS[inapp], channel: inapp === "네이버 앱" ? "네이버" : inapp === "다음 앱" ? "다음" : inapp };
  }
  return out;
}

/** 이 사이트 자신의 호스트들 (자기 사이트에서 넘어온 referrer는 유입으로 치지 않는다). */
export function ownHosts(req) {
  const hosts = new Set(["univerlabmedia.co.kr", "univerlabmedia-production.up.railway.app", "localhost", "127.0.0.1"]);
  const h = String(req?.hostname || "").toLowerCase();
  if (h) hosts.add(h);
  return [...hosts];
}

/** 요청한 쪽 IP. Cloudflare 뒤에서는 CF-Connecting-IP가 실제 방문자다. 저장하지 않고 속도 제한에만 쓴다. */
export function clientIp(req) {
  return String(req.headers["cf-connecting-ip"] || req.ip || "").slice(0, 64);
}
