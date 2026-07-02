import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import { fadeInUp, stagger, SectionHeader } from '../common/ui.jsx';
import { useContent } from '../../context/ContentContext.jsx';

// Case showcase (YouTube grid + lightbox). `onPlay` opens the shared lightbox.
const Cases = ({ onPlay }) => {
  const { cases } = useContent('home');
  return (
    <section className="bg-bg-secondary py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeader
          eyebrow={cases.eyebrow} headline={cases.headline} accent={cases.accent} subhead={cases.subhead}
        />
        <motion.div
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {cases.items.map((c, i) => (
            <motion.button
              key={c.videoId + i} variants={fadeInUp}
              onClick={() => onPlay(c.videoId)}
              className="group relative aspect-video overflow-hidden rounded-2xl border border-border-primary bg-black text-left"
            >
              <img
                src={`https://img.youtube.com/vi/${c.videoId}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                {c.tag}
              </span>
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-primary">
                <Play size={22} className="ml-0.5 fill-white text-white" />
              </span>
            </motion.button>
          ))}
        </motion.div>
        <div className="mt-14 text-center">
          <Link
            to={cases.morePath}
            className="inline-flex items-center gap-2 rounded-full border border-border-primary bg-bg-primary px-8 py-4 font-bold text-text-primary transition-colors hover:border-accent-primary hover:text-accent-primary"
          >
            {cases.moreLabel} <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cases;
