import { Link } from "react-router-dom";
import { Mail, ArrowUpRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative h-[560px] sm:h-[640px] md:h-[850px] bg-[#0d1117] text-white overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      {/* 
        This fixed container creates the signature "Curtain Reveal" parallax effect.
        As the user scrolls past the top of the footer, this fixed content is 
        un-clipped from the bottom up.
      */}
      <div className="fixed bottom-0 left-0 w-full h-[560px] sm:h-[640px] md:h-[850px] bg-[#0d1117]">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full h-full flex flex-col justify-between pt-10 sm:pt-16 md:pt-32 pb-5 md:pb-8 px-6 max-w-7xl mx-auto relative z-10">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8 md:gap-12">
            {/* Left: CTA */}
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display text-white mb-6 md:mb-8 leading-[1.15] md:leading-[1.1] tracking-tight">
                Let's build something <br className="hidden md:block" />
                <span className="text-brand-accent">extraordinary</span>.
              </h2>
              <a
                href="mailto:victor@victorchidera.com"
                className="group flex items-center gap-3 md:gap-4 text-lg md:text-2xl font-medium w-fit"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-accent group-hover:border-brand-accent transition-all duration-300">
                  <Mail className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <span className="group-hover:text-brand-accent transition-colors duration-300 border-b border-transparent group-hover:border-brand-accent pb-1">
                  victor@victorchidera.com
                </span>
              </a>
            </div>

            {/* Right: Links & Socials */}
            <div className="flex gap-12 sm:gap-16 md:gap-24 lg:mr-12">
              <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
                <span className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-widest mb-1">
                  Navigation
                </span>
                <Link
                  to="/"
                  className="text-base md:text-lg text-white/80 hover:text-brand-accent transition-colors flex items-center gap-1 group"
                >
                  Home{" "}
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </Link>
                <Link
                  to="/works"
                  className="text-base md:text-lg text-white/80 hover:text-brand-accent transition-colors flex items-center gap-1 group"
                >
                  Work{" "}
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </Link>
                <Link
                  to="/services"
                  className="text-base md:text-lg text-white/80 hover:text-brand-accent transition-colors flex items-center gap-1 group"
                >
                  Services{" "}
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </Link>
                <Link
                  to="/testimonials"
                  className="text-base md:text-lg text-white/80 hover:text-brand-accent transition-colors flex items-center gap-1 group"
                >
                  Testimonials{" "}
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </Link>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
                <span className="text-white/40 text-xs md:text-sm font-bold uppercase tracking-widest mb-1">
                  Socials
                </span>
                <a
                  href="https://github.com/VictorChidex1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base md:text-lg text-white/80 hover:text-brand-accent transition-colors flex items-center gap-1 group"
                >
                  GitHub{" "}
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </a>
                <a
                  href="https://www.linkedin.com/in/victor-chidera-255526b9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base md:text-lg text-white/80 hover:text-brand-accent transition-colors flex items-center gap-1 group"
                >
                  LinkedIn{" "}
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </a>
                <a
                  href="https://x.com/Iamkingchidex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base md:text-lg text-white/80 hover:text-brand-accent transition-colors flex items-center gap-1 group"
                >
                  Twitter{" "}
                  <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 translate-y-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section: Massive Typography */}
          <div className="w-full flex flex-col items-center justify-end mt-4 sm:mt-8 md:mt-auto pt-2 md:pt-0">
            {/* The Massive Name */}
            <h1 className="text-[11.5vw] md:text-[14vw] font-display font-bold text-white leading-[0.85] md:leading-[0.8] tracking-tighter whitespace-nowrap text-center opacity-90 select-none my-1 md:my-0">
              VICTOR CHIDERA
            </h1>

            {/* Copyright row */}
            <div className="w-full flex flex-col md:flex-row justify-between items-center pt-4 mt-4 sm:pt-6 sm:mt-6 md:pt-8 md:mt-8 border-t border-white/10 text-white/40 text-xs md:text-sm gap-3 md:gap-0">
              <p>© {currentYear} Victor Chidera. All rights reserved.</p>
              <p>Designed & Engineered with 🤍</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
