import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { PageHero, FinalCta, fadeInUp, stagger } from '../components/common/ui.jsx';
import { useContent } from '../context/ContentContext.jsx';

const PackageCard = ({ pkg, sectionLabels, featured }) => (
  <motion.div
    variants={fadeInUp} whileHover={{ y: -8 }}
    className={`group relative flex flex-col overflow-hidden rounded-3xl p-8 transition-colors ${
      featured
        ? 'bg-[#0b1020] text-white shadow-2xl shadow-accent-primary/20 ring-1 ring-accent-primary/40'
        : 'border border-border-primary bg-bg-secondary hover:border-accent-primary'
    }`}
  >
    {featured ? (
      <>
        {/* 대표 패키지 — 브랜드 글로우 + BEST 배지 */}
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, var(--accent-primary), var(--accent-secondary) 60%, transparent 75%)' }}
        />
        <span className="bg-brand-gradient absolute right-6 top-6 rounded-full px-3 py-1 text-[11px] font-black tracking-wide text-white">
          BEST
        </span>
      </>
    ) : (
      <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-accent-primary transition-transform duration-300 group-hover:scale-x-100" />
    )}
    <h4 className={`relative mb-4 pr-14 text-2xl font-bold ${featured ? 'text-white' : 'text-text-primary'}`}>
      {pkg.title}
    </h4>
    <div className={`relative mb-6 space-y-1 text-sm ${featured ? 'text-white/60' : 'text-text-secondary'}`}>
      <p>{sectionLabels.staffLabel} {pkg.staff}</p>
      <p>{sectionLabels.periodLabel} {pkg.period}</p>
    </div>
    <ul className={`relative space-y-2.5 border-t pt-6 ${featured ? 'border-white/10' : 'border-border-primary'}`}>
      {pkg.features.map((feat, j) => (
        <li
          key={j}
          className={`flex items-center gap-2 text-sm ${featured ? 'text-white/80' : 'text-text-secondary'}`}
        >
          <CheckCircle2 size={16} className={`shrink-0 ${featured ? 'text-accent-soft' : 'text-accent-primary'}`} />
          {feat.value}
        </li>
      ))}
    </ul>
    <Link
      to="/contact"
      className={`relative mt-auto inline-flex items-center justify-center gap-1.5 rounded-full text-sm font-bold transition-all ${
        featured
          ? 'bg-brand-gradient mt-8 px-6 py-3.5 text-white shadow-lg shadow-accent-primary/30 hover:scale-[1.03]'
          : 'mt-8 border border-border-primary bg-bg-primary px-6 py-3.5 text-text-primary hover:border-accent-primary hover:text-accent-primary'
      }`}
    >
      상담 신청하기 <ArrowRight size={15} />
    </Link>
  </motion.div>
);

const PackageGrid = ({ title, sectionLabels, packages }) => (
  <div>
    <motion.h3
      initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
      className="mb-8 border-l-4 border-accent-primary pl-4 text-2xl font-black text-text-primary md:text-3xl"
    >
      {title}
    </motion.h3>
    <motion.div
      variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
      className="grid grid-cols-1 items-start gap-6 md:grid-cols-3"
    >
      {packages.map((pkg, i) => (
        <PackageCard key={i} pkg={pkg} sectionLabels={sectionLabels} featured={i === 0} />
      ))}
    </motion.div>
  </div>
);

const Pricing = () => {
  const { seo, hero, videoSection, shortformSection } = useContent('pricing');
  const labels = { staffLabel: videoSection.staffLabel, periodLabel: videoSection.periodLabel };

  return (
    <div className="bg-bg-primary">
      <SEO title={seo.title} description={seo.description} path="/pricing" />

      <PageHero eyebrow={hero.eyebrow} title={hero.headline} accent="올인원 패키지" subhead={hero.subhead} />

      <section className="py-16 md:py-28">
        <div className="mx-auto max-w-7xl space-y-14 px-6 md:space-y-20">
          <PackageGrid title={videoSection.title} sectionLabels={labels} packages={videoSection.packages} />
          <PackageGrid title={shortformSection.title} sectionLabels={labels} packages={shortformSection.packages} />
        </div>
      </section>

      <FinalCta />
    </div>
  );
};

export default Pricing;
