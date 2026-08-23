import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../utils/animations";
import KineticText from "./KineticText";
const profileImage = "/assets/images/profile.webp";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-32 pb-20 px-6 relative overflow-hidden">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10"
      >
        {/* Left Column: Text */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <KineticText
            as="h1"
            delay={0.1}
            className="text-6xl md:text-8xl lg:text-9xl font-bold font-display text-brand-ink tracking-tighter leading-none"
          >
            DESIGNING
          </KineticText>
          <KineticText
            as="h1"
            delay={0.3}
            className="text-6xl md:text-8xl lg:text-9xl font-bold font-display text-brand-muted tracking-tighter leading-none"
          >
            DIGITAL
          </KineticText>
          <KineticText
            as="h1"
            delay={0.5}
            className="text-6xl md:text-8xl lg:text-9xl font-bold font-display text-brand-ink tracking-tighter leading-none mb-8"
          >
            DREAMS
          </KineticText>

          <motion.p
            variants={fadeInUp}
            className="text-brand-muted text-lg md:text-xl max-w-lg leading-relaxed"
          >
            I help ambitious brands and individuals build high-performance
            digital experiences that leave a lasting impression.
          </motion.p>
        </div>

        {/* Right Column: Image & Buttons */}
        <motion.div
          variants={fadeInUp}
          className="lg:col-span-5 flex flex-col items-center lg:items-start gap-10"
        >
          <div className="relative">
            <img
              src={profileImage}
              alt="Victor Chidera"
              className="w-72 h-72 md:w-96 md:h-96 rounded-3xl border border-brand-line object-cover rotate-3 hover:rotate-0 transition-transform duration-500"
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link
              to="/works"
              className="magnetic group flex items-center gap-2 bg-brand-ink text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-neutral-800 transition-all duration-300"
            >
              View Work
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="magnetic flex items-center gap-2 border border-brand-ink text-brand-ink px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-ink hover:text-white transition-colors"
            >
              Contact Me
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
