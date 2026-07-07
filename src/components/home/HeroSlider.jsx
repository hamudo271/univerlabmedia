import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext.jsx';

const AUTOPLAY_MS = 6000;

/** Highlight the `accent` substring inside a title line with gradient text. */
const renderTitle = (title, accent) => {
  const lines = title.split('\n');
  return lines.map((line, li) => {
    if (!accent || !line.includes(accent)) {
      return (
        <span key={li} className="block">
          {line}
        </span>
      );
    }
    const [before, after] = line.split(accent);
    return (
      <span key={li} className="block">
        {before}
        <span className="text-gradient">{accent}</span>
        {after}
      </span>
    );
  });
};

const HeroSlider = () => {
  const { heroSlides } = useContent('home');
  const slides = heroSlides?.items || [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);
  const total = slides.length;

  const go = useCallback(
    (dir) => setIndex((i) => (i + dir + total) % total),
    [total]
  );
  const goTo = useCallback((i) => setIndex(i), []);

  useEffect(() => {
    if (paused || total <= 1) return undefined;
    timer.current = setTimeout(() => setIndex((i) => (i + 1) % total), AUTOPLAY_MS);
    return () => clearTimeout(timer.current);
  }, [index, paused, total]);

  if (total === 0) return null;
  const slide = slides[index];

  return (
    <section
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background slides (crossfade) */}
      <AnimatePresence mode="sync">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1 }, scale: { duration: 6, ease: 'linear' } }}
          className="absolute inset-0"
        >
          <img
            src={`https://img.youtube.com/vi/${slide.videoId}/maxresdefault.jpg`}
            alt=""
            aria-hidden
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://img.youtube.com/vi/${slide.videoId}/hqdefault.jpg`;
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
      {/* Brand color glow */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(900px circle at 12% 90%, rgba(91,140,255,0.22), transparent 55%), radial-gradient(760px circle at 85% 15%, rgba(167,139,250,0.18), transparent 55%)',
        }}
      />
      <div className="absolute inset-0 bg-grid opacity-25" />

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-soft" />
                {slide.eyebrow}
              </span>
              <h1 className="mb-6 text-4xl font-black leading-[1.12] tracking-tight text-white md:text-6xl lg:text-7xl">
                {renderTitle(slide.title, slide.accent)}
              </h1>
              <p className="mb-10 max-w-xl whitespace-pre-line text-base leading-relaxed text-white/70 md:text-lg">
                {slide.desc}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/contact"
                  className="bg-brand-gradient inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-bold text-white shadow-lg shadow-accent-primary/40 transition-all hover:scale-[1.03] active:scale-95"
                >
                  {heroSlides.ctaPrimary} <ArrowRight size={18} />
                </Link>
                <Link
                  to="/portfolio"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-base font-bold text-white transition-all hover:bg-white/10"
                >
                  <Play size={16} className="fill-white" /> {heroSlides.ctaSecondary}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls — bottom bar */}
      <div className="absolute bottom-10 left-0 right-0 z-20 mx-auto flex max-w-7xl items-center gap-6 px-6">
        <span className="text-sm font-bold tabular-nums text-white">
          {String(index + 1).padStart(2, '0')}
          <span className="text-white/40"> / {String(total).padStart(2, '0')}</span>
        </span>
        <div className="relative h-[2px] flex-1 max-w-xs overflow-hidden rounded-full bg-white/20">
          <motion.div
            key={index + (paused ? '-p' : '')}
            className="absolute inset-y-0 left-0 bg-accent-soft"
            initial={{ width: '0%' }}
            animate={{ width: paused ? '0%' : '100%' }}
            transition={{ duration: paused ? 0 : AUTOPLAY_MS / 1000, ease: 'linear' }}
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => go(-1)}
            aria-label="이전 슬라이드"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="다음 슬라이드"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:hidden">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`슬라이드 ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-accent-soft' : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
