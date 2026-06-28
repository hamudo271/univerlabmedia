import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, ArrowRight, CheckCircle2, TrendingUp, Zap, Users, ShieldCheck, Clock, MonitorPlay, Video, Share2, Smartphone, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import TextReveal from '../components/common/TextReveal';
import SEO from '../components/SEO';
import { useContent } from '../context/ContentContext.jsx';

// --- Animation Variants ---
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const scaleOnHover = {
  hover: {
    y: -10,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

// --- Components ---

const HeroSection = () => {
  const { hero } = useContent('home');
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-primary transition-colors duration-500 border-b border-black/10 dark:border-white/10">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-5 dark:opacity-20 mix-blend-overlay" />
      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-8 inline-block px-6 py-2 rounded-full border border-accent-primary/30 bg-accent-primary/5 text-accent-primary font-bold tracking-widest uppercase text-sm"
        >
          {hero.badge}
        </motion.div>
        <h1 className="text-6xl md:text-9xl font-black text-text-primary mb-8 leading-[0.9] tracking-tighter">
          <TextReveal delay={0.4}>
            {hero.headlineLine1} <br />
          </TextReveal>
          <TextReveal delay={0.6}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500">{hero.headlineLine2}</span>
          </TextReveal>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-medium mb-12 whitespace-pre-line"
        >
          {hero.subhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Link to="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-text-primary text-bg-primary rounded-full font-bold text-lg hover:bg-accent-primary hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
            {hero.ctaButton} <ArrowRight size={20} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const Marquee = () => {
  const { marquee } = useContent('home');
  const clients = marquee.clients.map((c) => c.name);
  return (
    <div className="py-8 bg-black text-white overflow-hidden border-y border-white/10">
      <motion.div
        className="flex whitespace-nowrap gap-20"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {[...clients, ...clients, ...clients].map((client, i) => (
          <span key={i} className="text-3xl font-bold text-white/30 uppercase tracking-tighter hover:text-white transition-colors cursor-default">
            {client}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const SecretsSection = () => {
  const { secrets } = useContent('home');

  return (
    <section className="py-32 bg-bg-primary border-b border-black/10 dark:border-white/10">
      <div className="container mx-auto px-6">
        <div className="mb-24">
          <motion.span
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-accent-primary font-bold tracking-widest uppercase block mb-4"
          >
            {secrets.eyebrow}
          </motion.span>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-4xl md:text-7xl font-black text-text-primary mb-8 whitespace-pre-line"
          >
            {secrets.headline}
          </motion.h2>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {secrets.items.map((secret, index) => (
            <motion.div
              key={secret.title || index}
              variants={fadeInUp}
              whileHover="hover"
              className="p-10 border border-black/10 dark:border-white/10 rounded-3xl hover:bg-bg-secondary transition-colors duration-300 bg-bg-primary"
            >
              <motion.div variants={scaleOnHover} className="w-full h-full">
                <div className="w-12 h-12 bg-accent-primary/10 text-accent-primary rounded-full flex items-center justify-center mb-8">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-4">{secret.title}</h3>
                <p className="text-text-secondary leading-relaxed">{secret.desc}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const GrowthStepsSection = () => {
  const { growth } = useContent('home');

  return (
    <section className="py-32 bg-bg-secondary border-b border-black/10 dark:border-white/10">
      <div className="container mx-auto px-6">
        <div className="mb-24">
          <motion.span
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-accent-primary font-bold tracking-widest uppercase block mb-4"
          >
            {growth.eyebrow}
          </motion.span>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-4xl md:text-7xl font-black text-text-primary mb-8 whitespace-pre-line"
          >
            {growth.headline}
          </motion.h2>
        </div>

        <div className="space-y-8">
          {growth.steps.map((item, index) => (
            <motion.div
              key={item.step || index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
              whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
              className="group bg-bg-primary p-10 md:p-14 rounded-3xl border border-black/10 dark:border-white/10 hover:border-accent-primary transition-colors duration-300"
            >
              <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="shrink-0">
                  <span className="text-6xl font-black text-black/5 dark:text-white/5 group-hover:text-accent-primary/20 transition-colors">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">{item.title}</h3>
                  <ul className="space-y-3">
                    {item.desc.map((line, i) => (
                      <li key={i} className="flex items-start gap-3 text-text-secondary text-lg">
                        <span className="w-1.5 h-1.5 bg-accent-primary rounded-full mt-2.5 shrink-0" />
                        {line.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SafetySection = () => {
  const { safety } = useContent('home');
  return (
    <section className="py-32 bg-bg-primary border-b border-black/10 dark:border-white/10">
      <div className="container mx-auto px-6">
        <div className="mb-24 text-center">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-4xl md:text-6xl font-black text-text-primary mb-6"
          >
            {safety.headline}
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-xl text-text-secondary"
          >
            {safety.subhead}
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div variants={fadeInUp} whileHover={{ y: -10, transition: { duration: 0.3 } }} className="p-12 bg-bg-secondary rounded-3xl border border-black/10 dark:border-white/10">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-8">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-3xl font-bold text-text-primary mb-4">{safety.card1Title}</h3>
            <p className="text-text-secondary text-lg leading-relaxed whitespace-pre-line">
              {safety.card1Body}
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} whileHover={{ y: -10, transition: { duration: 0.3 } }} className="p-12 bg-bg-secondary rounded-3xl border border-black/10 dark:border-white/10">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-8">
              <Clock size={32} />
            </div>
            <h3 className="text-3xl font-bold text-text-primary mb-4">{safety.card2Title}</h3>
            <p className="text-text-secondary text-lg leading-relaxed whitespace-pre-line">
              {safety.card2Body}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const ProcessSection = () => {
  const { process } = useContent('home');

  return (
    <section className="py-32 bg-bg-secondary border-b border-black/10 dark:border-white/10">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <motion.span
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-accent-primary font-bold tracking-widest uppercase block mb-4"
          >
            {process.eyebrow}
          </motion.span>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-4xl md:text-6xl font-black text-text-primary"
          >
            {process.headline}
          </motion.h2>
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

const PricingSection = () => {
  const { pricing } = useContent('home');

  return (
    <section className="py-32 bg-bg-primary border-b border-black/10 dark:border-white/10">
      <div className="container mx-auto px-6">
        <div className="mb-24">
          <motion.span
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-accent-primary font-bold tracking-widest uppercase block mb-4"
          >
            {pricing.eyebrow}
          </motion.span>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-4xl md:text-7xl font-black text-text-primary mb-8"
          >
            {pricing.headline}
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-xl text-text-secondary"
          >
            {pricing.subhead}
          </motion.p>
        </div>

        <div className="space-y-20">
          {/* Video Editing */}
          <div>
            <motion.h3
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="text-3xl font-bold text-text-primary mb-8 border-l-4 border-accent-primary pl-4"
            >
              {pricing.videoSectionTitle}
            </motion.h3>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {pricing.videoPackages.map((pkg, i) => (
                <motion.div
                  key={pkg.title || i}
                  variants={fadeInUp}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="bg-bg-secondary p-8 rounded-3xl border border-black/10 dark:border-white/10 hover:border-accent-primary transition-colors"
                >
                  <h4 className="text-2xl font-bold text-text-primary mb-4">{pkg.title}</h4>
                  <div className="text-sm text-text-secondary mb-6 space-y-1">
                    <p>{pricing.staffLabel} {pkg.staff}</p>
                    <p>{pricing.periodLabel} {pkg.period}</p>
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
              {pricing.shortformSectionTitle}
            </motion.h3>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {pricing.shortformPackages.map((pkg, i) => (
                <motion.div
                  key={pkg.title || i}
                  variants={fadeInUp}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="bg-bg-secondary p-8 rounded-3xl border border-black/10 dark:border-white/10 hover:border-accent-primary transition-colors"
                >
                  <h4 className="text-2xl font-bold text-text-primary mb-4">{pkg.title}</h4>
                  <div className="text-sm text-text-secondary mb-6 space-y-1">
                    <p>{pricing.staffLabel} {pkg.staff}</p>
                    <p>{pricing.periodLabel} {pkg.period}</p>
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
  );
};

const FAQSection = () => {
  const { faq } = useContent('home');
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-32 bg-bg-secondary">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-20 text-center">
          <motion.span
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-accent-primary font-bold tracking-widest uppercase block mb-4"
          >
            {faq.eyebrow}
          </motion.span>
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-4xl md:text-6xl font-black text-text-primary"
          >
            {faq.headline}
          </motion.h2>
        </div>

        <div className="border-t border-black/10 dark:border-white/10">
          {faq.items.map((item, index) => (
            <motion.div
              key={item.q || index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="border-b border-black/10 dark:border-white/10 last:border-none"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full py-8 flex justify-between items-center text-left group"
              >
                <span className="text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                  {item.q}
                </span>
                <span className={`p-2 rounded-full border border-black/10 dark:border-white/10 transition-colors ${openIndex === index ? 'bg-accent-primary text-white border-accent-primary' : 'group-hover:bg-black/5 dark:group-hover:bg-white/5'}`}>
                  {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="pb-8 text-lg text-text-secondary leading-relaxed pl-4 border-l-2 border-accent-primary ml-2 whitespace-pre-line">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const { seo } = useContent('home');
  return (
    <div className="bg-bg-primary min-h-screen transition-colors duration-500">
      <SEO
        title={seo.title}
        description={seo.description}
        path="/"
      />
      <HeroSection />
      <Marquee />
      <SecretsSection />
      <GrowthStepsSection />
      <SafetySection />
      <ProcessSection />
      <PricingSection />
      <FAQSection />
    </div>
  );
};

export default Home;
