import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/ContentContext.jsx';

const Footer = () => {
  const { footer } = useContent('global');
  const {
    brand,
    tagline,
    ctaButton,
    addressLabel,
    address,
    contactLabel,
    phone,
    email,
    infoLabel,
    businessName,
    businessNumber,
    copyright,
    termsLink,
    termsPath,
    privacyLink,
    privacyPath,
  } = footer;

  return (
    <footer className="bg-bg-secondary text-text-secondary py-20 border-t border-border-primary transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-4 tracking-tight">{brand}</h2>
            <p className="text-sm max-w-md leading-relaxed whitespace-pre-line">
              {tagline}
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <Link
              to="/contact"
              className="px-8 py-3 bg-white text-black font-bold text-sm tracking-wide hover:bg-gray-200 transition-colors uppercase"
            >
              {ctaButton}
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs border-t border-border-primary pt-8">
          <div className="space-y-2">
            <strong className="text-text-primary block uppercase tracking-wider mb-2">{addressLabel}</strong>
            <p>{address}</p>
          </div>
          <div className="space-y-2">
            <strong className="text-text-primary block uppercase tracking-wider mb-2">{contactLabel}</strong>
            <p>{phone}</p>
            <p>{email}</p>
          </div>
          <div className="space-y-2">
            <strong className="text-text-primary block uppercase tracking-wider mb-2">{infoLabel}</strong>
            <p>{businessName}</p>
            <p>{businessNumber}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/30">
          <p>{copyright}</p>
          <div className="flex gap-6">
            <Link to={termsPath} className="hover:text-white transition-colors">{termsLink}</Link>
            <Link to={privacyPath} className="hover:text-white transition-colors">{privacyLink}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
