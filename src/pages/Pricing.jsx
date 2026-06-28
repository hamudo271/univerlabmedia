import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const Pricing = () => {
  const { seo, hero, videoSection, shortformSection } = useContent('pricing');

  return (
    <div className="bg-bg-primary min-h-screen transition-colors duration-500">
      <SEO
        title={seo.title}
        description={seo.description}
        path="/pricing"
      />
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-black/10 dark:border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden" animate="visible" variants={fadeInUp}
            className="max-w-4xl"
          >
            <span className="text-accent-primary font-bold tracking-widest uppercase block mb-6">{hero.eyebrow}</span>
            <h1 className="text-5xl md:text-8xl font-black text-text-primary mb-8 leading-tight whitespace-pre-line">
              {hero.headline}
            </h1>
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed font-medium max-w-3xl">
              {hero.subhead}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="space-y-20">
            {/* Video Editing */}
            <div>
              <motion.h3
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="text-3xl font-bold text-text-primary mb-8 border-l-4 border-accent-primary pl-4"
              >
                {videoSection.title}
              </motion.h3>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {videoSection.packages.map((pkg, i) => (
                  <motion.div
                    key={pkg.title || i}
                    variants={fadeInUp}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    className="bg-bg-secondary p-8 rounded-3xl border border-black/10 dark:border-white/10 hover:border-accent-primary transition-colors"
                  >
                    <h4 className="text-2xl font-bold text-text-primary mb-4">{pkg.title}</h4>
                    <div className="text-sm text-text-secondary mb-6 space-y-1">
                      <p>{videoSection.staffLabel} {pkg.staff}</p>
                      <p>{videoSection.periodLabel} {pkg.period}</p>
                    </div>
                    <ul className="space-y-2">
                      {pkg.features.map((feat, j) => (
                        <li key={j} className="flex items-center gap-2 text-text-secondary text-sm">
                          <CheckCircle2 size={16} className="text-accent-primary" />
                          {feat.value}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Shortform */}
            <div>
              <motion.h3
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                className="text-3xl font-bold text-text-primary mb-8 border-l-4 border-accent-primary pl-4"
              >
                {shortformSection.title}
              </motion.h3>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {shortformSection.packages.map((pkg, i) => (
                  <motion.div
                    key={pkg.title || i}
                    variants={fadeInUp}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    className="bg-bg-secondary p-8 rounded-3xl border border-black/10 dark:border-white/10 hover:border-accent-primary transition-colors"
                  >
                    <h4 className="text-2xl font-bold text-text-primary mb-4">{pkg.title}</h4>
                    <div className="text-sm text-text-secondary mb-6 space-y-1">
                      <p>{videoSection.staffLabel} {pkg.staff}</p>
                      <p>{videoSection.periodLabel} {pkg.period}</p>
                    </div>
                    <ul className="space-y-2">
                      {pkg.features.map((feat, j) => (
                        <li key={j} className="flex items-center gap-2 text-text-secondary text-sm">
                          <CheckCircle2 size={16} className="text-accent-primary" />
                          {feat.value}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
