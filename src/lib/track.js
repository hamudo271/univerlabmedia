/**
 * 자체 방문 집계 신호 (서버: server/routes/track.js).
 *
 * 브라우저에 무작위 방문자 번호와 방문 번호만 저장한다(localStorage "ul-visit").
 * 쿠키·이름·연락처는 쓰지 않는다. 30분 동안 페이지를 안 보거나, 다른 사이트나
 * 광고 링크를 타고 다시 들어오면 새 방문으로 센다. 관리자로 로그인한 브라우저는 세지 않는다.
 */

const KEY = 'ul-visit';
const IDLE_MS = 30 * 60 * 1000;
const ADMIN_TOKEN_KEY = 'univerlab_admin_token';
const TAG_RE = /[?&](utm_[a-z]+|gclid|gbraid|wbraid|fbclid|n_media|n_query|n_keyword|NaPm)=/;

const rid = () =>
  (window.crypto?.randomUUID?.() || `${Math.random().toString(36).slice(2)}${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`)
    .replace(/-/g, '')
    .slice(0, 32);

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function write(st) {
  try {
    localStorage.setItem(KEY, JSON.stringify(st));
  } catch {
    /* 사생활 보호 모드: 이번 페이지는 그래도 센다 */
  }
}

export function trackingEnabled() {
  const h = window.location.hostname;
  if (!(h === 'univerlabmedia.co.kr' || h.endsWith('.univerlabmedia.co.kr') || h === 'localhost' || h === '127.0.0.1')) return false;
  try {
    if (localStorage.getItem(ADMIN_TOKEN_KEY)) return false;
  } catch {
    /* ignore */
  }
  return true;
}

let pageLoadSent = false;

/** 현재 방문의 번호들. 새 방문이 시작되면 이번 페이지의 referrer·태그를 기억해 둔다. */
function session({ landing = false } = {}) {
  const st = read();
  const now = Date.now();
  const ref = document.referrer || '';
  let external = false;
  try {
    external = !!ref && new URL(ref).hostname !== window.location.hostname;
  } catch {
    external = false;
  }
  const tagged = TAG_RE.test(window.location.search);
  const expired = !st.s || !st.t || now - st.t > IDLE_MS;
  if (!st.v) st.v = rid();
  if (expired || (landing && (external || tagged))) {
    st.s = rid();
    st.r = landing ? ref : '';
    st.q = landing ? window.location.search : '';
    st.l = window.location.pathname;
  }
  st.t = now;
  write(st);
  return st;
}

function send(body) {
  const json = JSON.stringify(body);
  try {
    if (navigator.sendBeacon && navigator.sendBeacon('/api/v', json)) return;
  } catch {
    /* 아래로 */
  }
  fetch('/api/v', { method: 'POST', body: json, keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(() => {});
}

/** 페이지 한 번 보기. 페이지를 새로 연 첫 신호에만 referrer와 주소 태그를 싣는다. */
export function trackPageview(path) {
  if (!trackingEnabled()) return;
  const landing = !pageLoadSent;
  pageLoadSent = true;
  const st = session({ landing });
  const body = { v: st.v, s: st.s, p: path, k: 'pv' };
  if (landing) {
    body.r = document.referrer || '';
    body.q = window.location.search;
  }
  send(body);
}

/** 전화·메일·카카오·문의 버튼·외부 링크 클릭. */
export function trackEvent(kind, target) {
  if (!trackingEnabled()) return;
  const st = session();
  send({ v: st.v, s: st.s, p: window.location.pathname, k: kind, t: String(target || '').slice(0, 200) });
}

/** 문의 폼과 함께 보낼 유입 정보 (서버가 방문 기록과 이어 붙인다). */
export function attributionFields() {
  if (!trackingEnabled()) return {};
  const st = read();
  if (!st.v) return {};
  return { _v: st.v, _s: st.s || '', _r: st.r || '', _q: st.q || '', _l: st.l || '' };
}

/** 문서 전체의 링크 클릭을 지켜본다. 한 번만 붙인다. */
let clickBound = false;
export function bindClickTracking() {
  if (clickBound) return;
  clickBound = true;
  document.addEventListener(
    'click',
    (e) => {
      const a = e.target?.closest?.('a[href]');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      const label = (a.textContent || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
      if (href.startsWith('tel:')) return trackEvent('tel', href.slice(4));
      if (href.startsWith('mailto:')) return trackEvent('mail', href.slice(7).split('?')[0]);
      let url;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (/(^|\.)(kakao\.com|kakao\.co\.kr)$/.test(url.hostname)) return trackEvent('kakao', url.hostname + url.pathname);
      if (url.hostname === window.location.hostname) {
        if (url.pathname === '/contact' && window.location.pathname !== '/contact') trackEvent('cta', label || '문의하기');
        return;
      }
      if (/^https?:$/.test(url.protocol)) trackEvent('out', (url.hostname + url.pathname).slice(0, 200));
    },
    true
  );
}
