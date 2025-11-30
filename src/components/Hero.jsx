import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, textReveal } from "../utils/animations";
import profilePic from "../assets/images/profile.png";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Gradient Blob */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10"
      >
        {/* Left Column: Text */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="overflow-hidden">
            <motion.h1
              variants={textReveal}
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter leading-none"
            >
              DESIGNING
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              variants={textReveal}
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-slate-500 tracking-tighter leading-none"
            >
              DIGITAL
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              variants={textReveal}
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter leading-none mb-8"
            >
              DREAMS
            </motion.h1>
          </div>

          <motion.p
            variants={fadeInUp}
            className="text-slate-400 text-lg md:text-xl max-w-lg leading-relaxed"
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
            {/* Decorative element behind image */}
            <div className="absolute -inset-4 bg-brand-orange/20 rounded-3xl blur-xl -z-10"></div>
            <img
              src={profilePic}
              alt="Victor Chidera"
              className="w-72 h-72 md:w-96 md:h-96 rounded-3xl border-2 border-slate-700/50 object-cover shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
            />
          </div>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Link
              to="/works"
              className="group flex items-center gap-2 bg-white text-brand-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-orange hover:text-white transition-all duration-300"
            >
              View Work
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="flex items-center gap-2 border border-slate-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:border-brand-orange hover:text-brand-orange transition-colors"
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
