import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useContent } from '../../context/ContentContext.jsx';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(null); // desktop dropdown (nav path)
  const [openSub, setOpenSub] = useState(null); // mobile accordion (nav path)
  const closeTimer = useRef(null);
  const location = useLocation();
  const { header } = useContent('global');
  const { services } = useContent('serviceDetail');
  const { brand, nav: navItems } = header;

  // Service detail pages hang off the "서비스 소개" entry as a dropdown.
  const submenus = {
    '/service': services.items.map((s) => ({
      name: s.title,
      subtitle: s.subtitle,
      path: `/service/${s.id}`,
    })),
  };

  // Small close delay so the pointer can travel from the trigger to the panel
  // across the gap without the menu snapping shut.
  const openDropdown = (path) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(path);
  };
  const closeDropdown = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

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
    setOpenMenu(null);
    setOpenSub(null);
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
            {/* Desktop / tablet horizontal nav — directly clickable. The
                hamburger + overlay menu only exist below md, so the two
                navigations never show together. */}
            <nav className="hidden items-center gap-7 md:flex lg:gap-9">
              {navItems.map((item) => {
                const sub = submenus[item.path];
                const expanded = openMenu === item.path;
                return (
                  <div
                    key={item.path}
                    className="relative"
                    onMouseEnter={sub ? () => openDropdown(item.path) : undefined}
                    onMouseLeave={sub ? closeDropdown : undefined}
                  >
                    <Link
                      to={item.path}
                      onFocus={sub ? () => openDropdown(item.path) : undefined}
                      aria-haspopup={sub ? 'true' : undefined}
                      aria-expanded={sub ? expanded : undefined}
                      className={`group relative flex items-center gap-1 text-sm font-medium uppercase tracking-wide transition-colors ${
                        onHero ? 'text-white/80 hover:text-white' : 'text-text-primary/70 hover:text-text-primary'
                      }`}
                    >
                      {item.name}
                      {sub && (
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                        />
                      )}
                      <span
                        className={`absolute -bottom-2 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${
                          onHero ? 'bg-white' : 'bg-text-primary'
                        }`}
                      />
                    </Link>

                    {sub && (
                      /* Dropdown panel. pt-5 is a transparent hover bridge so the
                         pointer can cross the gap without closing the menu. */
                      <div
                        className={`absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-5 transition-all duration-200 ${
                          expanded
                            ? 'pointer-events-auto translate-y-0 opacity-100'
                            : 'pointer-events-none -translate-y-1 opacity-0'
                        }`}
                      >
                        <div className="overflow-hidden rounded-2xl border border-border-primary bg-bg-elevated p-2 shadow-2xl shadow-black/10">
                          {sub.map((s) => (
                            <Link
                              key={s.path}
                              to={s.path}
                              onClick={() => setOpenMenu(null)}
                              className="group/item block rounded-xl px-4 py-3 transition-colors hover:bg-bg-secondary"
                            >
                              <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary/70">
                                {s.subtitle}
                              </span>
                              <span className="mt-0.5 block text-sm font-bold text-text-primary transition-colors group-hover/item:text-accent-primary">
                                {s.name}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Animated hamburger — mobile only, morphs to an X when open */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
              className="relative z-[60] -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
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

      {/* Full-screen overlay menu (mobile only). Sibling of <header> so the
          header's backdrop-blur can't become its containing block. Fades in;
          links stagger up. z-40 keeps the header bar (z-50) tappable on top. */}
      <div
        className={`fixed inset-0 z-40 h-[100dvh] overflow-y-auto bg-black transition-opacity duration-500 md:hidden ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav className="flex min-h-full flex-col items-center justify-center gap-7 py-28">
          {navItems.map((item, i) => {
            const sub = submenus[item.path];
            const expanded = openSub === item.path;
            return (
              <div
                key={item.path}
                style={{ transitionDelay: isOpen ? `${120 + i * 60}ms` : '0ms' }}
                className={`flex w-full flex-col items-center transition-all duration-500 ${
                  isOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="text-3xl font-black uppercase tracking-widest text-white/80 transition-colors hover:text-white"
                  >
                    {item.name}
                  </Link>
                  {sub && (
                    <button
                      onClick={() => setOpenSub(expanded ? null : item.path)}
                      aria-label={`${item.name} 하위 메뉴`}
                      aria-expanded={expanded}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <ChevronDown
                        size={22}
                        className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>

                {sub && (
                  <div
                    className={`grid w-full overflow-hidden transition-all duration-400 ${
                      expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="min-h-0">
                      <div className="flex flex-col items-center gap-3.5 pt-5">
                        {sub.map((s) => (
                          <Link
                            key={s.path}
                            to={s.path}
                            onClick={() => setIsOpen(false)}
                            className="text-base font-bold text-white/55 transition-colors hover:text-accent-soft"
                          >
                            {s.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Header;
