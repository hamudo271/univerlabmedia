import React from 'react';
import { motion } from 'framer-motion';
import TextReveal from '../components/common/TextReveal';
import SEO from '../components/SEO';
import { useContent } from '../context/ContentContext.jsx';

const Column = () => {
  const { seo, hero, list } = useContent('column');

  return (
    <div className="pt-32 pb-20 bg-bg-primary min-h-screen transition-colors duration-500">
      <SEO
        title={seo.title}
        description={seo.description}
        path="/column"
      />
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <TextReveal>
            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-6">{hero.headline}</h1>
          </TextReveal>
          <TextReveal delay={0.2}>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              {hero.subhead}
            </p>
          </TextReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.items.map((item, i) => (
            <motion.div
              key={item.title || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/3] bg-bg-secondary rounded-2xl overflow-hidden mb-6 border border-border-primary group-hover:border-accent-primary/50 transition-colors">
                <div className="w-full h-full bg-bg-secondary group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="space-y-3">
                <span className="text-accent-primary text-sm font-bold uppercase tracking-wider">{item.badge}</span>
                <h3 className="text-2xl font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-text-secondary line-clamp-2">
                  {item.desc}
                </p>
                <div className="pt-4 flex items-center justify-between text-sm text-text-secondary/60">
                  <span>{item.date}</span>
                  <span>{list.readMore}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Column;
