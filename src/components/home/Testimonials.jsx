import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { SectionHeader } from '../common/ui.jsx';
import { useContent } from '../../context/ContentContext.jsx';

// Testimonials carousel (paged, 3 per page)
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
                    <img src={t.brand} alt="" className="max-h-6 w-auto object-contain opacity-70" />
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

export default Testimonials;
