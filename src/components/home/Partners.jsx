import React from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, stagger, Accented } from '../common/ui.jsx';
import { useContent } from '../../context/ContentContext.jsx';

// Partner logo wall
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

export default Partners;
