import React, { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api.js";

/**
 * 방문자 통계 (GA4 Data API).
 * The server caches GA4 responses for an hour, so this page is free-quota
 * safe no matter how often it is opened.
 */
export default function Stats() {
  const [data, setData] = useState(null);
  const [state, setState] = useState("loading"); // loading | ok | error
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      const res = await api.get(`/admin/stats${refresh ? "?refresh=1" : ""}`, { auth: true });
      setData(res);
      setState("ok");
    } catch {
      setState("error");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Keep the realtime widget fresh while the tab is open (server caches 60s).
    const t = setInterval(() => load(), 60_000);
    return () => clearInterval(t);
  }, [load]);

  if (state === "loading") {
    return <p className="text-slate-400">통계를 불러오는 중…</p>;
  }
  if (state === "error") {
    return <p className="text-red-400">통계를 불러오지 못했습니다. 새로고침해 주세요.</p>;
  }
  if (!data.configured) return <SetupGuide reason={data.reason} detail={data.detail} />;

  const { totals, daily, topPages, channels, realtime, cachedAt, stale } = data;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">방문자 통계</h1>
          <p className="mt-1 text-sm text-slate-400">
            최근 28일 · GA4 기준 · 갱신 {fmtTime(cachedAt)}
            {stale && <span className="ml-2 text-amber-400">(일시적 오류 — 이전 데이터 표시 중)</span>}
          </p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="rounded border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-50"
        >
          {refreshing ? "갱신 중…" : "지금 갱신"}
        </button>
      </div>

      {/* Realtime + totals */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card label="현재 접속자" value={realtime?.activeUsers ?? 0} accent live />
        <Card label="방문자" value={totals.activeUsers} sub={`신규 ${fmt(totals.newUsers)}`} />
        <Card label="페이지뷰" value={totals.pageViews} sub={`세션 ${fmt(totals.sessions)}`} />
        <Card
          label="평균 체류시간"
          value={fmtDuration(totals.avgSessionSec)}
          sub={`참여율 ${(totals.engagementRate * 100).toFixed(0)}%`}
          raw
        />
      </div>

      {/* Daily trend */}
      <Panel title="일별 추이 (페이지뷰 · 방문자)">
        <TrendChart daily={daily} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="인기 페이지 TOP 10">
          <Table
            head={["페이지", "조회수", "방문자"]}
            rows={topPages.map((p) => [
              <span key="p" className="font-mono text-xs">{p.path}</span>,
              fmt(p.views),
              fmt(p.users),
            ])}
          />
        </Panel>
        <Panel title="유입 채널">
          <Table
            head={["채널", "세션", "방문자"]}
            rows={channels.map((c) => [channelKo(c.channel), fmt(c.sessions), fmt(c.users)])}
          />
        </Panel>
      </div>
    </div>
  );
}

// ── Pieces ──────────────────────────────────────────────────────────────────

function Card({ label, value, sub, accent, live, raw }) {
  return (
    <div className={`rounded-xl border p-5 ${accent ? "border-emerald-700/60 bg-emerald-950/40" : "border-slate-800 bg-slate-900"}`}>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        {live && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />}
        {label}
      </div>
      <div className="mt-2 text-3xl font-black text-white">{raw ? value : fmt(value)}</div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="mb-4 text-sm font-bold text-slate-300">{title}</h2>
      {children}
    </section>
  );
}

/** Dependency-free SVG bar chart: views as bars, users as a line. */
function TrendChart({ daily }) {
  if (!daily?.length) return <p className="text-sm text-slate-500">아직 데이터가 없습니다.</p>;
  const W = 900;
  const H = 220;
  const PAD = 24;
  const maxV = Math.max(...daily.map((d) => d.views), 1);
  const maxU = Math.max(...daily.map((d) => d.users), 1);
  const bw = (W - PAD * 2) / daily.length;
  const x = (i) => PAD + i * bw;
  const yV = (v) => H - PAD - (v / maxV) * (H - PAD * 2);
  const yU = (v) => H - PAD - (v / maxU) * (H - PAD * 2);
  const line = daily.map((d, i) => `${i ? "L" : "M"}${(x(i) + bw / 2).toFixed(1)},${yU(d.users).toFixed(1)}`).join(" ");

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[640px] w-full">
        {daily.map((d, i) => (
          <g key={d.date}>
            <rect
              x={x(i) + 2}
              y={yV(d.views)}
              width={Math.max(bw - 4, 2)}
              height={H - PAD - yV(d.views)}
              rx="2"
              className="fill-blue-500/60 hover:fill-blue-400"
            >
              <title>{`${fmtDate(d.date)} · 조회 ${d.views} · 방문자 ${d.users}`}</title>
            </rect>
            {i % 7 === 0 && (
              <text x={x(i) + bw / 2} y={H - 6} textAnchor="middle" className="fill-slate-500 text-[10px]">
                {fmtDate(d.date)}
              </text>
            )}
          </g>
        ))}
        <path d={line} fill="none" strokeWidth="2" className="stroke-emerald-400" />
      </svg>
      <div className="mt-2 flex gap-4 text-xs text-slate-500">
        <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-blue-500/60" />페이지뷰</span>
        <span><span className="mr-1 inline-block h-0.5 w-3 translate-y-[-2px] bg-emerald-400" />방문자</span>
      </div>
    </div>
  );
}

function Table({ head, rows }) {
  if (!rows.length) return <p className="text-sm text-slate-500">아직 데이터가 없습니다.</p>;
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-800 text-left text-xs text-slate-500">
          {head.map((h, i) => (
            <th key={h} className={`pb-2 font-medium ${i > 0 ? "text-right" : ""}`}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((cells, i) => (
          <tr key={i} className="border-b border-slate-800/60 last:border-0">
            {cells.map((c, j) => (
              <td key={j} className={`py-2 text-slate-300 ${j > 0 ? "text-right tabular-nums" : "max-w-0 truncate pr-3"}`}>
                {c}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function SetupGuide({ reason, detail }) {
  const steps = {
    "no-credentials": [
      "Railway → Variables에 GA_SERVICE_ACCOUNT_JSON을 추가하세요 (서비스 계정 JSON 전체 내용).",
      "GA4_PROPERTY_ID도 함께 추가하세요 (GA4 → 관리 → 속성 설정 → 속성 ID, 숫자).",
    ],
    "bad-credentials": ["GA_SERVICE_ACCOUNT_JSON 값이 올바른 서비스 계정 JSON인지 확인하세요."],
    "admin-api-disabled": [
      "GA4_PROPERTY_ID 환경변수를 추가하면 바로 해결됩니다 (GA4 → 관리 → 속성 설정 → 속성 ID).",
      "또는 Google Cloud Console에서 'Google Analytics Admin API'를 활성화하면 속성을 자동 인식합니다.",
    ],
    "data-api-disabled": [
      "Google Cloud Console → 'Google Analytics Data API'를 활성화하세요.",
    ],
    "no-property-access": [
      "GA4 → 관리 → 속성 액세스 관리에서 서비스 계정 이메일(…iam.gserviceaccount.com)을 '뷰어'로 추가하세요.",
      "GA4_PROPERTY_ID가 올바른 속성 번호인지 확인하세요.",
    ],
    "api-error": ["일시적인 오류일 수 있습니다. 잠시 후 다시 시도해 주세요."],
  };
  return (
    <div className="rounded-xl border border-amber-800/60 bg-amber-950/30 p-6">
      <h1 className="text-lg font-bold text-amber-200">통계 연동 설정이 필요합니다</h1>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-300">
        {(steps[reason] || steps["api-error"]).map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      {detail && <p className="mt-4 break-all font-mono text-xs text-slate-500">{detail}</p>}
    </div>
  );
}

// ── Formatters ──────────────────────────────────────────────────────────────

const fmt = (n) => Number(n ?? 0).toLocaleString("ko-KR");
const fmtDuration = (sec) => `${Math.floor(sec / 60)}분 ${sec % 60}초`;
const fmtDate = (yyyymmdd) => `${Number(yyyymmdd.slice(4, 6))}/${Number(yyyymmdd.slice(6, 8))}`;
const fmtTime = (iso) => {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};
const channelKo = (c) =>
  ({
    "Organic Search": "검색 (자연 유입)",
    "Direct": "직접 접속",
    "Referral": "외부 링크",
    "Organic Social": "소셜 (자연 유입)",
    "Paid Search": "검색 광고",
    "Paid Social": "소셜 광고",
    "Email": "이메일",
    "Unassigned": "기타",
  })[c] || c;
