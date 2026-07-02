import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { fadeInUp, SectionHeader } from '../common/ui.jsx';
import { useContent } from '../../context/ContentContext.jsx';

// Services (4 cards). Sourced from serviceDetail.services so cards stay in
// sync with the Service Detail pages.
const Services = () => {
  const { services } = useContent('serviceDetail');
  const items = services.items;
  return (
    <section className="border-y border-border-primary bg-bg-secondary py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow="Services" headline={'서비스를\n소개합니다'} accent="소개" center
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s) => (
            <motion.div
              key={s.id}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="group overflow-hidden rounded-3xl border border-border-primary bg-bg-elevated"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={s.heroImage} alt={s.title} loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-wide text-white/80">
                  {s.subtitle}
                </span>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-bold text-text-primary">{s.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{s.desc}</p>
                <Link
                  to={`/service/${s.id}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-accent-primary"
                >
                  자세히 보기 <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link
            to="/service"
            className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-bg-primary px-8 py-4 font-bold text-text-primary transition-colors hover:border-accent-primary hover:text-accent-primary"
          >
            서비스 더 보기 <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;
