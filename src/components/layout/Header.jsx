import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../../context/ContentContext.jsx';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { header } = useContent('global');
  const { brand, nav: navItems } = header;

  // The home hero is always a dark image, so before scrolling the transparent
  // header must use white text/logo. When the menu is open the overlay behind
  // is black, so the logo + hamburger must also go white.
  const onHero = location.pathname === '/' && !scrolled;
  const light = isOpen || onHero; // white logo / bars
  const barColor = light ? 'bg-white' : 'bg-text-primary';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the menu on route change.
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Lock background scroll while the menu is open (pause Lenis too, so the
  // smooth-scroll loop doesn't keep moving the page behind the overlay).
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.lenis?.stop();
    } else {
      document.body.style.overflow = '';
      window.lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      window.lenis?.start();
    };
  }, [isOpen]);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${
          scrolled && !isOpen
            ? 'border-b border-border-primary bg-bg-primary/90 py-4 shadow-sm backdrop-blur-md'
            : 'bg-transparent py-8'
        }`}
      >
        <div className="container mx-auto flex items-center justify-between px-6">
          <Link to="/" className="z-[60] flex items-center" aria-label={brand}>
            <img
              src="/brand/logo.png"
              alt={brand}
              className={`h-9 w-auto transition-all md:h-10 ${light ? 'brightness-0 invert' : ''}`}
            />
          </Link>

          <div className="flex items-center gap-6 lg:gap-9">
            {/* Desktop / tablet horizontal nav — directly clickable. Hidden on
                mobile and while the full-screen menu is open. */}
            <nav
              className={`items-center gap-7 lg:gap-9 ${isOpen ? 'hidden' : 'hidden md:flex'}`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative text-sm font-medium uppercase tracking-wide transition-colors ${
                    onHero ? 'text-white/80 hover:text-white' : 'text-text-primary/70 hover:text-text-primary'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-2 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${
                      onHero ? 'bg-white' : 'bg-text-primary'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Animated hamburger — all viewports, morphs to an X when open */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
              className="relative z-[60] -mr-2 flex h-11 w-11 items-center justify-center"
            >
              <span className="relative block h-4 w-7">
                <span
                  className={`absolute left-0 block h-[2px] rounded-full transition-all duration-300 ease-in-out ${barColor} ${
                    isOpen ? 'top-1/2 w-7 -translate-y-1/2 rotate-45' : 'top-0 w-7'
                  }`}
                />
                <span
                  className={`absolute left-0 top-1/2 block h-[2px] -translate-y-1/2 rounded-full transition-all duration-300 ease-in-out ${barColor} ${
                    isOpen ? 'w-0 opacity-0' : 'w-5 opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[2px] rounded-full transition-all duration-300 ease-in-out ${barColor} ${
                    isOpen ? 'bottom-1/2 w-7 translate-y-1/2 -rotate-45' : 'bottom-0 w-7'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen overlay menu (all viewports). Sibling of <header> so the
          header's backdrop-blur can't become its containing block. Fades in;
          links stagger up. z-40 keeps the header bar (z-50) tappable on top. */}
      <div
        className={`fixed inset-0 z-40 h-[100dvh] overflow-y-auto bg-black transition-opacity duration-500 ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="flex min-h-full flex-col items-center justify-center gap-7 py-28 md:gap-9">
          {navItems.map((item, i) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              style={{ transitionDelay: isOpen ? `${120 + i * 60}ms` : '0ms' }}
              className={`text-3xl font-black uppercase tracking-widest text-white/80 transition-all duration-500 hover:text-white md:text-5xl ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Header;
