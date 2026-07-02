import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';

// Shared easing curve used across the site's scroll/entrance animations.
export const EASE_STANDARD = [0.22, 1, 0.36, 1];

// Shared animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_STANDARD } },
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

/** Dark CTA band with brand-gradient button. */
export const CTABand = ({ headline, subhead, button, to = '/contact' }) => (
  <section className="relative overflow-hidden bg-black py-28">
    <img
      src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop"
      alt="" aria-hidden
      className="absolute inset-0 h-full w-full object-cover opacity-20"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/50" />
    <div
      className="absolute inset-0 opacity-70"
      style={{ background: 'radial-gradient(700px circle at 80% 20%, rgba(167,139,250,0.18), transparent 55%)' }}
    />
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
