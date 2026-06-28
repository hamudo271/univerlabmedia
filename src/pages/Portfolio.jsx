import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import TextReveal from '../components/common/TextReveal';
import SEO from '../components/SEO';
import { useContent } from '../context/ContentContext.jsx';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const Portfolio = () => {
  const { seo, hero, filters, projects } = useContent('portfolio');
  const [filter, setFilter] = useState('All');

  const projectItems = projects.items;
  const filteredProjects = filter === 'All' ? projectItems : projectItems.filter(p => p.category === filter);

  return (
    <div className="bg-bg-primary min-h-screen transition-colors duration-500">
      <SEO
        title={seo.title}
        description={seo.description}
        path="/portfolio"
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

      {/* Filter & Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-16">
            {filters.items.map((item) => (
              <button
                key={item.name}
                onClick={() => setFilter(item.name)}
                className={`px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                  filter === item.name
                    ? 'bg-accent-primary text-white'
                    : 'bg-bg-secondary text-text-secondary hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={project.title || index}
                  className="group relative aspect-video overflow-hidden rounded-2xl cursor-pointer"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <span className="text-accent-primary text-sm font-bold uppercase tracking-widest mb-2">{project.category}</span>
                    <h3 className="text-white text-2xl font-bold flex items-center gap-2">
                      {project.title}
                      <ArrowUpRight size={20} />
                    </h3>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
