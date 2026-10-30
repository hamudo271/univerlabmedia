import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { adminInquiriesApi } from '../../lib/api.js';
import { STATUS, statusOf, MAIL, fmtDateTime, fmtWon } from './status.js';
import { StatusBadge } from './StatusBadge.jsx';

const PAGE_NAMES = {
  '/': '홈',
  '/company': '회사 소개',
  '/service': '서비스 소개',
  '/portfolio': '제작 사례',
  '/pricing': '가격 안내',
  '/column': '칼럼 목록',
  '/contact': '문의하기',
};
const pageName = (p) => PAGE_NAMES[p] || (p?.startsWith('/column/') ? `칼럼 · ${safeDecode(p.slice(8))}` : p);
function safeDecode(s) {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

const elapsed = (from, to) => {
  const s = Math.max(0, Math.round((new Date(to) - new Date(from)) / 1000));
  if (s < 60) return `${s}초`;
  if (s < 3600) return `${Math.floor(s / 60)}분`;
  if (s < 86400) return `${Math.floor(s / 3600)}시간 ${Math.floor((s % 3600) / 60)}분`;
  return `${Math.floor(s / 86400)}일`;
};

/** 문의 관리 — 상세. 상태·메모·계약 금액 수정, 유입 정보, 문의 전 본 페이지. */
export default function InquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [memo, setMemo] = useState('');
  const [amount, setAmount] = useState('');
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    adminInquiriesApi
      .get(id)
      .then((d) => {
        setData(d);
        setMemo(d.item.memo || '');
        setAmount(d.item.amount == null ? '' : Number(d.item.amount).toLocaleString('ko-KR'));
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const save = async (patch) => {
    setSaving(true);
    setFlash('');
    try {
      const { item } = await adminInquiriesApi.update(id, patch);
      setData((d) => ({ ...d, item }));
      setFlash('저장했습니다.');
      setTimeout(() => setFlash(''), 2000);
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`"${data.item.brand}" 문의를 완전히 삭제할까요? 되돌릴 수 없습니다.\n스팸이라면 삭제 대신 '스팸'으로 바꾸는 것을 권장합니다.`)) return;
    try {
      await adminInquiriesApi.remove(id);
      navigate('/admin/inquiries');
    } catch (e) {
      alert(e.message);
    }
  };

  if (error) return <p className="text-red-400">{error}</p>;
  if (!data) return <p className="text-slate-400">불러오는 중…</p>;

  const r = data.item;
  const memoDirty = memo !== (r.memo || '');
  const amountNum = amount === '' ? null : Number(amount.replace(/[^\d]/g, ''));
  const amountDirty = amountNum !== (r.amount == null ? null : Number(r.amount));
  const mail = MAIL[r.mail_status] || MAIL.pending;
  const journey = Array.isArray(r.journey) ? r.journey : [];

  return (
    <div className="space-y-6">
      <Link to="/admin/inquiries" className="text-sm text-slate-400 hover:text-white">← 문의 목록</Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{r.brand}</h1>
            <StatusBadge status={r.status} />
          </div>
          <p className="mt-1 text-sm text-slate-400">
            {fmtDateTime(r.created_at)} 접수 · <span className={mail.cls}>{mail.label}</span>
            {r.contacted_at && ` · 첫 연락까지 ${elapsed(r.created_at, r.contacted_at)}`}
          </p>
          {r.mail_status === 'failed' && r.mail_error && (
            <p className="mt-1 break-all font-mono text-xs text-red-400/80">{r.mail_error}</p>
          )}
        </div>
        <button onClick={remove} className="rounded border border-red-900/60 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-950/50">
          삭제
        </button>
      </div>

      {/* 상태 */}
      <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="mb-3 text-sm font-bold text-slate-300">진행 상태</h2>
        <div className="flex flex-wrap gap-2">
          {STATUS.map((s) => (
            <button
              key={s.key}
              disabled={saving || s.key === r.status}
              onClick={() => save({ status: s.key })}
              className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                s.key === r.status ? `${s.cls} ring-1 ring-white/30` : 'border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_220px]">
          <label className="block">
            <span className="mb-1.5 block text-xs text-slate-400">메모 (상담 내용, 다음 할 일)</span>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={4}
              className="w-full resize-y rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-slate-400">계약 금액 (원)</span>
            <input
              value={amount}
              inputMode="numeric"
              onChange={(e) => {
                const d = e.target.value.replace(/[^\d]/g, '');
                setAmount(d ? Number(d).toLocaleString('ko-KR') : '');
              }}
              placeholder="예: 5,000,000"
              className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-blue-500"
            />
            <span className="mt-1.5 block text-[11px] text-slate-500">'계약' 상태의 금액이 유입 분석의 채널별 매출에 잡힙니다.</span>
          </label>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            disabled={saving || (!memoDirty && !amountDirty)}
            onClick={() => save({ memo, amount: amountNum })}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-500 disabled:opacity-40"
          >
            {saving ? '저장 중…' : '메모·금액 저장'}
          </button>
          {flash && <span className="text-xs text-emerald-400">{flash}</span>}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 문의 내용 */}
        <Panel title="문의 내용">
          <Rows
            rows={[
              ['담당자', `${r.manager}${r.position ? ` · ${r.position}` : ''}`],
              ['연락처', <a key="p" href={`tel:${r.phone.replace(/\D/g, '')}`} className="text-blue-400 hover:underline">{r.phone}</a>],
              ['운영 채널', <Ext key="c" url={r.channel_url} />],
              ['벤치마킹 채널', <Ext key="b" url={r.bench} />],
              ['원하는 서비스', r.service],
              ['월 예산', r.budget],
              ['사업체 소개', r.biz],
              ['의뢰 이유', r.reason],
              ['유튜브 운영 이유', r.goal],
            ]}
          />
        </Panel>

        <div className="space-y-6">
          {/* 유입 */}
          <Panel title="어디서 왔나">
            <Rows
              rows={[
                ['유입 채널', r.channel ? `${r.channel}${r.grp && r.grp !== r.channel ? ` (${r.grp})` : ''}` : '알 수 없음 (추적이 막힌 브라우저)'],
                ['검색어', r.keyword],
                ['캠페인', [r.src, r.medium, r.campaign].filter(Boolean).join(' / ')],
                ['들어온 링크', r.ref_url && <Ext key="r" url={r.ref_url} />],
                ['첫 페이지', r.landing && pageName(r.landing)],
                ['고객이 고른 경로', r.heard_from],
                ['첫 방문', r.first_seen && `${fmtDateTime(r.first_seen)}${r.first_channel ? ` · ${r.first_channel}` : ''}`],
                ['방문 횟수', r.visit_count && `${r.visit_count}번째 방문에서 문의`],
                ['기기', [r.device, r.os, r.browser].filter(Boolean).join(' · ')],
              ]}
            />
          </Panel>

          <Panel title={`문의 전에 본 페이지 (${journey.length})`}>
            {journey.length ? (
              <ol className="space-y-1.5 text-sm">
                {journey.map((j, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-12 shrink-0 text-right font-mono text-xs leading-5 text-slate-500">
                      {i === 0 ? '시작' : `+${elapsed(journey[0].at, j.at)}`}
                    </span>
                    <span className="truncate text-slate-200">{pageName(j.path)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-slate-500">기록 없음</p>
            )}
          </Panel>
        </div>
      </div>

      {data.samePhone.length > 0 && (
        <Panel title="같은 번호로 들어온 다른 문의">
          <ul className="space-y-2 text-sm">
            {data.samePhone.map((s) => (
              <li key={s.id}>
                <Link to={`/admin/inquiries/${s.id}`} className="flex items-center gap-3 text-slate-300 hover:text-white">
                  <span className="font-mono text-xs text-slate-500">{fmtDateTime(s.created_at)}</span>
                  <span className="font-bold">{s.brand}</span>
                  <span className="text-slate-500">{s.service}</span>
                  <StatusBadge status={s.status} />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {Array.isArray(r.history) && r.history.length > 0 && (
        <Panel title="변경 기록">
          <ul className="space-y-1.5 text-sm text-slate-300">
            {[...r.history].reverse().map((h, i) => (
              <li key={i} className="flex gap-3">
                <span className="shrink-0 font-mono text-xs leading-5 text-slate-500">{fmtDateTime(h.at)}</span>
                <span>
                  {h.field === 'status' && `상태: ${statusOf(h.from).label} → ${statusOf(h.to).label}`}
                  {h.field === 'amount' && `계약 금액: ${fmtWon(h.from) || '없음'} → ${fmtWon(h.to) || '없음'}`}
                  {h.field === 'memo' && '메모 수정'}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
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

function Rows({ rows }) {
  return (
    <dl className="space-y-3 text-sm">
      {rows
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <div key={k} className="grid grid-cols-[110px_1fr] gap-3">
            <dt className="text-slate-500">{k}</dt>
            <dd className="whitespace-pre-wrap break-words text-slate-200">{v}</dd>
          </div>
        ))}
    </dl>
  );
}

function Ext({ url }) {
  if (!url) return null;
  const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" className="break-all text-blue-400 hover:underline">
      {url}
    </a>
  );
}
