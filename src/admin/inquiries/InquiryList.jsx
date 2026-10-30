import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminInquiriesApi } from '../../lib/api.js';
import { STATUS, MAIL, fmtDateTime, downloadCsv } from './status.js';
import { StatusBadge } from './StatusBadge.jsx';

/** 문의 관리 — 목록. 상태 탭, 검색, CSV 내려받기. */
export default function InquiryList() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    adminInquiriesApi
      .list({ status, q: query })
      .then((d) => {
        setError('');
        setData(d);
      })
      .catch((e) => setError(e.message));
  }, [status, query]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = data?.counts || {};
  const total = Object.entries(counts).reduce((n, [k, v]) => (k === 'spam' ? n : n + v), 0);
  const items = data?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">문의 관리</h1>
          <p className="mt-1 text-sm text-slate-400">
            홈페이지 문의 폼으로 들어온 문의입니다. 메일 발송이 실패해도 여기에는 남습니다.
          </p>
        </div>
        <button
          onClick={() => downloadCsv(items)}
          disabled={!items.length}
          className="rounded border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-500 hover:text-white disabled:opacity-40"
        >
          CSV 내려받기 ({items.length}건)
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Tab active={status === ''} onClick={() => setStatus('')} label="전체" n={total} />
        {STATUS.map((s) => (
          <Tab key={s.key} active={status === s.key} onClick={() => setStatus(s.key)} label={s.label} n={counts[s.key] || 0} />
        ))}
        <form
          className="ml-auto"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(q.trim());
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="브랜드·담당자·연락처·메모 검색"
            className="w-64 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-blue-500"
          />
        </form>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {!data && !error && <p className="text-sm text-slate-400">불러오는 중…</p>}

      {data && !items.length && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 px-6 py-16 text-center text-sm text-slate-400">
          {query || status ? '조건에 맞는 문의가 없습니다.' : '아직 저장된 문의가 없습니다. 새 문의부터 여기에 쌓입니다.'}
        </div>
      )}

      {items.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-left text-xs text-slate-500">
                <th className="px-4 py-3 font-medium">접수</th>
                <th className="px-4 py-3 font-medium">브랜드 · 담당자</th>
                <th className="px-4 py-3 font-medium">연락처</th>
                <th className="px-4 py-3 font-medium">서비스 · 예산</th>
                <th className="px-4 py-3 font-medium">유입</th>
                <th className="px-4 py-3 font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => navigate(`/admin/inquiries/${r.id}`)}
                  className="cursor-pointer border-b border-slate-800/60 transition last:border-0 hover:bg-slate-800/50"
                >
                  <td className="whitespace-nowrap px-4 py-3 align-top text-slate-400">
                    {fmtDateTime(r.created_at)}
                    <div className={`mt-0.5 text-[11px] ${MAIL[r.mail_status]?.cls || ''}`}>{MAIL[r.mail_status]?.label}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="font-bold text-white">{r.brand}</div>
                    <div className="text-xs text-slate-400">
                      {r.manager}
                      {r.position && ` · ${r.position}`}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 align-top font-mono text-xs text-slate-300">{r.phone}</td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-slate-200">{r.service}</div>
                    <div className="text-xs text-slate-500">{r.budget}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-slate-200">{r.channel || '알 수 없음'}</div>
                    <div className="max-w-[200px] truncate text-xs text-slate-500">
                      {r.keyword ? `"${r.keyword}"` : r.campaign ? `캠페인 ${r.campaign}` : `고객 선택: ${r.heard_from}`}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <StatusBadge status={r.status} />
                    {r.memo && <div className="mt-1 max-w-[180px] truncate text-[11px] text-slate-500">{r.memo}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Tab({ active, onClick, label, n }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
        active ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-700 text-slate-300 hover:border-slate-500'
      }`}
    >
      {label} <span className={active ? 'text-blue-100' : 'text-slate-500'}>{n}</span>
    </button>
  );
}
