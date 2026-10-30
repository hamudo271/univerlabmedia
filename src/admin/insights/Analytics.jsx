import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { adminAnalyticsApi } from '../../lib/api.js';

/**
 * 유입 분석 — 이 사이트가 직접 센 방문(visits/hits)과 문의를 묶어서 본다.
 * GA4 '방문자 통계'와 달리 어느 채널·검색어·페이지가 실제 문의와 계약으로
 * 이어졌는지까지 보여준다.
 */

const kstToday = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const addDays = (ymd, n) => new Date(Date.parse(`${ymd}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10);

const PRESETS = [
  { key: 'today', label: '오늘', range: (t) => [t, t] },
  { key: 'yesterday', label: '어제', range: (t) => [addDays(t, -1), addDays(t, -1)] },
  { key: '7', label: '7일', range: (t) => [addDays(t, -6), t] },
  { key: '28', label: '28일', range: (t) => [addDays(t, -27), t] },
  { key: '90', label: '90일', range: (t) => [addDays(t, -89), t] },
  { key: '365', label: '1년', range: (t) => [addDays(t, -364), t] },
];

const EVENT_LABEL = { tel: '전화 걸기', mail: '메일 쓰기', kakao: '카카오톡', cta: '문의 버튼', out: '외부 링크' };

export default function Analytics() {
  const [preset, setPreset] = useState('28');
  const [range, setRange] = useState(() => PRESETS[3].range(kstToday()));
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await adminAnalyticsApi.get({ from: range[0], to: range[1] }));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  const pick = (p) => {
    setPreset(p.key);
    setRange(p.range(kstToday()));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">유입 분석</h1>
          <p className="mt-1 text-sm text-slate-400">
            사이트가 직접 센 방문과 문의를 묶은 숫자입니다. 쿠키 없이 세며, 관리자로 로그인한 브라우저는 빠집니다.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => pick(p)}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
                preset === p.key ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {p.label}
            </button>
          ))}
          <input
            type="date"
            value={range[0]}
            max={range[1]}
            onChange={(e) => {
              setPreset('');
              setRange([e.target.value, range[1]]);
            }}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 [color-scheme:dark]"
          />
          <span className="text-slate-500">~</span>
          <input
            type="date"
            value={range[1]}
            min={range[0]}
            max={kstToday()}
            onChange={(e) => {
              setPreset('');
              setRange([range[0], e.target.value]);
            }}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 [color-scheme:dark]"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {!data && !error && <p className="text-sm text-slate-400">불러오는 중…</p>}
      {data && <Report data={data} loading={loading} />}

      <CampaignLinkBuilder />
    </div>
  );
}

function Report({ data, loading }) {
  const s = data.summary;
  const p = data.previous;
  const conv = (a, b) => (b ? (a / b) * 100 : 0);
  const empty = !s.sessions && !s.inquiries;

  return (
    <div className={`space-y-8 transition-opacity ${loading ? 'opacity-50' : ''}`}>
      <p className="text-xs text-slate-500">
        {data.from} ~ {data.to} ({data.days}일) · 증감은 직전 {data.days}일 ({data.prevFrom} ~ {data.prevTo}) 대비
      </p>

      {empty && (
        <div className="rounded-xl border border-blue-900/60 bg-blue-950/30 p-5 text-sm text-slate-300">
          이 기간에는 아직 집계된 방문이 없습니다. 자체 집계는 이 기능을 배포한 날부터 쌓이므로, 그 이전 기간은
          '방문자 통계'(GA4)에서 확인해 주세요.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card label="현재 접속자" value={data.live.now} live sub={data.live.pages[0] ? `${data.live.pages[0].title || data.live.pages[0].path} 등` : '최근 5분'} />
        <Card label="방문자" value={s.visitors} prev={p.visitors} sub={`방문 ${fmt(s.sessions)} · 신규 ${fmt(s.new_sessions)}`} />
        <Card label="페이지뷰" value={s.pageviews} prev={p.pageviews} sub={`이탈률 ${pct(conv(s.bounces, s.sessions))} · 평균 ${fmtSec(s.avg_secs)}`} />
        <Card label="문의" value={s.inquiries} prev={p.inquiries} accent sub={`방문 대비 ${pct(conv(s.inquiries, s.sessions), 2)}`} />
        <Card label="미팅·견적 이상" value={s.proposals} prev={p.proposals} sub={`문의 대비 ${pct(conv(s.proposals, s.inquiries))}`} />
        <Card label="계약" value={s.won} prev={p.won} sub={s.revenue ? fmtWon(s.revenue) : '계약 금액 미입력'} />
        <Card label="문의 버튼 클릭" value={s.events.cta || 0} prev={p.events.cta || 0} sub="문의하기로 가는 링크" />
        <Card
          label="전화·메일·카톡"
          value={(s.events.tel || 0) + (s.events.mail || 0) + (s.events.kakao || 0)}
          prev={(p.events.tel || 0) + (p.events.mail || 0) + (p.events.kakao || 0)}
          sub={`전화 ${s.events.tel || 0} · 메일 ${s.events.mail || 0} · 카톡 ${s.events.kakao || 0}`}
        />
      </div>

      <Panel title={data.series.unit === 'hour' ? '시간대별 추이' : '일별 추이'}>
        <Trend series={data.series} />
      </Panel>

      <Panel title="채널별 성과" note="방문과 문의를 같은 채널 기준으로 묶었습니다. 전환율 = 문의 ÷ 방문">
        <Table
          head={['채널', '방문', '이탈률', '문의', '전환율', '계약', '계약 금액']}
          rows={data.channels.map((c) => [
            <span key="c">
              <span className="text-slate-200">{c.channel}</span>
              {c.grp !== c.channel && <span className="ml-1.5 text-xs text-slate-500">{c.grp}</span>}
            </span>,
            fmt(c.sessions),
            c.sessions ? pct(conv(c.bounces, c.sessions)) : '-',
            <Strong key="i" n={c.inquiries} />,
            c.sessions ? pct(conv(c.inquiries, c.sessions), 1) : '-',
            fmt(c.won),
            c.revenue ? fmtWon(c.revenue) : '-',
          ])}
        />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="검색어" note="네이버·다음·빙 검색과 광고 키워드. 구글 자연 검색은 검색어를 넘겨주지 않습니다.">
          <Table
            head={['검색어', '방문', '문의']}
            rows={data.keywords.map((k) => [
              <span key="k" title={k.channel}>{k.keyword}</span>,
              fmt(k.sessions),
              <Strong key="i" n={k.inquiries} />,
            ])}
          />
        </Panel>
        <Panel title="캠페인 (UTM)" note="아래 '캠페인 링크 만들기'로 만든 링크가 여기에 잡힙니다.">
          <Table
            head={['소스 / 매체 / 캠페인', '방문', '문의']}
            rows={data.campaigns.map((c) => [
              [c.src, c.medium, c.campaign].filter(Boolean).join(' / '),
              fmt(c.sessions),
              <Strong key="i" n={c.inquiries} />,
            ])}
          />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="첫 페이지 (들어온 페이지)">
          <Table
            head={['페이지', '방문', '이탈률', '문의']}
            rows={data.landings.map((l) => [
              <PageCell key="p" row={l} />,
              fmt(l.sessions),
              pct(conv(l.bounces, l.sessions)),
              <Strong key="i" n={l.inquiries} />,
            ])}
          />
        </Panel>
        <Panel title="문의 전에 본 페이지" note="문의한 사람이 그 방문에서 거쳐 간 페이지 (문의 1건당 1회)">
          <Table
            head={['페이지', '문의']}
            rows={data.journeyPages.map((j) => [<PageCell key="p" row={j} />, <Strong key="i" n={j.inquiries} />])}
          />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="많이 본 페이지">
          <Table
            head={['페이지', '조회', '방문']}
            rows={data.pages.slice(0, 20).map((pg) => [<PageCell key="p" row={pg} />, fmt(pg.views), fmt(pg.sessions)])}
          />
        </Panel>
        <Panel title="누른 버튼·링크">
          <Table
            head={['종류', '대상', '페이지', '횟수']}
            rows={data.clicks.map((c) => [
              EVENT_LABEL[c.kind] || c.kind,
              <span key="t" className="text-slate-400">{c.target || '-'}</span>,
              <span key="p" className="text-slate-500">{c.title || c.path}</span>,
              fmt(c.n),
            ])}
          />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="기기">
          <Bars rows={data.devices} />
        </Panel>
        <Panel title="브라우저">
          <Bars rows={data.browsers} />
        </Panel>
        <Panel title="고객이 고른 유입 경로" note="문의 폼의 '유입 경로' 답변">
          <Bars rows={data.heardFrom} />
        </Panel>
      </div>

      <Panel title="요일 · 시간대별 방문">
        <Heatmap rows={data.heat} />
      </Panel>

      <Panel title="들어온 링크" note="다른 사이트에서 클릭해 들어온 주소">
        <Table
          head={['주소', '채널', '방문', '문의']}
          rows={data.refUrls.map((r) => [
            <a key="u" href={r.ref_url} target="_blank" rel="noreferrer noopener" className="text-blue-400 hover:underline">
              {r.ref_url.replace(/^https?:\/\//, '')}
            </a>,
            r.channel,
            fmt(r.sessions),
            <Strong key="i" n={r.inquiries} />,
          ])}
        />
      </Panel>
    </div>
  );
}

// ── Pieces ───────────────────────────────────────────────────────────────────

function Card({ label, value, prev, sub, live, accent }) {
  const diff = prev == null ? null : value - prev;
  return (
    <div className={`rounded-xl border p-5 ${accent ? 'border-blue-700/60 bg-blue-950/40' : live ? 'border-emerald-700/60 bg-emerald-950/40' : 'border-slate-800 bg-slate-900'}`}>
      <div className="flex items-center gap-2 text-xs text-slate-400">
        {live && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />}
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-black text-white">{fmt(value)}</span>
        {diff != null && diff !== 0 && (
          <span className={`text-xs font-bold ${diff > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {diff > 0 ? '▲' : '▼'} {fmt(Math.abs(diff))}
          </span>
        )}
      </div>
      {sub && <div className="mt-1 truncate text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function Panel({ title, note, children }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-sm font-bold text-slate-300">{title}</h2>
      {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Strong({ n }) {
  return <span className={n ? 'font-bold text-blue-300' : 'text-slate-600'}>{fmt(n)}</span>;
}

function PageCell({ row }) {
  return (
    <span title={row.path}>
      {row.title ? <span className="text-slate-200">{row.title}</span> : <span className="font-mono text-xs text-slate-300">{safeDecode(row.path)}</span>}
    </span>
  );
}

function Table({ head, rows }) {
  if (!rows.length) return <p className="text-sm text-slate-500">아직 데이터가 없습니다.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-left text-xs text-slate-500">
            {head.map((h, i) => (
              <th key={h} className={`pb-2 font-medium ${i > 0 ? 'whitespace-nowrap pl-3 text-right' : ''}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, i) => (
            <tr key={i} className="border-b border-slate-800/60 last:border-0">
              {cells.map((c, j) =>
                j > 0 ? (
                  <td key={j} className="whitespace-nowrap py-2 pl-3 text-right tabular-nums text-slate-300">{c}</td>
                ) : (
                  <td key={j} className="py-2 pr-3 text-slate-300">
                    <div className="min-w-[7rem] max-w-[22rem] truncate">{c}</div>
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Bars({ rows }) {
  if (!rows.length) return <p className="text-sm text-slate-500">아직 데이터가 없습니다.</p>;
  const total = rows.reduce((n, r) => n + r.n, 0) || 1;
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex justify-between text-xs">
            <span className="text-slate-300">{r.label}</span>
            <span className="tabular-nums text-slate-500">
              {fmt(r.n)} · {pct((r.n / total) * 100)}
            </span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-slate-800">
            <div className="h-1.5 rounded-full bg-blue-500/70" style={{ width: `${(r.n / total) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** 방문(막대)과 문의(점). 의존성 없는 SVG. */
function Trend({ series }) {
  const rows = series.rows;
  if (!rows.length) return <p className="text-sm text-slate-500">아직 데이터가 없습니다.</p>;
  const W = 900;
  const H = 220;
  const PAD = 24;
  const maxV = Math.max(...rows.map((d) => d.sessions), 1);
  const maxI = Math.max(...rows.map((d) => d.inquiries), 1);
  const bw = (W - PAD * 2) / rows.length;
  const x = (i) => PAD + i * bw;
  const yV = (v) => H - PAD - (v / maxV) * (H - PAD * 2);
  const yI = (v) => H - PAD - (v / maxI) * (H - PAD * 2);
  const every = Math.max(1, Math.ceil(rows.length / 10));
  const label = (k) => (series.unit === 'hour' ? `${k}시` : `${Number(k.slice(5, 7))}/${Number(k.slice(8, 10))}`);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full min-w-[640px]">
        {rows.map((d, i) => (
          <g key={d.key}>
            <rect
              x={x(i) + 2}
              y={yV(d.sessions)}
              width={Math.max(bw - 4, 2)}
              height={H - PAD - yV(d.sessions)}
              rx="2"
              className="fill-blue-500/50 hover:fill-blue-400"
            >
              <title>{`${label(d.key)} · 방문 ${d.sessions} · 방문자 ${d.visitors} · 페이지뷰 ${d.pageviews} · 문의 ${d.inquiries}`}</title>
            </rect>
            {d.inquiries > 0 && (
              <circle cx={x(i) + bw / 2} cy={yI(d.inquiries)} r="5" className="fill-amber-400 stroke-slate-900" strokeWidth="2">
                <title>{`${label(d.key)} · 문의 ${d.inquiries}`}</title>
              </circle>
            )}
            {i % every === 0 && (
              <text x={x(i) + bw / 2} y={H - 6} textAnchor="middle" className="fill-slate-500 text-[10px]">
                {label(d.key)}
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="mt-2 flex gap-4 text-xs text-slate-500">
        <span><span className="mr-1 inline-block h-2 w-2 rounded-sm bg-blue-500/50" />방문</span>
        <span><span className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" />문의</span>
      </div>
    </div>
  );
}

const DOW = ['월', '화', '수', '목', '금', '토', '일'];
function Heatmap({ rows }) {
  const grid = useMemo(() => {
    const g = Array.from({ length: 7 }, () => Array(24).fill(0));
    rows.forEach((r) => {
      g[r.dow - 1][r.hour] = r.n;
    });
    return g;
  }, [rows]);
  const max = Math.max(1, ...grid.flat());
  if (!rows.length) return <p className="text-sm text-slate-500">아직 데이터가 없습니다.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[640px] border-separate border-spacing-0.5 text-[10px]">
        <thead>
          <tr>
            <th />
            {Array.from({ length: 24 }, (_, h) => (
              <th key={h} className="w-6 font-normal text-slate-500">{h % 3 === 0 ? h : ''}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((row, d) => (
            <tr key={d}>
              <th className="pr-2 font-normal text-slate-500">{DOW[d]}</th>
              {row.map((n, h) => (
                <td
                  key={h}
                  title={`${DOW[d]} ${h}시 · 방문 ${n}`}
                  className="h-6 w-6 rounded-sm"
                  style={{ background: n ? `rgba(59,130,246,${0.15 + (n / max) * 0.85})` : 'rgba(30,41,59,0.6)' }}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 광고·SNS·문자에 붙일 링크를 만든다. 이 링크로 들어온 방문과 문의가 '캠페인'에 잡힌다. */
function CampaignLinkBuilder() {
  const [page, setPage] = useState('https://univerlabmedia.co.kr/');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [copied, setCopied] = useState(false);

  const link = useMemo(() => {
    let u;
    try {
      u = new URL(page);
    } catch {
      return '';
    }
    if (source.trim()) u.searchParams.set('utm_source', source.trim());
    if (medium.trim()) u.searchParams.set('utm_medium', medium.trim());
    if (campaign.trim()) u.searchParams.set('utm_campaign', campaign.trim());
    return u.toString();
  }, [page, source, medium, campaign]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt('복사해서 쓰세요', link);
    }
  };

  const field = 'w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500';
  return (
    <Panel title="캠페인 링크 만들기" note="인스타그램 프로필, 유튜브 설명란, 광고, 제안서 등에 이 링크를 쓰면 어디서 문의가 왔는지 정확히 나뉩니다.">
      <div className="grid gap-3 md:grid-cols-4">
        <label className="md:col-span-4">
          <span className="mb-1 block text-xs text-slate-400">연결할 페이지</span>
          <input value={page} onChange={(e) => setPage(e.target.value)} className={field} />
        </label>
        <label>
          <span className="mb-1 block text-xs text-slate-400">어디에 (source)</span>
          <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="instagram, youtube, naver…" className={field} />
        </label>
        <label>
          <span className="mb-1 block text-xs text-slate-400">어떤 방식 (medium)</span>
          <input value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="profile, cpc, email…" className={field} />
        </label>
        <label className="md:col-span-2">
          <span className="mb-1 block text-xs text-slate-400">캠페인 이름</span>
          <input value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="2026_fall_shortform" className={field} />
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <code className="flex-1 truncate rounded-md bg-slate-950 px-3 py-2 text-xs text-slate-300">{link || '페이지 주소를 확인해 주세요'}</code>
        <button
          onClick={copy}
          disabled={!link || !source.trim()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-40"
        >
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      <p className="mt-2 text-[11px] text-slate-500">광고 링크라면 방식에 cpc 를 넣으면 '광고' 그룹으로 묶입니다.</p>
    </Panel>
  );
}

// ── Formatters ───────────────────────────────────────────────────────────────

const fmt = (n) => Number(n ?? 0).toLocaleString('ko-KR');
const pct = (v, digits = 0) => `${(Number.isFinite(v) ? v : 0).toFixed(digits)}%`;
const fmtWon = (n) => {
  const v = Number(n || 0);
  if (v >= 100000000) return `${(v / 100000000).toFixed(1).replace(/\.0$/, '')}억원`;
  if (v >= 10000) return `${Math.round(v / 10000).toLocaleString('ko-KR')}만원`;
  return `${v.toLocaleString('ko-KR')}원`;
};
const fmtSec = (sec) => (sec >= 60 ? `${Math.floor(sec / 60)}분 ${sec % 60}초` : `${sec}초`);
function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}
