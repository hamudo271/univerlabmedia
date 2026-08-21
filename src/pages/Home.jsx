import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Plus,
  Minus,
  Play,
  Star,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import HeroSlider from '../components/home/HeroSlider.jsx';
import ScarcityBar from '../components/home/ScarcityBar.jsx';
import ColumnHighlights from '../components/home/ColumnHighlights.jsx';
import { FinalCta, ServiceCards, ProcessTimeline } from '../components/common/ui.jsx';
import { useContent } from '../context/ContentContext.jsx';

// ── Animation variants ──────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

/** Render a headline string, gradient-highlighting the `accent` substring. */
const Accented = ({ text, accent, onDark = false }) => {
  if (!accent || !text.includes(accent)) return <>{text}</>;
  const [before, after] = text.split(accent);
  return (
    <>
      {before}
      <span className={onDark ? 'text-gradient-on-dark' : 'text-gradient'}>{accent}</span>
      {after}
    </>
  );
};

const SectionHeader = ({ eyebrow, headline, accent, subhead, center }) => (
  <div className={`mb-10 md:mb-16 ${center ? 'text-center' : ''}`}>
    {eyebrow && (
      <motion.span
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-accent-primary"
      >
        {eyebrow}
      </motion.span>
    )}
    <motion.h2
      initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
      className="whitespace-pre-line text-3xl font-black leading-tight tracking-tight text-text-primary md:text-5xl"
    >
      <Accented text={headline} accent={accent} />
    </motion.h2>
    {subhead && (
      <motion.p
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        className={`mt-5 whitespace-pre-line text-lg text-text-secondary ${center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}
      >
        {subhead}
      </motion.p>
    )}
  </div>
);

/**
 * One cell of the 2×2 evidence grid on the navy band. Hairlines between
 * cells come from the grid, not from card chrome, so the numbers read as
 * one instrument panel rather than four boxes.
 */
function StatCell({ stat }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="border-t border-white/10 px-0 py-7 first:border-t-0 sm:px-8 sm:py-8 sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(even)]:border-l sm:[&:nth-child(odd)]:pl-0"
    >
      <dd className="text-gradient-on-dark m-0 text-5xl font-black tabular-nums leading-none tracking-[-0.02em] md:text-6xl">
        {stat.value}
      </dd>
      <dt className="mt-3.5 text-base font-bold text-white md:text-lg">{stat.label}</dt>
      {stat.href ? (
        <Link
          to={stat.href}
          className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[#7aa2ff] hover:underline"
        >
          {stat.note} <ArrowRight size={14} />
        </Link>
      ) : (
        stat.note && <span className="mt-1 block text-sm text-white/50">{stat.note}</span>
      )}
    </motion.div>
  );
}

// ── Brand intro — navy band: claim on the left, 2×2 evidence on the right ──
// The one dark section between the hero and the final CTA. It sits on the
// same navy as the service cards and footer, so the brand gradient reads at
// full strength here without the white-on-white problem the old cards had.
const BrandIntro = () => {
  const { brandIntro } = useContent('home');

  return (
    <section className="bg-[#0b1020] py-20 text-white md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-12 lg:items-center lg:gap-20">
        {/* 주장 */}
        <div className="lg:col-span-5">
          <motion.span
            initial="hidden" animate="visible" variants={fadeInUp}
            className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-[#5b8cff]"
          >
            {brandIntro.eyebrow}
          </motion.span>
          <motion.h2
            initial="hidden" animate="visible" variants={fadeInUp}
            className="whitespace-pre-line text-4xl font-black leading-[1.12] tracking-[-0.01em] text-white md:text-6xl"
          >
            <Accented text={brandIntro.headline} accent={brandIntro.accent} onDark />
          </motion.h2>
          <motion.p
            initial="hidden" animate="visible" variants={fadeInUp}
            className="mt-6 max-w-md text-lg leading-relaxed text-white/60"
          >
            {brandIntro.body.replace(/\n/g, ' ')}
          </motion.p>
        </div>

        {/* 증거 — animate (not whileInView) so the proof never depends on an
            observer firing; a stuck reveal used to leave this band empty. */}
        <motion.dl
          variants={stagger} initial="hidden" animate="visible"
          className="m-0 grid grid-cols-1 sm:grid-cols-2 lg:col-span-7"
        >
          {brandIntro.stats.map((s) => (
            <StatCell key={s.label} stat={s} />
          ))}
        </motion.dl>
      </div>
    </section>
  );
};

// ── Case showcase (YouTube grid + lightbox) ─────────────────────
const Cases = ({ onPlay }) => {
  const { cases } = useContent('home');
  return (
    <section className="bg-bg-secondary py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow={cases.eyebrow} headline={cases.headline} accent={cases.accent} subhead={cases.subhead}
        />
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {cases.items.map((c, i) => (
            <motion.button
              key={c.videoId + i} variants={fadeInUp}
              onClick={() => onPlay(c.videoId)}
              className="group relative aspect-video overflow-hidden rounded-2xl border border-border-primary bg-black text-left"
            >
              <img
                src={`https://img.youtube.com/vi/${c.videoId}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                {c.tag}
              </span>
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-primary">
                <Play size={22} className="ml-0.5 fill-white text-white" />
              </span>
            </motion.button>
          ))}
        </motion.div>
        <div className="mt-14 text-center">
          <Link
            to={cases.morePath}
            className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-bg-primary px-8 py-4 font-bold text-text-primary transition-colors hover:border-accent-primary hover:text-accent-primary"
          >
            {cases.moreLabel} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ── Partner logo wall ───────────────────────────────────────────
const Partners = () => {
  const { partners } = useContent('home');
  return (
    <section className="border-b border-border-primary bg-bg-primary py-16 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center md:mb-20">
          <motion.span
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-accent-primary"
          >
            {partners.eyebrow}
          </motion.span>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="whitespace-pre-line text-2xl font-black tracking-tight text-text-primary md:text-4xl"
          >
            <Accented text={partners.headline} accent={partners.accent} />
          </motion.h2>
        </div>
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-2 gap-x-8 gap-y-14 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {partners.items.map((p, i) => (
            <motion.div key={i} variants={fadeInUp} className="flex h-14 items-center justify-center">
              {/* Trimmed assets + fixed height + multiply blend = uniform optical
                  weight even for logos with baked-in white backgrounds. */}
              <img
                src={p.src}
                alt={p.name}
                loading="lazy"
                className="h-7 w-auto max-w-[150px] object-contain opacity-55 grayscale mix-blend-multiply transition-all duration-300 hover:opacity-100 hover:grayscale-0 md:h-8"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ── Testimonials carousel ───────────────────────────────────────
const Testimonials = () => {
  const { testimonials } = useContent('home');
  const items = testimonials.items;
  const [page, setPage] = useState(0);
  const perPage = 3;
  const pages = Math.ceil(items.length / perPage);
  const shown = items.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="relative overflow-hidden border-y border-border-primary bg-bg-secondary py-16 md:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow={testimonials.eyebrow} headline={testimonials.headline} accent={testimonials.accent} center
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <AnimatePresence mode="wait">
            {shown.map((t, i) => (
              <motion.div
                key={page + '-' + i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex flex-col rounded-3xl border border-border-primary bg-bg-elevated p-8"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-primary/15 text-base font-black text-accent-primary">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-text-primary">{t.name}</div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star key={s} size={13} className="fill-amber-400" />
                        ))}
                        <span className="ml-1 text-xs font-semibold text-text-secondary">
                          {t.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  {t.brand && (
                    <img src={t.brand} alt="" className="max-h-6 w-auto object-contain opacity-70 dark:invert" />
                  )}
                </div>
                <p className="text-[15px] leading-relaxed text-text-secondary">{t.body}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {pages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`후기 페이지 ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === page ? 'w-8 bg-accent-primary' : 'w-2 bg-border-primary'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ── Stylized browser mockups for growth steps ───────────────────
// Each step gets its own scene so the section reads as five distinct
// proofs instead of one repeated placeholder chart.

/** Shared browser-chrome shell. */
const MockShell = ({ label, children }) => (
  <div className="relative w-full overflow-hidden rounded-2xl border border-border-primary bg-bg-elevated shadow-xl">
    <div className="flex items-center gap-1.5 border-b border-border-primary bg-bg-secondary px-4 py-3">
      <span className="h-3 w-3 rounded-full bg-red-400/80" />
      <span className="h-3 w-3 rounded-full bg-amber-400/80" />
      <span className="h-3 w-3 rounded-full bg-green-400/80" />
      {label && (
        <span className="ml-3 rounded-md bg-bg-primary px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-text-secondary">
          {label}
        </span>
      )}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

/** Step 1 — 직접 운영 채널 대시보드 (11만 / 3만 / 1만). */
const MockChannels = () => (
  <MockShell label="Channel Dashboard">
    <div className="space-y-3">
      {[
        { subs: '11만', w: 'w-full' },
        { subs: '3만', w: 'w-2/3' },
        { subs: '1만', w: 'w-2/5' },
      ].map((c, i) => (
        <div key={i} className="flex items-center gap-4 rounded-xl border border-border-primary bg-bg-secondary/60 px-4 py-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-primary/12 text-[11px] font-black text-accent-primary">
            CH
          </span>
          <div className="min-w-0 flex-1">
            <div className="h-2 w-24 rounded-full bg-border-primary" />
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border-primary/50">
              <motion.div
                initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full bg-accent-primary/70 ${c.w}`}
              />
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="text-sm font-black tabular-nums text-text-primary">{c.subs}</div>
            <div className="text-[10px] font-bold text-emerald-500">▲ 구독자</div>
          </div>
        </div>
      ))}
      <p className="pt-1 text-center text-[11px] font-semibold text-text-secondary">
        유니버랩이 직접 운영하는 채널
      </p>
    </div>
  </MockShell>
);

/** Step 2 — 영상별 목적이 정의된 기획안. */
const MockObjective = () => (
  <MockShell label="기획안 — 영상의 목적">
    <div className="mb-4 flex flex-wrap gap-2">
      {['구독 전환', '브랜딩', '상품 노출', '시청 지속'].map((t, i) => (
        <motion.span
          key={t}
          initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
          className={`rounded-full px-3 py-1 text-[11px] font-bold ${
            i === 0
              ? 'bg-accent-primary text-white'
              : 'border border-border-primary text-text-secondary'
          }`}
        >
          {t}
        </motion.span>
      ))}
    </div>
    <div className="space-y-2.5">
      <div className="h-2 w-5/6 rounded-full bg-border-primary" />
      <div className="h-2 w-2/3 rounded-full bg-border-primary" />
      <div className="rounded-lg border-l-2 border-accent-primary bg-accent-primary/8 px-3 py-2.5">
        <div className="h-2 w-1/2 rounded-full bg-accent-primary/40" />
        <div className="mt-2 h-2 w-3/4 rounded-full bg-accent-primary/25" />
      </div>
      <div className="h-2 w-3/5 rounded-full bg-border-primary" />
    </div>
  </MockShell>
);

/** Step 3 — 편집 타임라인 (멀티트랙 + 플레이헤드). */
const MockTimeline = () => (
  <MockShell label="Edit Timeline">
    <div className="mb-4 flex aspect-[16/6] items-center justify-center rounded-lg bg-gradient-to-br from-accent-primary/15 to-accent-secondary/10">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-primary/70 backdrop-blur">
        <Play size={16} className="ml-0.5 fill-text-primary text-text-primary" />
      </span>
    </div>
    <div className="relative space-y-2">
      {[
        ['w-[30%]', 'w-[24%]', 'w-[34%]'],
        ['w-[46%]', 'w-[40%]'],
        ['w-[70%]', 'w-[18%]'],
      ].map((clips, row) => (
        <div key={row} className="flex gap-1.5">
          {clips.map((w, i) => (
            <div
              key={i}
              className={`h-5 rounded ${w} ${
                row === 0 ? 'bg-accent-primary/60' : row === 1 ? 'bg-accent-secondary/45' : 'bg-border-primary'
              }`}
            />
          ))}
        </div>
      ))}
      {/* playhead */}
      <motion.div
        initial={{ left: '4%' }}
        whileInView={{ left: ['4%', '88%'] }}
        viewport={{ once: false, amount: 0.6 }}
        transition={{ duration: 7, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
        className="absolute -top-1 bottom-0 w-px bg-red-400"
        style={{ left: '4%' }}
      >
        <span className="absolute -left-[3px] -top-1 h-2 w-[7px] rounded-sm bg-red-400" />
      </motion.div>
    </div>
  </MockShell>
);

/** Step 4 — 업로드 이후: 시청 지속률 복기 리포트. */
const MockRetention = () => (
  <MockShell label="사후 관리 리포트">
    <div className="mb-3 flex items-center gap-2">
      <span className="rounded-md bg-border-primary/50 px-2 py-1 text-[10px] font-bold text-text-secondary">개선 전</span>
      <span className="rounded-md bg-accent-primary px-2 py-1 text-[10px] font-bold text-white">개선 후</span>
      <span className="ml-auto text-[10px] font-semibold text-text-secondary">시청 지속률</span>
    </div>
    <svg viewBox="0 0 300 110" className="w-full" aria-hidden>
      <defs>
        <linearGradient id="ret-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* 개선 전 — 급락하는 회색 곡선 */}
      <path
        d="M0,30 C40,38 70,74 120,86 C180,98 240,100 300,102"
        fill="none" stroke="var(--border-primary)" strokeWidth="2.5" strokeDasharray="5 4"
      />
      {/* 개선 후 — 완만하게 유지되는 브랜드 곡선 */}
      <motion.path
        d="M0,22 C50,26 90,38 150,46 C210,54 260,58 300,60"
        fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      <path d="M0,22 C50,26 90,38 150,46 C210,54 260,58 300,60 L300,110 L0,110 Z" fill="url(#ret-fill)" />
      <circle cx="150" cy="46" r="4" fill="var(--accent-primary)" />
    </svg>
    <div className="mt-2 h-2 w-1/2 rounded-full bg-border-primary" />
  </MockShell>
);

/** Step 5 — 월 제작 쿼터 보드. */
const MockQuota = () => {
  const filled = 17;
  return (
    <MockShell label="이번 달 제작 쿼터">
      <div className="grid grid-cols-10 gap-1.5">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
            className={`aspect-square rounded-md ${
              i < filled ? 'bg-accent-primary/80' : 'border border-dashed border-border-primary'
            }`}
          />
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-lg font-black tabular-nums text-text-primary">17 / 20</div>
          <div className="text-[11px] text-text-secondary">품질 유지를 위한 월 한정 수량</div>
        </div>
        <span className="rounded-full bg-red-500/10 px-3 py-1.5 text-[11px] font-bold text-red-500">
          마감 임박
        </span>
      </div>
    </MockShell>
  );
};

const GROWTH_MOCKUPS = [MockChannels, MockObjective, MockTimeline, MockRetention, MockQuota];

// ── Growth steps (alternating image + text) ─────────────────────
const Growth = () => {
  const { growth } = useContent('home');
  return (
    <section className="bg-bg-primary py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow={growth.eyebrow} headline={growth.headline} accent="성장" center />
        <div className="space-y-16 md:space-y-32">
          {growth.steps.map((item, i) => {
            const flip = i % 2 === 1;
            const StepMock = GROWTH_MOCKUPS[i % GROWTH_MOCKUPS.length];
            return (
              <div
                key={item.step}
                className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
              >
                <motion.div
                  initial={{ opacity: 0, x: flip ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={flip ? 'md:order-2' : ''}
                >
                  <span className="mb-5 inline-block rounded-full bg-accent-primary/10 px-4 py-1.5 text-sm font-bold text-accent-primary">
                    {item.step}
                  </span>
                  <h3 className="mb-6 text-2xl font-black leading-snug text-text-primary md:text-3xl">
                    {item.title}
                  </h3>
                  <ul className="space-y-3">
                    {item.desc.map((line, j) => (
                      <li key={j} className="flex items-start gap-3 text-text-secondary">
                        <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent-primary" />
                        <span className="text-[15px] leading-relaxed md:text-base">{line.value}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={flip ? 'md:order-1' : ''}
                >
                  <StepMock />
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ── Safety (2 안심제도) ─────────────────────────────────────────
const Safety = () => {
  const { safety } = useContent('home');
  const cards = [
    { title: safety.card1Title, body: safety.card1Body, icon: ShieldCheck, tint: 'text-blue-400 bg-blue-500/10' },
    { title: safety.card2Title, body: safety.card2Body, icon: Clock, tint: 'text-purple-400 bg-purple-500/10' },
  ];
  return (
    <section className="relative overflow-hidden border-y border-border-primary bg-bg-secondary py-16 md:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-10 text-center md:mb-16">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-3xl font-black tracking-tight text-text-primary md:text-5xl"
          >
            <span className="text-gradient">2가지 안심제도</span>를 운영합니다
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="mt-5 text-lg text-text-secondary"
          >
            {safety.subhead}
          </motion.p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="rounded-3xl border border-border-primary bg-bg-elevated p-10"
            >
              <div className={`mb-7 flex h-14 w-14 items-center justify-center rounded-2xl ${c.tint}`}>
                <c.icon size={28} />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-text-primary">{c.title}</h3>
              <p className="whitespace-pre-line leading-relaxed text-text-secondary">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Process (horizontal numbered timeline) ──────────────────────
const Process = () => {
  const { process } = useContent('home');
  return (
    <section className="bg-bg-primary py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* Intro */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-accent-primary"
          >
            {process.eyebrow}
          </motion.span>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-3xl font-black leading-tight tracking-tight text-text-primary md:text-5xl"
          >
            고객 만족도를 최우선합니다
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="mt-5 text-text-secondary"
          >
            상담부터 완성까지, 유니버랩 미디어의 체계적인 7단계 작업 프로세스.
          </motion.p>
        </div>

        {/* Horizontal timeline — scrolls on small screens, spans the row on large */}
        <div className="mt-12 md:mt-20">
          <ProcessTimeline steps={process.steps} />
        </div>

        {/* CTA */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="mt-16 text-center"
        >
          <Link
            to="/contact"
            className="bg-brand-gradient inline-flex items-center gap-2 rounded-full px-8 py-4 font-bold text-white shadow-lg shadow-accent-primary/30 transition-transform hover:scale-105"
          >
            상담 신청하기 <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// ── FAQ accordion ───────────────────────────────────────────────
const FAQ = () => {
  const { faq } = useContent('home');
  const [open, setOpen] = useState(null);
  return (
    /* id: BrandIntro 의 "환불 기준 보기" 링크가 여기로 내려온다 */
    <section id="faq" className="scroll-mt-24 bg-bg-secondary py-16 md:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader eyebrow={faq.eyebrow} headline={faq.headline} center />
        <div className="border-t border-border-primary">
          {faq.items.map((item, i) => (
            <div key={i} className="border-b border-border-primary">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="group flex w-full items-center justify-between py-6 text-left"
              >
                <span className="pr-6 text-lg font-bold text-text-primary group-hover:text-accent-primary">
                  {item.q}
                </span>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    open === i
                      ? 'border-accent-primary bg-accent-primary text-white'
                      : 'border-border-primary text-text-secondary'
                  }`}
                >
                  {open === i ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="ml-1 whitespace-pre-line border-l-2 border-accent-primary pb-6 pl-4 leading-relaxed text-text-secondary">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Final CTA ───────────────────────────────────────────────────
// ── YouTube lightbox ────────────────────────────────────────────
const Lightbox = ({ videoId, onClose }) => (
  <AnimatePresence>
    {videoId && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur"
      >
        <button
          onClick={onClose}
          aria-label="닫기"
          className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <X size={22} />
        </button>
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title="유니버랩 미디어 제작 사례"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ── Page ────────────────────────────────────────────────────────
const Home = () => {
  const { seo } = useContent('home');
  const [video, setVideo] = useState(null);

  return (
    <div className="bg-bg-primary">
      <SEO title={seo.title} description={seo.description} path="/" />
      <HeroSlider />
      <BrandIntro />
      <Cases onPlay={setVideo} />
      <Partners />
      <Testimonials />
      <Growth />
      <Safety />
      <Process />
      <ServiceCards withMore />
      <ColumnHighlights />
      <FAQ />
      <FinalCta />
      <Lightbox videoId={video} onClose={() => setVideo(null)} />
      <ScarcityBar />
    </div>
  );
};

export default Home;
