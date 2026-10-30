// 문의 상태. 서버 server/routes/adminInquiries.js 의 STATUSES 와 같은 순서.
export const STATUS = [
  { key: 'new', label: '신규', cls: 'bg-blue-500/15 text-blue-300 border-blue-500/40' },
  { key: 'contacted', label: '연락 중', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/40' },
  { key: 'proposal', label: '미팅·견적', cls: 'bg-violet-500/15 text-violet-300 border-violet-500/40' },
  { key: 'won', label: '계약', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40' },
  { key: 'hold', label: '보류', cls: 'bg-slate-500/15 text-slate-300 border-slate-500/40' },
  { key: 'lost', label: '종료', cls: 'bg-slate-700/30 text-slate-400 border-slate-600/40' },
  { key: 'spam', label: '스팸', cls: 'bg-red-500/10 text-red-300 border-red-500/30' },
];

export const statusOf = (key) => STATUS.find((s) => s.key === key) || STATUS[0];

export const MAIL = {
  sent: { label: '메일 발송됨', cls: 'text-slate-500' },
  failed: { label: '메일 실패', cls: 'text-red-400 font-bold' },
  off: { label: '메일 미설정', cls: 'text-amber-400' },
  pending: { label: '메일 대기', cls: 'text-slate-500' },
};

export function fmtDateTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export const fmtWon = (n) => (n == null ? '' : `${Number(n).toLocaleString('ko-KR')}원`);

/** 목록 그대로를 엑셀에서 바로 열리는 CSV 로 내려받는다. */
export function downloadCsv(items) {
  const cols = [
    ['접수일시', (r) => fmtDateTime(r.created_at)],
    ['상태', (r) => statusOf(r.status).label],
    ['브랜드명', (r) => r.brand],
    ['담당자', (r) => r.manager],
    ['직책', (r) => r.position],
    ['연락처', (r) => r.phone],
    ['운영 채널', (r) => r.channel_url],
    ['사업체 소개', (r) => r.biz],
    ['벤치마킹 채널', (r) => r.bench],
    ['월 예산', (r) => r.budget],
    ['원하는 서비스', (r) => r.service],
    ['의뢰 이유', (r) => r.reason],
    ['유튜브 운영 이유', (r) => r.goal],
    ['유입 경로(고객 선택)', (r) => r.heard_from],
    ['유입 채널(자동)', (r) => r.channel],
    ['검색어', (r) => r.keyword],
    ['캠페인', (r) => r.campaign],
    ['첫 페이지', (r) => r.landing],
    ['기기', (r) => r.device],
    ['계약 금액', (r) => (r.amount == null ? '' : r.amount)],
    ['메모', (r) => r.memo],
  ];
  const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const lines = [cols.map(([h]) => cell(h)).join(',')].concat(items.map((r) => cols.map(([, f]) => cell(f(r))).join(',')));
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  const d = new Date();
  a.download = `유니버랩_문의_${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
