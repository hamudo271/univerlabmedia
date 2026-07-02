import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../../context/ContentContext.jsx';

// Process (sticky intro + numbered timeline)
const Process = () => {
  const { process } = useContent('home');
  return (
    <section className="bg-bg-primary py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
        <div className="md:sticky md:top-32 md:self-start">
          <span className="mb-4 block text-sm font-bold uppercase tracking-[0.2em] text-accent-primary">
            {process.eyebrow}
          </span>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-text-primary md:text-5xl">
            고객 만족도를 최우선합니다
          </h2>
          <p className="mt-5 text-text-secondary">
            상담부터 완성까지, 유니버랩 미디어의 체계적인 7단계 작업 프로세스.
          </p>
          <Link
            to="/contact"
            className="bg-brand-gradient mt-8 inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-bold text-white shadow-lg shadow-accent-primary/30 transition-transform hover:scale-105"
          >
            상담 신청하기 <ArrowRight size={18} />
          </Link>
        </div>

        <div className="space-y-4">
          {process.steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group flex gap-5 rounded-2xl border border-border-primary bg-bg-secondary p-6 transition-colors hover:border-accent-primary"
            >
              <span className="bg-brand-gradient flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-black text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-primary">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
