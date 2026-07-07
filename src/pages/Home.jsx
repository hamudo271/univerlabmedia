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
const Accented = ({ text, accent }) => {
  if (!accent || !text.includes(accent)) return <>{text}</>;
  const [before, after] = text.split(accent);
  return (
    <>
      {before}
      <span className="text-gradient">{accent}</span>
      {after}
    </>
  );
};

const SectionHeader = ({ eyebrow, headline, accent, subhead, center }) => (
  <div className={`mb-16 ${center ? 'text-center' : ''}`}>
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

// ── Brand intro (dark, grid + glow, stats) ──────────────────────
const BrandIntro = () => {
  const { brandIntro } = useContent('home');
  return (
    <section className="relative overflow-hidden border-y border-border-primary bg-bg-primary py-32">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="glow-accent absolute inset-0" style={{ '--gx': '20%', '--gy': '10%' }} />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.span
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="mb-5 block text-sm font-bold uppercase tracking-[0.2em] text-accent-primary"
        >
          {brandIntro.eyebrow}
        </motion.span>
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="max-w-4xl whitespace-pre-line text-4xl font-black leading-[1.1] tracking-tight text-text-primary md:text-7xl"
        >
          <Accented text={brandIntro.headline} accent={brandIntro.accent} />
        </motion.h2>
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="mt-8 max-w-2xl whitespace-pre-line text-lg text-text-secondary md:text-xl"
        >
          {brandIntro.body}
        </motion.p>

        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4"
        >
          {brandIntro.stats.map((s, i) => (
            <motion.div
              key={i} variants={fadeInUp}
              className="rounded-2xl border border-border-primary bg-bg-secondary/60 p-6 text-center backdrop-blur"
            >
              <div className="text-3xl font-black text-text-primary md:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm text-text-secondary">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// ── Case showcase (YouTube grid + lightbox) ─────────────────────
const Cases = ({ onPlay }) => {
  const { cases } = useContent('home');
  return (
    <section className="bg-bg-secondary py-28">
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
    <section className="border-b border-border-primary bg-bg-primary py-28 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-20 text-center">
          <motion.span
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="mb-3 block text-xs font-bold uppercase tracking-[0.25em] text-accent-primary"
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
            <motion.div key={i} variants={fadeInUp} className="flex h-16 items-center justify-center">
              <img
                src={p.src}
                alt={p.name}
                loading="lazy"
                className="max-h-11 w-auto max-w-[140px] object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 dark:opacity-50 dark:invert dark:hover:opacity-100 dark:hover:invert-0"
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
    <section className="relative overflow-hidden border-y border-border-primary bg-bg-secondary py-28">
      <div className="glow-accent absolute inset-0" style={{ '--gx': '80%', '--gy': '0%' }} />
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
                  i === page ? 'bg-brand-gradient w-8' : 'w-2 bg-border-primary'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// ── Stylized browser mockup for growth steps ────────────────────
const Mockup = ({ variant }) => (
  <div className="relative w-full overflow-hidden rounded-2xl border border-border-primary bg-bg-elevated shadow-xl">
    <div className="flex items-center gap-1.5 border-b border-border-primary bg-bg-secondary px-4 py-3">
      <span className="h-3 w-3 rounded-full bg-red-400/80" />
      <span className="h-3 w-3 rounded-full bg-amber-400/80" />
      <span className="h-3 w-3 rounded-full bg-green-400/80" />
    </div>
    <div className="space-y-3 p-6">
      {variant === 'chart' ? (
        <>
          <div className="flex items-end gap-2">
            {[40, 65, 50, 80, 95, 70, 100].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }} whileInView={{ height: `${h}px` }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="flex-1 rounded-t bg-gradient-to-t from-accent-primary/30 to-accent-primary"
              />
            ))}
          </div>
          <div className="h-2 w-2/3 rounded-full bg-border-primary" />
          <div className="h-2 w-1/2 rounded-full bg-border-primary" />
        </>
      ) : (
        <>
          <div className="h-24 rounded-lg bg-gradient-to-br from-accent-primary/20 to-purple-500/10" />
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-10 rounded-md bg-border-primary/60" />
            ))}
          </div>
          <div className="h-2 w-3/4 rounded-full bg-border-primary" />
          <div className="h-2 w-1/2 rounded-full bg-border-primary" />
        </>
      )}
    </div>
  </div>
);

// ── Growth steps (alternating image + text) ─────────────────────
const Growth = () => {
  const { growth } = useContent('home');
  return (
    <section className="bg-bg-primary py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow={growth.eyebrow} headline={growth.headline} accent="성장" center />
        <div className="space-y-24 md:space-y-32">
          {growth.steps.map((item, i) => {
            const flip = i % 2 === 1;
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
                  <span className="bg-brand-gradient mb-5 inline-block rounded-full px-4 py-1.5 text-sm font-bold text-white">
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
                  <Mockup variant={i % 2 === 0 ? 'chart' : 'app'} />
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
    <section className="relative overflow-hidden border-y border-border-primary bg-bg-secondary py-28">
      <div className="bg-grid absolute inset-0 opacity-30" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
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

// ── Process (sticky intro + numbered timeline) ──────────────────
const Process = () => {
  const { process } = useContent('home');
  return (
    <section className="bg-bg-primary py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div className="md:sticky md:top-32 md:self-start">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-accent-primary">
            {process.eyebrow}
          </span>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-text-primary md:text-5xl">
            고객 만족도를 최우선합니다
          </h2>
          <p className="mt-5 text-text-secondary">
            상담부터 완성까지, 유니버랩 미디어의 체계적인 7단계 작업 프로세스.
          </p>
          <Link
            to="/contact"
            className="bg-brand-gradient mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold text-white shadow-lg shadow-accent-primary/30 transition-transform hover:scale-105"
          >
            상담 신청하기 <ArrowRight size={18} />
          </Link>
        </div>

        <div className="space-y-4">
          {process.steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group flex gap-5 rounded-2xl border border-border-primary bg-bg-secondary p-6 transition-colors hover:border-accent-primary"
            >
              <span className="bg-brand-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-black text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-primary">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Services (4 cards) ──────────────────────────────────────────
const Services = () => {
  const { services } = useContent('serviceDetail');
  const items = services.items;
  return (
    <section className="border-y border-border-primary bg-bg-secondary py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Services" headline={'서비스를\n소개합니다'} accent="소개" center
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <motion.div
              key={s.id}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="group overflow-hidden rounded-3xl border border-border-primary bg-bg-elevated"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={s.heroImage} alt={s.title} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-wide text-white/80">
                  {s.subtitle}
                </span>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-bold text-text-primary">{s.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{s.desc}</p>
                <Link
                  to={`/service/${s.id}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-accent-primary"
                >
                  자세히 보기 <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link
            to="/service"
            className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-bg-primary px-8 py-4 font-bold text-text-primary transition-colors hover:border-accent-primary hover:text-accent-primary"
          >
            서비스 더 보기 <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

// ── FAQ accordion ───────────────────────────────────────────────
const FAQ = () => {
  const { faq } = useContent('home');
  const [open, setOpen] = useState(null);
  return (
    <section className="bg-bg-primary py-28">
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
const FinalCta = () => {
  const { finalCta } = useContent('home');
  return (
    <section className="relative overflow-hidden bg-black py-32">
      <img
        src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop"
        alt="" aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.span
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="block text-2xl font-bold text-white/60 md:text-3xl"
        >
          {finalCta.eyebrow}
        </motion.span>
        <motion.h2
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="mt-2 text-4xl font-black tracking-tight text-white md:text-6xl"
        >
          {finalCta.headline}
        </motion.h2>
        <ul className="mt-10 space-y-3">
          {finalCta.bullets.map((b, i) => (
            <motion.li
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="flex items-start gap-3 text-white/80"
            >
              <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-accent-soft" />
              <span>{b}</span>
            </motion.li>
          ))}
        </ul>
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="mt-10 text-xl font-bold text-white md:text-2xl"
        >
          {finalCta.closing}
        </motion.p>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
          <Link
            to="/contact"
            className="bg-brand-gradient mt-10 inline-flex items-center gap-2 rounded-full px-10 py-5 text-lg font-bold text-white shadow-lg shadow-accent-primary/40 transition-transform hover:scale-105"
          >
            {finalCta.button} <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

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
      <Services />
      <ColumnHighlights />
      <FAQ />
      <FinalCta />
      <Lightbox videoId={video} onClose={() => setVideo(null)} />
      <ScarcityBar />
    </div>
  );
};

export default Home;
