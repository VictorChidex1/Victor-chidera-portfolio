import { Link } from "react-router-dom";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-transparent pt-24 pb-12 border-t border-slate-800 relative z-20">
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
                href="https://github.com/VictorChidex1"
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic text-slate-400 hover:text-white transition-colors inline-block"
              >
                <Github size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/victor-chidera-255526b9"
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic text-slate-400 hover:text-white transition-colors inline-block"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://x.com/Iamkingchidex"
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic text-slate-400 hover:text-white transition-colors inline-block"
              >
                <Twitter size={24} />
              </a>
              <a
                href="mailto:donchid.online@gmail.com"
                className="magnetic text-slate-400 hover:text-brand-orange transition-colors duration-300 transform hover:-translate-y-1 inline-block"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>

            <div className="flex flex-col gap-2 text-slate-400 text-sm">
              <Link
                to="/"
                className="magnetic hover:text-brand-orange transition-colors inline-block"
              >
                Home
              </Link>
              <Link
                to="/works"
                className="magnetic hover:text-brand-orange transition-colors inline-block"
              >
                Work
              </Link>
              <Link
                to="/services"
                className="magnetic hover:text-brand-orange transition-colors inline-block"
              >
                Services
              </Link>
              <Link
                to="/testimonials"
                className="magnetic hover:text-brand-orange transition-colors inline-block"
              >
                Testimonials
              </Link>
              <Link
                to="/contact"
                className="magnetic hover:text-brand-orange transition-colors inline-block"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800 text-slate-500 text-sm">
          <p>© {currentYear} Victor Chidera. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Designed & Built with 🤍</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
