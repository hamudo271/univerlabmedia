import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { SectionHeader } from './ui.jsx';
import { useContent } from '../../context/ContentContext.jsx';

/**
 * Shared FAQ accordion used by the Home page and the Contact page.
 * Content comes from `home.faq`; `className` styles the outer <section> so each
 * page keeps its own background/spacing.
 */
const FaqAccordion = ({ className = '' }) => {
  const { faq } = useContent('home');
  const [open, setOpen] = useState(null);
  return (
    <section className={className}>
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

export default FaqAccordion;
