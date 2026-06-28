import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Company from './pages/Company';
import Service from './pages/Service';
import ServiceDetail from './pages/ServiceDetail';
import Portfolio from './pages/Portfolio';
import Column from './pages/Column';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import SmoothScroll from './components/common/SmoothScroll';
import AdminApp from './admin/AdminApp.jsx';

function PublicSite() {
  return (
    <SmoothScroll>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/company" element={<Company />} />
          <Route path="/service" element={<Service />} />
          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/column" element={<Column />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </SmoothScroll>
  );
}

function App() {
  return (
    <Routes>
      {/* Admin app mounts at /admin and uses its own layout (no SmoothScroll / Header / Footer). */}
      <Route path="/admin/*" element={<AdminApp />} />
      {/* Everything else is the public site. */}
      <Route path="/*" element={<PublicSite />} />
    </Routes>
  );
}

export default App;
