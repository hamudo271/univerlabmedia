import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, MonitorPlay, Share2, Smartphone, CheckCircle2, ArrowRight, Plus, Minus, AlertCircle, Lightbulb } from 'lucide-react';
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

const ServiceHero = () => {
  const { hero } = useContent('service');
  return (
    <section className="relative pt-40 pb-20 overflow-hidden bg-bg-primary transition-colors duration-500 border-b border-black/10 dark:border-white/10">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 flex items-center gap-4"
          >
            <span className="h-px w-12 bg-accent-primary"></span>
            <span className="text-accent-primary font-bold tracking-widest uppercase">{hero.eyebrow}</span>
          </motion.div>

          <TextReveal>
            <h1 className="text-6xl md:text-8xl font-black text-text-primary mb-8 leading-[0.9] tracking-tighter">
              {hero.headlineLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{hero.headlineLine2}</span>
            </h1>
          </TextReveal>

          <TextReveal delay={0.2}>
            <p className="text-xl md:text-2xl text-text-secondary max-w-2xl leading-relaxed font-medium whitespace-pre-line">
              {hero.subhead}
            </p>
          </TextReveal>
        </div>
      </div>
    </section>
  );
};

const FailureAnalysisSection = () => {
  const { failure } = useContent('service');

  return (
    <section className="py-32 border-b border-black/10 dark:border-white/10">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <span className="text-accent-primary font-bold tracking-widest uppercase block mb-4">{failure.eyebrow}</span>
          <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-4">{failure.headline}</h2>
          <p className="text-xl text-text-secondary">{failure.subhead}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {failure.reasons.map((reason, index) => (
            <motion.div
              key={reason.title || index}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: index * 0.1 }}
              className="p-10 bg-bg-secondary rounded-3xl border border-black/10 dark:border-white/10"
            >
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">{reason.title}</h3>
              <p className="text-text-secondary leading-relaxed">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PrinciplesSection = () => {
  const { principles } = useContent('service');

  return (
    <section className="py-32 bg-bg-secondary border-b border-black/10 dark:border-white/10">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <span className="text-accent-primary font-bold tracking-widest uppercase block mb-4">{principles.eyebrow}</span>
          <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-4">{principles.headline}</h2>
          <p className="text-xl text-text-secondary">{principles.subhead}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {principles.items.map((item, index) => (
            <motion.div
              key={item.num || index}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="group"
            >
              <span className="text-6xl font-black text-black/5 dark:text-white/5 group-hover:text-accent-primary/20 transition-colors block mb-4">
                {item.num}
              </span>
              <h3 className="text-3xl font-bold text-text-primary mb-4 group-hover:text-accent-primary transition-colors">{item.title}</h3>
              <p className="text-lg text-text-secondary leading-relaxed">{item.desc}</p>
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
    <section className="py-32 border-b border-black/10 dark:border-white/10">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <span className="text-accent-primary font-bold tracking-widest uppercase block mb-4">{process.eyebrow}</span>
          <h2 className="text-4xl md:text-6xl font-black text-text-primary">{process.headline}</h2>
        </div>

        <div className="border-t-2 border-black dark:border-white">
          {process.steps.map((item, index) => (
            <motion.div
              key={item.step || index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group border-b border-black/10 dark:border-white/10 hover:bg-bg-primary transition-all duration-500"
            >
              <div className="py-12 flex flex-col md:flex-row md:items-center gap-8 md:gap-24 px-4 md:px-8">
                <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-black/20 to-black/0 dark:from-white/20 dark:to-white/0 group-hover:from-accent-primary group-hover:to-accent-primary/50 transition-all duration-500 w-32 shrink-0 leading-none">
                  {item.step}
                </div>
                <div className="flex-1 relative z-10">
                  <h3 className="text-2xl md:text-4xl font-black text-text-primary mb-4 group-hover:text-accent-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-lg text-text-secondary leading-relaxed font-medium group-hover:text-text-primary transition-colors duration-300">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Service = () => {
  const { seo } = useContent('service');
  return (
    <div className="bg-bg-primary min-h-screen transition-colors duration-500">
      <SEO
        title={seo.title}
        description={seo.description}
        path="/service"
      />
      <ServiceHero />
      <FailureAnalysisSection />
      <PrinciplesSection />
      <ProcessSection />
    </div>
  );
};

export default Service;
