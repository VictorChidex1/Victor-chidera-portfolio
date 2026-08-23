import { Zap, Shield, Smartphone, Search, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../utils/animations";
import MagneticBenefitCard from "./MagneticBenefitCard";

const benefits = [
  {
    id: 1,
    title: "Lightning Fast",
    description: "Optimized performance for instant load times and smooth interactions.",
    icon: <Zap size={32} />,
    position: "top-0 left-0",
    delay: 0.1
  },
  {
    id: 2,
    title: "Pixel Perfect",
    description: "Meticulous attention to detail ensuring flawless design implementation.",
    icon: <Heart size={32} />,
    position: "top-[5%] right-0",
    delay: 0.3
  },
  {
    id: 3,
    title: "Responsive",
    description: "Seamless experiences across all devices, from mobile to desktop.",
    icon: <Smartphone size={32} />,
    position: "top-[40%] left-0",
    delay: 0.5
  },
  {
    id: 4,
    title: "SEO Ready",
    description: "Built with best practices to help your site rank higher in search results.",
    icon: <Search size={32} />,
    position: "top-[45%] right-0",
    delay: 0.2
  },
  {
    id: 5,
    title: "Clean Code",
    description: "Maintainable, scalable, and robust codebases that are easy to extend.",
    icon: <Shield size={32} />,
    position: "bottom-[10%] left-[2%]",
    delay: 0.6
  },
  {
    id: 6,
    title: "On Time",
    description: "Reliable delivery and clear communication throughout the project.",
    icon: <Clock size={32} />,
    position: "bottom-[5%] right-[2%]",
    delay: 0.4
  },
];

const Benefits = () => {
  return (
    <section className="py-20 lg:py-0 bg-[#0d1117] relative overflow-hidden min-h-screen lg:min-h-[1100px] flex items-center justify-center">
      {/* Deep Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-brand-accent/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('/assets/images/grid-pattern.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full h-full flex flex-col lg:block lg:h-[900px]">
        
        {/* Central Title: Static at top for mobile, dead center for desktop */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 text-center z-0 mb-16 lg:mb-0 pointer-events-none w-full lg:w-auto"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-[7rem] font-bold font-display text-white mb-6 tracking-tighter leading-[0.9]"
          >
            WHY <br /> <span className="text-white/20">CHOOSE ME</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-white/50 text-lg max-w-md mx-auto"
          >
            I don't just write code; I build digital solutions that solve real
            business problems and drive growth.
          </motion.p>
        </motion.div>

        {/* The Constellation */}
        <div className="relative w-full h-full flex flex-col gap-6 items-center lg:block z-10">
          {benefits.map((benefit) => (
            <MagneticBenefitCard
              key={benefit.id}
              title={benefit.title}
              description={benefit.description}
              icon={benefit.icon}
              delay={benefit.delay}
              // Absolute positioning applied only on large screens, stack on mobile
              className={`relative lg:absolute ${benefit.position}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Benefits;
