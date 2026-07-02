import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { useContent } from '../../context/ContentContext.jsx';
import { EASE_STANDARD } from '../common/ui.jsx';

/**
 * Tasteful conversion bar pinned to the bottom of the viewport.
 * Shows a soft live-viewer count + monthly remaining-slots, dismissible.
 */
const ScarcityBar = () => {
  const { scarcity } = useContent('home');
  const [visible, setVisible] = useState(false);
  const [viewers, setViewers] = useState(scarcity?.baseViewers ?? 11);

  // Reveal after a short delay (less intrusive than instant)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Gently fluctuate the viewer count for a "live" feel
  useEffect(() => {
    const base = scarcity?.baseViewers ?? 11;
    const id = setInterval(() => {
      setViewers(base + Math.floor(Math.sin(Date.now() / 4000) * 3 + 3));
    }, 4000);
    return () => clearInterval(id);
  }, [scarcity]);

  if (!scarcity) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE_STANDARD }}
          className="fixed bottom-4 left-1/2 z-40 w-[min(92%,860px)] -translate-x-1/2"
        >
          <div className="glass flex items-center gap-3 rounded-2xl border border-border-primary px-4 py-3 shadow-2xl shadow-black/30 sm:gap-5 sm:px-6">
            {/* Live viewers */}
            <div className="hidden items-center gap-2 sm:flex">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              <p className="text-xs text-text-secondary">
                {scarcity.viewingPrefix}{' '}
                <span className="font-bold text-text-primary tabular-nums">{viewers}</span>
                {scarcity.viewingSuffix}
              </p>
            </div>

            <div className="hidden h-6 w-px bg-border-primary sm:block" />

            {/* Remaining slots */}
            <div className="flex items-center gap-2">
              <p className="text-xs text-text-secondary sm:text-sm">
                {scarcity.remainingLabel}
              </p>
              <span className="rounded-lg bg-accent-primary/10 px-2.5 py-1 text-sm font-black text-accent-primary tabular-nums">
                {scarcity.remainingCount}
                {scarcity.remainingUnit}
              </span>
              <span className="hidden text-[11px] text-text-secondary/70 md:inline">
                · {scarcity.note}
              </span>
            </div>

            {/* CTA */}
            <Link
              to="/contact"
              className="ml-auto inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-text-primary px-4 py-2 text-xs font-bold text-bg-primary transition-transform hover:scale-105 sm:px-5 sm:text-sm"
            >
              {scarcity.button} <ArrowRight size={14} />
            </Link>

            <button
              onClick={() => setVisible(false)}
              aria-label="닫기"
              className="text-text-secondary/60 transition-colors hover:text-text-primary"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScarcityBar;
