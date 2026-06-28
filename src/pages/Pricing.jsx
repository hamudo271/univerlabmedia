import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { PageHero, CTABand, fadeInUp, stagger } from '../components/common/ui.jsx';
import { useContent } from '../context/ContentContext.jsx';

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
      className="grid grid-cols-1 gap-6 md:grid-cols-3"
    >
      {packages.map((pkg, i) => (
        <motion.div
          key={i} variants={fadeInUp} whileHover={{ y: -8 }}
          className="group relative overflow-hidden rounded-3xl border border-border-primary bg-bg-secondary p-8 transition-colors hover:border-accent-primary"
        >
          <div className="bg-brand-gradient absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          <h4 className="mb-4 text-2xl font-bold text-text-primary">{pkg.title}</h4>
          <div className="mb-6 space-y-1 text-sm text-text-secondary">
            <p>{sectionLabels.staffLabel} {pkg.staff}</p>
            <p>{sectionLabels.periodLabel} {pkg.period}</p>
          </div>
          <ul className="space-y-2.5">
            {pkg.features.map((feat, j) => (
              <li key={j} className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle2 size={16} className="shrink-0 text-accent-primary" />
                {feat.value}
              </li>
            ))}
          </ul>
        </motion.div>
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

      <section className="py-28">
        <div className="mx-auto max-w-7xl space-y-20 px-6">
          <PackageGrid title={videoSection.title} sectionLabels={labels} packages={videoSection.packages} />
          <PackageGrid title={shortformSection.title} sectionLabels={labels} packages={shortformSection.packages} />
        </div>
      </section>

      <CTABand
        headline={'어떤 패키지가 맞을지\n고민되시나요?'}
        subhead="목표와 예산을 알려주시면, 가장 효율적인 구성을 제안해 드립니다."
        button="맞춤 견적 문의"
      />
    </div>
  );
};

export default Pricing;
