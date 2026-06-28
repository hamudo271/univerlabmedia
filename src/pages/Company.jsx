import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Zap, BarChart3, ArrowRight } from 'lucide-react';
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

const teamIcons = [
  <Target size={32} />,
  <Zap size={32} />,
  <Users size={32} />,
  <BarChart3 size={32} />,
];

const Company = () => {
  const { seo, hero, whyObsessed, teamwork, team, cta } = useContent('company');
  return (
    <div className="bg-bg-primary min-h-screen transition-colors duration-500">
      <SEO
        title={seo.title}
        description={seo.description}
        path="/company"
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
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed font-medium max-w-3xl whitespace-pre-line">
              {hero.subhead}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Obsessed Section */}
      <section className="py-32 border-b border-black/10 dark:border-white/10">
        <div className="container mx-auto px-6">
          <div className="mb-20">
             <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-4">{whyObsessed.headline}</h2>
             <p className="text-xl text-text-secondary">{whyObsessed.subhead}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-text-primary">{whyObsessed.card1Title}</h3>
              <p className="text-lg text-text-secondary leading-relaxed">
                <strong className="text-text-primary block mb-2">{whyObsessed.card1Strong}</strong>
                {whyObsessed.card1Body}
              </p>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-text-primary">{whyObsessed.card2Title}</h3>
              <p className="text-lg text-text-secondary leading-relaxed">
                <strong className="text-text-primary block mb-2">{whyObsessed.card2Strong}</strong>
                {whyObsessed.card2Body}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Teamwork Section */}
      <section className="py-32 bg-bg-secondary border-b border-black/10 dark:border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
             initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
             className="max-w-4xl mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-black text-text-primary mb-6">{teamwork.headline}</h2>
            <p className="text-xl text-text-secondary leading-relaxed whitespace-pre-line">
              {teamwork.subhead}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Roles Section */}
      <section className="py-32 border-b border-black/10 dark:border-white/10">
        <div className="container mx-auto px-6">
          <div className="mb-20">
            <span className="text-accent-primary font-bold tracking-widest uppercase block mb-4">{team.eyebrow}</span>
            <h2 className="text-4xl md:text-6xl font-black text-text-primary">{team.headline}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.members.map((member, index) => (
              <motion.div
                key={member.role || index}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} transition={{ delay: index * 0.1 }}
                className="p-8 border border-black/10 dark:border-white/10 rounded-2xl hover:bg-bg-secondary transition-colors"
              >
                <div className="w-12 h-12 bg-accent-primary/10 text-accent-primary rounded-xl flex items-center justify-center mb-6">
                  {teamIcons[index % teamIcons.length]}
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">{member.role}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-black text-white">
        <div className="container mx-auto px-6 text-center">
           <h2 className="text-4xl md:text-6xl font-black mb-8 whitespace-pre-line">{cta.headline}</h2>
           <p className="text-xl text-white/70 mb-12">{cta.subhead}</p>
           <Link to="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-accent-primary hover:text-white transition-all duration-300">
             {cta.button} <ArrowRight size={20} />
           </Link>
        </div>
      </section>
    </div>
  );
};

export default Company;
