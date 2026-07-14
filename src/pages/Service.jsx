import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import { PageHero, SectionHeader, FinalCta, ServiceCards, ProcessTimeline, fadeInUp, stagger } from '../components/common/ui.jsx';
import { useContent } from '../context/ContentContext.jsx';

const FailureSection = () => {
  const { failure } = useContent('service');
  return (
    <section className="border-b border-border-primary bg-bg-primary py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow={failure.eyebrow} headline={failure.headline} accent="실패" subhead={failure.subhead} />
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {failure.reasons.map((reason, i) => (
            <motion.div
              key={i} variants={fadeInUp} whileHover={{ y: -6 }}
              className="rounded-3xl border border-border-primary bg-bg-secondary p-10"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                <AlertCircle size={24} />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-text-primary">{reason.title}</h3>
              <p className="leading-relaxed text-text-secondary">{reason.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const PrinciplesSection = () => {
  const { principles } = useContent('service');
  return (
    <section className="relative overflow-hidden border-b border-border-primary bg-bg-secondary py-28">
      <div className="bg-grid absolute inset-0 opacity-30" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow={principles.eyebrow} headline={principles.headline} accent="경영철칙" subhead={principles.subhead} />
        <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
          {principles.items.map((item, i) => (
            <motion.div
              key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="group flex gap-6"
            >
              <span className="text-gradient text-5xl font-black leading-none md:text-6xl">{item.num}</span>
              <div>
                <h3 className="mb-3 text-2xl font-bold text-text-primary group-hover:text-accent-primary">{item.title}</h3>
                <p className="leading-relaxed text-text-secondary">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessSection = () => {
  const { process } = useContent('service');
  return (
    <section className="border-b border-border-primary bg-bg-primary py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader eyebrow={process.eyebrow} headline={process.headline} accent="프로세스" center />
        <ProcessTimeline steps={process.steps} />
      </div>
    </section>
  );
};

const Service = () => {
  const { seo, hero } = useContent('service');
  return (
    <div className="bg-bg-primary">
      <SEO title={seo.title} description={seo.description} path="/service" />
      <PageHero
        eyebrow={hero.eyebrow}
        title={`${hero.headlineLine1}\n${hero.headlineLine2}`}
        accent={hero.headlineLine2}
        subhead={hero.subhead}
      />
      <ServiceCards />
      <FailureSection />
      <PrinciplesSection />
      <ProcessSection />
      <FinalCta />
    </div>
  );
};

export default Service;
