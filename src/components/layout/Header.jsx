import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useContent } from '../../context/ContentContext.jsx';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { header } = useContent('global');
  const { brand, nav: navItems, themeToggleAria } = header;

  // The home hero is always a dark image, so before scrolling the transparent
  // header must use white text/logo regardless of theme. Inner-page heroes use
  // the theme background, so they follow the normal theme colors.
  const onHero = location.pathname === '/' && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-bg-primary/90 backdrop-blur-md py-4 border-b border-border-primary shadow-sm'
          : 'bg-transparent py-8'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="z-50 flex items-center transition-colors" aria-label={brand}>
          <img
            src="/brand/logo.png"
            alt={brand}
            className={`h-9 w-auto transition-all md:h-10 ${
              onHero || theme === 'dark' ? 'brightness-0 invert' : ''
            }`}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium tracking-wide uppercase relative group transition-colors ${
                onHero ? 'text-white/80 hover:text-white' : 'text-text-primary/70 hover:text-text-primary'
              }`}
            >
              {item.name}
              <span className={`absolute -bottom-2 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${onHero ? 'bg-white' : 'bg-text-primary'}`} />
            </Link>
          ))}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              onHero
                ? 'hover:bg-white/10 text-white'
                : 'hover:bg-text-primary/5 text-text-primary'
            }`}
            aria-label={themeToggleAria}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden z-50">
          <button
            onClick={toggleTheme}
            aria-label={themeToggleAria}
            className={`p-2 rounded-full transition-colors ${
              isOpen || onHero ? 'text-white' : 'text-text-primary'
            }`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            className={`${isOpen || onHero ? 'text-white' : 'text-text-primary'} transition-colors`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div className={`fixed inset-0 bg-black z-40 transition-transform duration-500 ease-in-out md:hidden ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="text-white/80 hover:text-white text-2xl font-bold tracking-widest uppercase"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
