import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 채널톡 Plugin Key. GA 측정 ID와 마찬가지로 클라이언트에 노출되는 공개 값이라
// 기본값을 두어 빌드 설정 없이도 동작하게 한다. 환경별로 VITE_CHANNEL_PLUGIN_KEY로 덮어쓴다.
// ⚠️ Access Secret(회원 검증용 HMAC 비밀키)은 서버 전용이므로 여기에 넣지 않는다.
const PLUGIN_KEY = import.meta.env.VITE_CHANNEL_PLUGIN_KEY || '6cd4cf34-d97f-4f84-8127-ea120a712f2d';

// 실제 도메인에서만 부팅한다. localhost / Railway 프리뷰 / 포크에서 실제 상담이
// 생성되어 운영자에게 잡음이 가는 것을 막는다.
const PROD_HOST = 'univerlabmedia.co.kr';
const enabled = () =>
  Boolean(PLUGIN_KEY) &&
  (window.location.hostname === PROD_HOST || window.location.hostname.endsWith(`.${PROD_HOST}`));

// 채널톡 공식 부트 스니펫 (https://developers.channel.io). ChannelIO 큐를 만들고
// 위젯 스크립트를 비동기로 주입한다. 두 번 실행돼도 안전하도록 가드가 있다.
function loadChannelIO() {
  const w = window;
  if (w.ChannelIO) return;
  const ch = function () {
    ch.c(arguments);
  };
  ch.q = [];
  ch.c = function (args) {
    ch.q.push(args);
  };
  w.ChannelIO = ch;
  function l() {
    if (w.ChannelIOInitialized) return;
    w.ChannelIOInitialized = true;
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
    const x = document.getElementsByTagName('script')[0];
    if (x.parentNode) x.parentNode.insertBefore(s, x);
  }
  if (document.readyState === 'complete') l();
  else {
    w.addEventListener('DOMContentLoaded', l);
    w.addEventListener('load', l);
  }
}

let booted = false;
function bootChannel() {
  if (booted) return;
  booted = true;
  loadChannelIO();
  window.ChannelIO('boot', { pluginKey: PLUGIN_KEY });
}

/**
 * 채널톡 상담 위젯을 부팅하고, 클라이언트 라우팅마다 현재 페이지를 채널톡에 알린다.
 * 공개 사이트에만 마운트되므로 /admin 에서는 위젯이 뜨지 않는다.
 */
export default function ChannelTalk() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (enabled()) bootChannel();
  }, []);

  useEffect(() => {
    if (!enabled()) return;
    // 운영자가 상담 시 방문자의 현재 페이지를 볼 수 있도록 라우트 변경을 알린다.
    window.ChannelIO?.('setPage', window.location.href);
  }, [pathname, search]);

  return null;
}
