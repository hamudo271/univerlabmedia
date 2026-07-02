import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { SectionHeader, EASE_STANDARD } from '../common/ui.jsx';
import { useContent } from '../../context/ContentContext.jsx';

// Stylized browser mockup used beside each growth step
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

// Growth steps (alternating image + text)
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
                  transition={{ duration: 0.7, ease: EASE_STANDARD }}
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

export default Growth;
