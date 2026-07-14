import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext.jsx';

// Shared animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};
export const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

/** Gradient-highlight the `accent` substring inside `text`. */
export const Accented = ({ text = '', accent }) => {
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

/** Premium full-width page hero with grid + brand glow. */
export const PageHero = ({ eyebrow, title, accent, subhead }) => (
  <section className="relative overflow-hidden border-b border-border-primary bg-bg-primary pb-24 pt-44">
    <div className="bg-grid absolute inset-0 opacity-40" />
    <div className="glow-accent absolute inset-0" style={{ '--gx': '12%', '--gy': '0%' }} />
    <div className="relative z-10 mx-auto max-w-7xl px-6">
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="mb-6 flex items-center gap-3"
        >
          <span className="h-px w-10 bg-accent-primary" />
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-accent-primary">{eyebrow}</span>
        </motion.div>
      )}
      <motion.h1
        initial="hidden" animate="visible" variants={fadeInUp}
        className="max-w-4xl whitespace-pre-line text-4xl font-black leading-[1.08] tracking-tight text-text-primary md:text-7xl"
      >
        <Accented text={title} accent={accent} />
      </motion.h1>
      {subhead && (
        <motion.p
          initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.15 }}
          className="mt-8 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-text-secondary md:text-xl"
        >
          {subhead}
        </motion.p>
      )}
    </div>
  </section>
);

/** Section heading block. */
export const SectionHeader = ({ eyebrow, headline, accent, subhead, center }) => (
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

/**
 * Full-bleed looping background video + dark overlay for CTA sections.
 * Shared by CTABand (subpages) and the home FinalCta so they stay identical.
 */
export const CtaVideoBg = ({ src = '/footer%20background%20video.mp4' }) => (
  <div className="absolute inset-0" aria-hidden>
    <video
      className="h-full w-full object-cover"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
    >
      <source src={src} type="video/mp4" />
    </video>
    {/* 검은 오버레이 — 텍스트 가독성 확보 */}
    <div className="absolute inset-0 bg-black/65" />
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/40" />
  </div>
);

/** Dark CTA band with brand-gradient button (video background). */
export const CTABand = ({ headline, subhead, button, to = '/contact' }) => (
  <section className="relative overflow-hidden bg-black py-28">
    <CtaVideoBg />
    <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
      <motion.h2
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
        className="mx-auto max-w-3xl whitespace-pre-line text-3xl font-black tracking-tight text-white md:text-5xl"
      >
        {headline}
      </motion.h2>
      {subhead && (
        <motion.p
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
          className="mx-auto mt-6 max-w-2xl text-lg text-white/70"
        >
          {subhead}
        </motion.p>
      )}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <Link
          to={to}
          className="bg-brand-gradient mt-10 inline-flex items-center gap-2 rounded-full px-10 py-5 text-lg font-bold text-white shadow-lg shadow-accent-primary/40 transition-transform hover:scale-105"
        >
          {button} <ArrowRight size={20} />
        </Link>
      </motion.div>
    </div>
  </section>
);

/**
 * Rich final CTA section (video bg + bullets + closing line + button).
 * Reads home.finalCta so every page shows the same unified CTA above the footer.
 */
export const FinalCta = () => {
  const { finalCta } = useContent('home');
  return (
    <section className="relative overflow-hidden bg-black py-32">
      <CtaVideoBg />
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

/**
 * Horizontal numbered process timeline — gradient nodes threaded on a
 * connecting line, with each step's title and description below its node.
 * Spans the row on large screens and scrolls sideways on narrow ones.
 * Shared by the Home and Service process sections (step counts differ).
 */
export const ProcessTimeline = ({ steps }) => (
  <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
    <motion.div
      variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="relative flex w-max gap-8 lg:w-full lg:gap-4"
    >
      {/* Connecting line running through the node centers */}
      <div className="absolute left-10 right-10 top-10 h-0.5 bg-gradient-to-r from-accent-primary/20 via-accent-secondary/50 to-accent-primary/20" />
      {steps.map((item, i) => (
        <motion.div
          key={item.step ?? i}
          variants={fadeInUp}
          className="group relative z-10 flex w-56 shrink-0 flex-col items-center text-center lg:w-auto lg:flex-1"
        >
          <span className="bg-brand-gradient ring-bg-primary mb-7 flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-black text-white shadow-lg shadow-accent-primary/30 ring-8 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110">
            {item.step ?? String(i + 1).padStart(2, '0')}
          </span>
          <h3 className="px-2 text-xl font-bold leading-snug text-text-primary transition-colors group-hover:text-accent-primary md:text-2xl">
            {item.title}
          </h3>
          <p className="mt-3 px-1 text-base leading-relaxed text-text-secondary">{item.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  </div>
);

/** Hexagon logo watermark — echoes the UNIVER LAB brand mark. */
const HexMark = ({ className = '' }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden>
    <path d="M50 4 L91 27 V73 L50 96 L9 73 V27 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    <path d="M50 26 L72 39 V65 L50 78 L28 65 V39 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" opacity="0.6" />
  </svg>
);

/**
 * Service navigation cards — one per /service/:id detail page.
 * Shared by Home, Service and Company so the four detail pages are always
 * reachable through one consistent, on-brand card grid.
 * Pass `withMore` to append a "서비스 더 보기" → /service button.
 */
export const ServiceCards = ({ withMore = false }) => {
  const { services } = useContent('serviceDetail');
  const items = services.items;
  return (
    <section className="border-y border-border-primary bg-bg-secondary py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow="Services" headline={'서비스를\n소개합니다'} accent="소개" center />
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((s, i) => (
            <motion.div key={s.id} variants={fadeInUp} whileHover={{ y: -8 }}>
              <Link
                to={`/service/${s.id}`}
                className="bg-brand-gradient group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-3xl p-7 shadow-lg shadow-black/5 transition-shadow hover:shadow-2xl hover:shadow-accent-primary/25"
              >
                {/* progressive darkening — bright brand → deep navy across the row */}
                <div className="absolute inset-0" style={{ backgroundColor: `rgba(9, 14, 40, ${0.06 + i * 0.17})` }} />
                <HexMark className="absolute -right-4 -top-4 h-28 w-28 text-white/15 transition-transform duration-500 group-hover:rotate-12" />
                <span className="relative z-10 text-xs font-semibold uppercase tracking-[0.15em] text-white/70">
                  {s.subtitle}
                </span>
                <div className="relative z-10">
                  <h3 className="text-2xl font-black leading-snug text-white">{s.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-white/90 transition-transform group-hover:translate-x-1">
                    자세히 보기 <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        {withMore && (
          <div className="mt-14 text-center">
            <Link
              to="/service"
              className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-bg-primary px-8 py-4 font-bold text-text-primary transition-colors hover:border-accent-primary hover:text-accent-primary"
            >
              서비스 더 보기 <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

/** Reusable YouTube lightbox. */
export const VideoLightbox = ({ videoId, onClose }) => (
  <AnimatePresence>
    {videoId && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 backdrop-blur"
      >
        <button
          onClick={onClose} aria-label="닫기"
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
