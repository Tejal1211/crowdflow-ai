// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  const navLinks = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#about', label: 'About' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur shadow-sm border-b border-gray-100' : 'bg-transparent'
    }`} role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-gray-900" aria-label="CrowdFlow AI home">
            <div className="w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            CrowdFlow AI
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 flex-1">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded">
                {l.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <Link to="/login" className="btn-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">Login</Link>
            <Link to="/signup" className="btn-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">Get Started</Link>
          </div>

          {/* Mobile toggle */}
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="md:hidden ml-auto p-2 rounded-xl hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white border-b border-gray-100 px-4 pb-4 space-y-2"
            id="mobile-menu"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            {navLinks.map(l => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                className="block py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                role="menuitem">
                {l.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2" role="menuitem">Login</Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="btn-primary text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2" role="menuitem">Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
