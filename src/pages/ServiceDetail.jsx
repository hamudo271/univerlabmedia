import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import { SectionHeader, FinalCta, fadeInUp, stagger } from '../components/common/ui.jsx';
import { useContent } from '../context/ContentContext.jsx';

const ServiceDetail = () => {
  const { id } = useParams();
  const { shared, services } = useContent('serviceDetail');
  const data = services.items.find((s) => s.id === id);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary text-text-primary">
        <SEO title={shared.notFoundTitle} path={`/service/${id}`} noIndex />
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold">{shared.notFoundTitle}</h2>
          <Link to="/service" className="text-accent-primary hover:underline">{shared.notFoundLink}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary">
      <SEO title={data.title} description={data.desc} path={`/service/${id}`} image={data.heroImage} />

      {/* Hero with background image */}
      <section className="relative overflow-hidden border-b border-border-primary pb-24 pt-44">
        <img src={data.heroImage} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-bg-primary/40" />
        <div className="glow-accent absolute inset-0" style={{ '--gx': '15%', '--gy': '10%' }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="mb-6 flex items-center gap-3">
            <span className="h-px w-10 bg-accent-primary" />
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-accent-primary">{data.subtitle}</span>
          </motion.div>
          <motion.h1
            initial="hidden" animate="visible" variants={fadeInUp}
            className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-text-primary md:text-7xl"
          >
            {data.title}
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" variants={fadeInUp} transition={{ delay: 0.15 }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl"
          >
            {data.desc}
          </motion.p>
        </div>
      </section>

      {/* Intro split */}
      <section className="border-b border-border-primary bg-bg-primary py-28">
        <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 md:grid-cols-2 md:gap-16">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-3xl font-black leading-snug text-text-primary md:text-4xl"
          >
            {data.introTitle}
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.15 }}
            className="whitespace-pre-line text-lg leading-relaxed text-text-secondary"
          >
            {data.introText}
          </motion.p>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative overflow-hidden bg-bg-secondary py-28">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <SectionHeader eyebrow={shared.pricingEyebrow} headline={shared.pricingHeadline} center />
          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {data.pricing.map((plan, i) => (
              <motion.div
                key={i} variants={fadeInUp} whileHover={{ y: -8 }}
                className="flex flex-col rounded-3xl border border-border-primary bg-bg-elevated p-10 transition-colors hover:border-accent-primary"
              >
                <h3 className="mb-1 text-2xl font-bold text-text-primary">{plan.name}</h3>
                <span className="mb-6 block text-sm text-text-secondary">{plan.vat}</span>
                <div className="mb-8">
                  <span className="text-gradient text-4xl font-black">{shared.currencySymbol}{plan.price}</span>
                  <span className="text-text-secondary"> {shared.priceUnit}</span>
                </div>
                <ul className="mb-10 flex-grow space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-text-secondary">
                      <CheckCircle2 size={18} className="shrink-0 text-accent-primary" />
                      <span>{feature.value}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="bg-brand-gradient w-full rounded-xl py-4 text-center font-bold text-white transition-transform hover:scale-[1.02]"
                >
                  {shared.inquiryButton}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <FinalCta />
    </div>
  );
};

export default ServiceDetail;
