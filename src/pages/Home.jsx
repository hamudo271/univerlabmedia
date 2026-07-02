import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import SEO from '../components/SEO';
import HeroSlider from '../components/home/HeroSlider.jsx';
import ScarcityBar from '../components/home/ScarcityBar.jsx';
import BrandIntro from '../components/home/BrandIntro.jsx';
import Cases from '../components/home/Cases.jsx';
import Partners from '../components/home/Partners.jsx';
import Testimonials from '../components/home/Testimonials.jsx';
import Growth from '../components/home/Growth.jsx';
import Safety from '../components/home/Safety.jsx';
import Process from '../components/home/Process.jsx';
import Services from '../components/home/Services.jsx';
import FinalCta from '../components/home/FinalCta.jsx';
import { SectionHeader, VideoLightbox } from '../components/common/ui.jsx';
import { useContent } from '../context/ContentContext.jsx';

// ── FAQ accordion ───────────────────────────────────────────────
const FAQ = () => {
  const { faq } = useContent('home');
  const [open, setOpen] = useState(null);
  return (
    <section className="bg-bg-primary py-28">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeader eyebrow={faq.eyebrow} headline={faq.headline} center />
        <div className="border-t border-border-primary">
          {faq.items.map((item, i) => (
            <div key={i} className="border-b border-border-primary">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="group flex w-full items-center justify-between py-6 text-left"
              >
                <span className="pr-6 text-lg font-bold text-text-primary group-hover:text-accent-primary">
                  {item.q}
                </span>
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    open === i
                      ? 'border-accent-primary bg-accent-primary text-white'
                      : 'border-border-primary text-text-secondary'
                  }`}
                >
                  {open === i ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="ml-1 whitespace-pre-line border-l-2 border-accent-primary pb-6 pl-4 leading-relaxed text-text-secondary">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Page ────────────────────────────────────────────────────────
const Home = () => {
  const { seo } = useContent('home');
  const [video, setVideo] = useState(null);

  return (
    <div className="bg-bg-primary">
      <SEO title={seo.title} description={seo.description} path="/" />
      <HeroSlider />
      <BrandIntro />
      <Cases onPlay={setVideo} />
      <Partners />
      <Testimonials />
      <Growth />
      <Safety />
      <Process />
      <Services />
      <FAQ />
      <FinalCta />
      <VideoLightbox videoId={video} onClose={() => setVideo(null)} />
      <ScarcityBar />
    </div>
  );
};

export default Home;
