import { useState, useEffect  } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Work", path: "/works" },
    { name: "Services", path: "/services" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md py-4 border-b border-brand-line"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <img src="/assets/images/main-victor-chidera-logo.webp" alt="Victor Chidera" className="h-8 md:h-10 w-auto object-contain" />
          <span className="text-xl md:text-2xl font-bold font-display text-brand-ink tracking-tighter">
            Victor<span className="text-brand-accent">Chidera</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-medium text-brand-muted hover:text-brand-ink transition-colors uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
          <a
            href="/victor-chidera-full-stack-cv.pdf"
            download
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-ink rounded-full text-white text-sm font-medium hover:bg-neutral-800 transition-all duration-300"
          >
            <Download size={16} />
            HIRE ME
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-brand-ink hover:text-brand-muted transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-brand-line overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-brand-muted hover:text-brand-ink transition-colors uppercase tracking-widest"
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="/victor-chidera-full-stack-cv.pdf"
                download
                className="flex items-center gap-2 px-5 py-3 bg-brand-ink rounded-full text-white text-lg font-medium hover:bg-neutral-800 transition-all duration-300 w-fit"
              >
                <Download size={20} />
                HIRE ME
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
