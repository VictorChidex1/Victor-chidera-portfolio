import React, { useState } from "react";
import {
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  ChevronRight,
  User,
} from "lucide-react";

const Navigation = ({ isMenuOpen, setIsMenuOpen }) => {
  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Works", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
  ];

  return (
    // "bg-brand-dark" comes from your tailwind.config.js
    <nav className="fixed top-0 w-full bg-brand-dark/95 backdrop-blur-md border-b border-slate-800 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with your brand orange */}
          <div className="flex-shrink-0 cursor-pointer">
            <span className="text-2xl font-bold text-white">
              Dev<span className="text-brand-orange">Portfolio</span>.
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-brand-light hover:text-brand-orange px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-brand-light hover:text-white p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-brand-dark border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-brand-light hover:text-brand-orange block px-3 py-2 rounded-md text-base font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => (
  // Using "bg-brand-dark" for the main background
  <section className="min-h-screen flex items-center justify-center pt-16 bg-brand-dark">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse md:flex-row items-center gap-12">
      {/* Text Side */}
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-brand-orange font-semibold tracking-wide uppercase mb-2">
          Front-End Developer
        </h2>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Building Digital <br />
          <span className="text-slate-400">Experiences.</span>
        </h1>
        <p className="text-lg text-brand-light mb-8 max-w-lg mx-auto md:mx-0">
          I craft accessible, pixel-perfect, and performant web experiences
          using the FoodFlow color palette.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <button className="px-8 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-lg transition-colors duration-300 flex items-center justify-center gap-2">
            View My Work <ChevronRight size={20} />
          </button>
          <button className="px-8 py-3 border border-slate-600 hover:border-brand-orange text-brand-light hover:text-brand-orange font-bold rounded-lg transition-colors duration-300">
            Contact Me
          </button>
        </div>

        <div className="mt-12 flex gap-6 justify-center md:justify-start">
          <a
            href="#"
            className="text-slate-400 hover:text-brand-orange transition-colors"
          >
            <Github size={24} />
          </a>
          <a
            href="#"
            className="text-slate-400 hover:text-brand-orange transition-colors"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="#"
            className="text-slate-400 hover:text-brand-orange transition-colors"
          >
            <Mail size={24} />
          </a>
        </div>
      </div>

      {/* Image/Visual Side */}
      <div className="flex-1 relative">
        <div className="w-72 h-72 md:w-96 md:h-96 bg-gradient-to-tr from-brand-orange to-purple-600 rounded-full blur-3xl opacity-20 absolute top-0 right-0 animate-pulse"></div>
        <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto bg-slate-800 rounded-2xl rotate-3 border border-slate-700 overflow-hidden shadow-2xl flex items-center justify-center">
          <User size={64} className="text-slate-600" />
        </div>
      </div>
    </div>
  </section>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark text-slate-200 font-sans">
      <Navigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main>
        <Hero />
      </main>
    </div>
  );
}
