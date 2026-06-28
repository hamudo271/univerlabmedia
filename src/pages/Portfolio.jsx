import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play } from 'lucide-react';
import SEO from '../components/SEO';
import { PageHero, VideoLightbox } from '../components/common/ui.jsx';
import { useContent } from '../context/ContentContext.jsx';

const ALL = '전체';

const Portfolio = () => {
  const { seo, hero, filters, projects } = useContent('portfolio');
  const [filter, setFilter] = useState(ALL);
  const [video, setVideo] = useState(null);

  const items = projects.items;
  const filtered = filter === ALL ? items : items.filter((p) => p.category === filter);

  return (
    <div className="bg-bg-primary">
      <SEO title={seo.title} description={seo.description} path="/portfolio" />

      <PageHero eyebrow={hero.eyebrow} title={hero.headline} accent="불여일견" subhead={hero.subhead} />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          {/* Filters */}
          <div className="mb-12 flex flex-wrap gap-3">
            {filters.items.map((item) => (
              <button
                key={item.name}
                onClick={() => setFilter(item.name)}
                className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all ${
                  filter === item.name
                    ? 'bg-brand-gradient text-white shadow-lg shadow-accent-primary/30'
                    : 'border border-border-primary bg-bg-secondary text-text-secondary hover:border-accent-primary hover:text-text-primary'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.button
                  layout
                  key={project.videoId}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setVideo(project.videoId)}
                  className="group relative aspect-video overflow-hidden rounded-2xl border border-border-primary bg-black text-left"
                >
                  <img
                    src={`https://img.youtube.com/vi/${project.videoId}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                    {project.category}
                  </span>
                  <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-primary">
                    <Play size={22} className="ml-0.5 fill-white text-white" />
                  </span>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <VideoLightbox videoId={video} onClose={() => setVideo(null)} />
    </div>
  );
};

export default Portfolio;
