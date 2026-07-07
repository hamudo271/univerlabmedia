import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, Users, BarChart3, Sparkles } from 'lucide-react';
import SEO from '../components/SEO';
import { PageHero, SectionHeader, FinalCta, fadeInUp, stagger } from '../components/common/ui.jsx';
import { useContent } from '../context/ContentContext.jsx';

const teamIcons = [Target, Zap, Users, BarChart3];

const Company = () => {
  const { seo, hero, whyObsessed, teamwork, team } = useContent('company');

  const valueCards = [
    { title: whyObsessed.card1Title, strong: whyObsessed.card1Strong, body: whyObsessed.card1Body },
    { title: whyObsessed.card2Title, strong: whyObsessed.card2Strong, body: whyObsessed.card2Body },
  ];

  return (
    <div className="bg-bg-primary">
      <SEO title={seo.title} description={seo.description} path="/company" />

      <PageHero eyebrow={hero.eyebrow} title={hero.headline} accent="결과" subhead={hero.subhead} />

      {/* Why obsessed — core values */}
      <section className="border-b border-border-primary bg-bg-primary py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader headline={whyObsessed.headline} accent="집착" subhead={whyObsessed.subhead} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {valueCards.map((c, i) => (
              <motion.div
                key={i}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="relative overflow-hidden rounded-3xl border border-border-primary bg-bg-secondary p-10"
              >
                <div className="bg-brand-gradient mb-7 flex h-12 w-12 items-center justify-center rounded-2xl text-white">
                  <Sparkles size={22} />
                </div>
                <h3 className="mb-4 text-2xl font-black text-text-primary">{c.title}</h3>
                <p className="text-lg leading-relaxed text-text-secondary">
                  <strong className="mb-2 block text-text-primary">{c.strong}</strong>
                  {c.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Teamwork statement */}
      <section className="relative overflow-hidden border-b border-border-primary bg-bg-secondary py-28">
        <div className="glow-accent absolute inset-0" style={{ '--gx': '80%', '--gy': '20%' }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-text-primary md:text-5xl"
          >
            {teamwork.headline}
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="mt-6 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-text-secondary"
          >
            {teamwork.subhead}
          </motion.p>
        </div>
      </section>

      {/* Team roles */}
      <section className="border-b border-border-primary bg-bg-primary py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeader eyebrow={team.eyebrow} headline={team.headline} accent="최고의 팀" />
          <motion.div
            variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {team.members.map((member, i) => {
              const Icon = teamIcons[i % teamIcons.length];
              return (
                <motion.div
                  key={i} variants={fadeInUp} whileHover={{ y: -8 }}
                  className="rounded-3xl border border-border-primary bg-bg-secondary p-8 transition-colors hover:border-accent-primary"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-primary/10 text-accent-primary">
                    <Icon size={26} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-text-primary">{member.role}</h3>
                  <p className="text-sm leading-relaxed text-text-secondary">{member.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <FinalCta />
    </div>
  );
};

export default Company;
