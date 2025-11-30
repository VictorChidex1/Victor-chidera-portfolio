import React from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark pt-24 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start mb-20 gap-12">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Let's build something{" "}
              <span className="text-brand-orange">extraordinary</span> together.
            </h2>
          </div>

          <div className="flex flex-col gap-8">
            <div className="flex gap-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Github size={24} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Twitter size={24} />
              </a>
              <a
                href="mailto:donchid.online@gmail.com"
                className="text-slate-400 hover:text-brand-orange transition-colors duration-300 transform hover:-translate-y-1"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>

            <div className="flex flex-col gap-2 text-slate-400 text-sm">
              <Link
                to="/"
                className="hover:text-brand-orange transition-colors"
              >
                Home
              </Link>
              <Link
                to="/works"
                className="hover:text-brand-orange transition-colors"
              >
                Work
              </Link>
              <Link
                to="/services"
                className="hover:text-brand-orange transition-colors"
              >
                Services
              </Link>
              <Link
                to="/testimonials"
                className="hover:text-brand-orange transition-colors"
              >
                Testimonials
              </Link>
              <Link
                to="/contact"
                className="hover:text-brand-orange transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800 text-slate-500 text-sm">
          <p>© {currentYear} Victor Chidera. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed & Built with ❤️</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
