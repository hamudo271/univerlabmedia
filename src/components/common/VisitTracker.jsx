import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview, bindClickTracking } from '../../lib/track.js';

/**
 * 자체 방문 집계: 경로가 바뀔 때마다 페이지뷰 신호를 보내고, 전화·메일·카카오·
 * 문의 버튼 클릭을 기록한다. 공개 사이트에만 붙으므로 /admin 은 세지 않는다.
 */
export default function VisitTracker() {
  const { pathname } = useLocation();

  useEffect(() => {
    bindClickTracking();
  }, []);

  useEffect(() => {
    trackPageview(pathname);
  }, [pathname]);

  return null;
}
