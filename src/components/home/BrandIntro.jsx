import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, stagger, Accented } from '../common/ui.jsx';
import { useContent } from '../../context/ContentContext.jsx';

// Brand intro (dark, grid + glow, stats)
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

export default BrandIntro;
