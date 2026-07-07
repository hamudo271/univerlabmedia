import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SEO from '../components/SEO';
import { PageHero, CTABand, fadeInUp, stagger } from '../components/common/ui.jsx';
import { useContent } from '../context/ContentContext.jsx';

const Column = () => {
  const { seo, hero, list } = useContent('column');

  return (
    <div className="bg-bg-primary">
      <SEO title={seo.title} description={seo.description} path="/column" />

      <PageHero eyebrow={hero.eyebrow} title={hero.headline} accent="인사이트" subhead={hero.subhead} />

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {list.items.map((item, i) => (
              <motion.article
                key={i} variants={fadeInUp} whileHover={{ y: -8 }}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-border-primary bg-bg-secondary transition-colors hover:border-accent-primary"
              >
                {/* Gradient banner */}
                <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-bg-elevated">
                  <div className="bg-grid absolute inset-0 opacity-40" />
                  <div
                    className="absolute inset-0 opacity-60"
                    style={{ background: 'radial-gradient(420px circle at 30% 20%, rgba(91,140,255,0.25), transparent 60%), radial-gradient(360px circle at 80% 90%, rgba(167,139,250,0.22), transparent 60%)' }}
                  />
                  <span className="bg-brand-gradient relative z-10 rounded-full px-4 py-1.5 text-xs font-bold text-white">
                    {item.badge}
                  </span>
                  <ArrowUpRight className="absolute right-5 top-5 z-10 text-text-secondary opacity-0 transition-opacity group-hover:opacity-100" size={22} />
                </div>
                {/* Body */}
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="mb-3 text-xl font-bold leading-snug text-text-primary transition-colors group-hover:text-accent-primary">
                    {item.title}
                  </h3>
                  <p className="mb-6 line-clamp-2 leading-relaxed text-text-secondary">{item.desc}</p>
                  <div className="mt-auto flex items-center justify-between border-t border-border-primary pt-4 text-sm text-text-secondary/70">
                    <span>{item.date}</span>
                    <span className="font-semibold text-accent-primary">{list.readMore}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      <CTABand
        headline={'더 궁금한 점이\n있으신가요?'}
        subhead="유니버랩 미디어가 직접 답해드립니다. 지금 문의해보세요."
        button="문의하기"
      />
    </div>
  );
};

export default Column;
