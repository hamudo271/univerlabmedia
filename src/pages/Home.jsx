import React, { useState } from 'react';
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
import ColumnHighlights from '../components/home/ColumnHighlights.jsx';
import FinalCta from '../components/home/FinalCta.jsx';
import FaqAccordion from '../components/common/FaqAccordion.jsx';
import { VideoLightbox } from '../components/common/ui.jsx';
import { useContent } from '../context/ContentContext.jsx';

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
      <ColumnHighlights />
      <FaqAccordion className="bg-bg-primary py-28" />
      <FinalCta />
      <VideoLightbox videoId={video} onClose={() => setVideo(null)} />
      <ScarcityBar />
    </div>
  );
};

export default Home;
