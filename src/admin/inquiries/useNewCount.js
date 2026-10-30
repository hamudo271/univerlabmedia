import { useEffect, useState } from "react";
import { adminInquiriesApi } from "../../lib/api.js";

/** 아직 연락 전('신규')인 문의 수. 메뉴 배지용으로 1분마다 다시 센다. */
export function useNewInquiryCount() {
  const [n, setN] = useState(0);
  useEffect(() => {
    let alive = true;
    const load = () =>
      adminInquiriesApi
        .count()
        .then((d) => alive && setN(d.new || 0))
        .catch(() => {});
    load();
    const t = setInterval(load, 60_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);
  return n;
}
