import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, scaleIn } from "../utils/animations";
import TiltPortrait from "./TiltPortrait";
import LiveClock from "./LiveClock";

const profileImage = "/assets/images/profile.webp";

const BentoCard = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    variants={{
      hidden: { scale: 0.95, opacity: 0, y: 20 },
      visible: { 
        scale: 1, 
        opacity: 1, 
        y: 0, 
        transition: { 
          type: "spring", stiffness: 100, damping: 20, delay 
        } 
      }
    }}
    className={`bg-white rounded-[2rem] border border-brand-line shadow-sm hover:shadow-md transition-shadow duration-500 overflow-hidden relative ${className}`}
  >
    {children}
  </motion.div>
);

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 relative bg-brand-surface">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-7xl w-full mx-auto flex flex-col gap-4 sm:gap-6 relative z-10"
      >
        
        {/* ROW 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Main Typography Card */}
          <BentoCard className="lg:col-span-8 p-8 sm:p-12 flex flex-col justify-center min-h-[40vh] lg:min-h-[500px]" delay={0.1}>
            <div className="flex flex-col gap-2">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold font-display text-brand-ink tracking-tighter leading-[0.9]">
                DESIGNING
              </h1>
              <div className="flex items-center gap-4">
                <div className="hidden sm:block w-16 h-1 bg-brand-accent mt-4"></div>
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold font-display text-brand-muted tracking-tighter leading-[0.9]">
                  DIGITAL
                </h1>
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold font-display text-brand-ink tracking-tighter leading-[0.9]">
                DREAMS
              </h1>
            </div>
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          </BentoCard>

          {/* Portrait Card */}
          <BentoCard className="lg:col-span-4 p-2 h-[400px] lg:h-[500px]" delay={0.2}>
            <TiltPortrait src={profileImage} />
          </BentoCard>
          
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
          
          {/* Action Card */}
          <BentoCard className="sm:col-span-2 lg:col-span-4 p-8 sm:p-10 flex flex-col justify-center min-h-[250px]" delay={0.3}>
            <div className="flex flex-wrap gap-4 mt-auto mb-auto">
              <Link
                to="/works"
                className="magnetic group flex items-center gap-2 bg-brand-ink text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-neutral-800 transition-all duration-300"
              >
                View Work
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="magnetic flex items-center gap-2 border border-brand-ink text-brand-ink px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-brand-ink hover:text-white transition-colors"
              >
                Contact Me
              </Link>
            </div>
          </BentoCard>

          {/* Status Card */}
          <BentoCard className="lg:col-span-4 p-8 flex flex-col justify-between min-h-[200px] sm:min-h-[250px]" delay={0.4}>
            <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-4">Availability</h3>
            <div className="mt-auto">
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                </span>
                <span className="text-xl font-bold font-display text-brand-ink">Available</span>
              </div>
              <p className="text-brand-muted font-medium">For new opportunities</p>
            </div>
          </BentoCard>

          {/* Live Clock Card */}
          <BentoCard className="lg:col-span-4 p-8 min-h-[200px] sm:min-h-[250px]" delay={0.5}>
            <LiveClock />
          </BentoCard>
          
        </div>
        
      </motion.div>
    </section>
  );
};

export default Hero;
