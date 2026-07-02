import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock } from 'lucide-react';
import { fadeInUp } from '../common/ui.jsx';
import { useContent } from '../../context/ContentContext.jsx';

// Safety (2 안심제도)
const Safety = () => {
  const { safety } = useContent('home');
  const cards = [
    { title: safety.card1Title, body: safety.card1Body, icon: ShieldCheck, tint: 'text-blue-400 bg-blue-500/10' },
    { title: safety.card2Title, body: safety.card2Body, icon: Clock, tint: 'text-purple-400 bg-purple-500/10' },
  ];
  return (
    <section className="relative overflow-hidden border-y border-border-primary bg-bg-secondary py-28">
      <div className="bg-grid absolute inset-0 opacity-30" />
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="text-3xl font-black tracking-tight text-text-primary md:text-5xl"
          >
            <span className="text-gradient">2가지 안심제도</span>를 운영합니다
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
            className="mt-5 text-lg text-text-secondary"
          >
            {safety.subhead}
          </motion.p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((c, i) => (
            <motion.div
              key={i}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="rounded-3xl border border-border-primary bg-bg-elevated p-10"
            >
              <div className={`mb-7 flex h-14 w-14 items-center justify-center rounded-2xl ${c.tint}`}>
                <c.icon size={28} />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-text-primary">{c.title}</h3>
              <p className="whitespace-pre-line leading-relaxed text-text-secondary">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Safety;
