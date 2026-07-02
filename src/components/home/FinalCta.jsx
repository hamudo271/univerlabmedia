import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { fadeInUp } from '../common/ui.jsx';
import { useContent } from '../../context/ContentContext.jsx';

// Final CTA (dark hero band with bullet list + button)
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

export default FinalCta;
