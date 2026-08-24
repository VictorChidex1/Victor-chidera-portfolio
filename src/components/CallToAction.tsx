import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const SolidText = ({ text }: { text: string }) => (
  <span className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-display font-bold text-slate-300 uppercase tracking-tighter px-4 lg:px-8">
    {text}
  </span>
);

const OutlineText = ({ text }: { text: string }) => (
  <span 
    className="text-[12vw] md:text-[8vw] lg:text-[7vw] font-display font-bold uppercase tracking-tighter px-4 lg:px-8 text-transparent"
    style={{ WebkitTextStroke: "2px #cbd5e1" }}
  >
    {text}
  </span>
);

const CallToAction = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white py-32 md:py-48 flex items-center justify-center border-t border-slate-100 z-10">
      
      {/* Infinite Marquee Background Layers */}
      <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden pointer-events-none select-none -space-y-4 md:-space-y-8 lg:-space-y-12">
        
        {/* Row 1: Moves Left, Solid */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex whitespace-nowrap will-change-transform"
        >
          <div className="flex">
            <SolidText text="HAVE AN IDEA? • LET'S BUILD IT •" />
            <SolidText text="HAVE AN IDEA? • LET'S BUILD IT •" />
          </div>
          <div className="flex">
            <SolidText text="HAVE AN IDEA? • LET'S BUILD IT •" />
            <SolidText text="HAVE AN IDEA? • LET'S BUILD IT •" />
          </div>
        </motion.div>

        {/* Row 2: Moves Right, Outlined */}
        <motion.div
          animate={{ x: ["-50%", "0%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 45 }}
          className="flex whitespace-nowrap will-change-transform"
        >
          <div className="flex">
            <OutlineText text="EXTRAORDINARY • TOGETHER •" />
            <OutlineText text="EXTRAORDINARY • TOGETHER •" />
          </div>
          <div className="flex">
            <OutlineText text="EXTRAORDINARY • TOGETHER •" />
            <OutlineText text="EXTRAORDINARY • TOGETHER •" />
          </div>
        </motion.div>
        
        {/* Row 3: Moves Left, Solid (Faint) */}
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
          className="flex whitespace-nowrap will-change-transform hidden md:flex"
        >
          <div className="flex">
            <SolidText text="AVAILABLE FOR HIRE • LET'S TALK •" />
            <SolidText text="AVAILABLE FOR HIRE • LET'S TALK •" />
          </div>
          <div className="flex">
            <SolidText text="AVAILABLE FOR HIRE • LET'S TALK •" />
            <SolidText text="AVAILABLE FOR HIRE • LET'S TALK •" />
          </div>
        </motion.div>

      </div>

      {/* Floating Center CTA */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <Link
          to="/contact"
          className="group relative inline-flex items-center gap-4 bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 text-white pl-8 pr-3 py-3 rounded-full font-bold text-xl shadow-2xl hover:bg-[#020617] transition-all duration-500 hover:scale-[1.02] hover:shadow-brand-accent/20 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] overflow-hidden"
        >
          {/* Subtle button glare effect */}
          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out" />
          
          <span className="relative z-10 mr-2">Start a Project</span>
          <div className="relative z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-brand-accent transition-colors duration-300">
            <ArrowRight size={20} className="text-white group-hover:translate-x-0.5 transition-transform duration-300" />
          </div>
        </Link>
        <p className="mt-8 text-slate-500 font-medium tracking-wide bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-sm border border-slate-100">
          Currently available for new projects
        </p>
      </div>
    </section>
  );
};

export default CallToAction;
