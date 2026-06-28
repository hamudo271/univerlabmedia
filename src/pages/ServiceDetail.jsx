import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Star, Zap, ShieldCheck, BarChart3 } from 'lucide-react';
import TextReveal from '../components/common/TextReveal';
import SEO from '../components/SEO';
import { useContent } from '../context/ContentContext.jsx';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};

const ServiceDetail = () => {
  const { id } = useParams();
  const { shared, services } = useContent('serviceDetail');
  const data = services.items.find((s) => s.id === id);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary text-text-primary">
        <SEO title={shared.notFoundTitle} path={`/service/${id}`} noIndex />
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">{shared.notFoundTitle}</h2>
          <Link to="/service" className="text-accent-primary hover:underline">{shared.notFoundLink}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary min-h-screen transition-colors duration-500">
      <SEO
        title={data.title}
        description={data.desc}
        path={`/service/${id}`}
        image={data.heroImage}
      />
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-black/10 dark:border-white/10">
        <div className="absolute inset-0 z-0">
          <img src={data.heroImage} alt={data.title} className="w-full h-full object-cover opacity-10 dark:opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/50 to-bg-primary" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden" animate="visible" variants={fadeInUp}
            className="max-w-4xl"
          >
            <span className="text-accent-primary font-bold tracking-widest uppercase block mb-6">{data.subtitle}</span>
            <h1 className="text-5xl md:text-8xl font-black text-text-primary mb-8 leading-tight">
              {data.title}
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed font-medium max-w-3xl">
              {data.desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-32 border-b border-black/10 dark:border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="flex-1"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-8 leading-tight">
                {data.introTitle}
              </h2>
            </motion.div>
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: 0.2 }}
              className="flex-1"
            >
              <p className="text-lg text-text-secondary leading-relaxed whitespace-pre-line">
                {data.introText}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 bg-bg-secondary">
        <div className="container mx-auto px-6">
          <div className="mb-20 text-center">
            <span className="text-accent-primary font-bold tracking-widest uppercase block mb-4">{shared.pricingEyebrow}</span>
            <h2 className="text-4xl md:text-6xl font-black text-text-primary">{shared.pricingHeadline}</h2>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {data.pricing.map((plan, index) => (
              <motion.div
                key={plan.name || index}
                variants={fadeInUp}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="bg-bg-primary p-10 rounded-3xl border border-black/10 dark:border-white/10 hover:border-accent-primary transition-colors flex flex-col"
              >
                <h3 className="text-2xl font-bold text-text-primary mb-2">{plan.name}</h3>
                <span className="text-sm text-text-secondary mb-8 block">{plan.vat}</span>

                <div className="mb-8">
                  <span className="text-3xl font-bold text-text-primary">{shared.currencySymbol}{plan.price}</span>
                  <span className="text-text-secondary"> {shared.priceUnit}</span>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-text-secondary">
                      <CheckCircle2 size={18} className="text-accent-primary shrink-0" />
                      <span>{feature.value}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className="w-full py-4 rounded-xl font-bold text-center bg-text-primary text-bg-primary hover:opacity-90 transition-opacity"
                >
                  {shared.inquiryButton}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
           <h2 className="text-4xl md:text-6xl font-black mb-8 whitespace-pre-line">{shared.ctaHeadline}</h2>
           <p className="text-xl text-white/70 mb-12">{shared.ctaSubhead}</p>
           <Link to="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-accent-primary hover:text-white transition-all duration-300">
             {shared.ctaButton} <ArrowRight size={20} />
           </Link>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
