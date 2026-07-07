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
            <img
              src="/brand/logo.png"
              alt={brand}
              className="mb-5 h-10 w-auto dark:brightness-0 dark:invert"
            />
            <p className="text-sm max-w-md leading-relaxed whitespace-pre-line">
              {tagline}
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-4">
            <Link
              to="/contact"
              className="bg-brand-gradient px-8 py-3 rounded-full text-white font-bold text-sm tracking-wide hover:scale-105 transition-transform uppercase"
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

        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary/60">
          <p>{copyright}</p>
          <div className="flex gap-6">
            <Link to={termsPath} className="hover:text-text-primary transition-colors">{termsLink}</Link>
            <Link to={privacyPath} className="hover:text-text-primary transition-colors">{privacyLink}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
