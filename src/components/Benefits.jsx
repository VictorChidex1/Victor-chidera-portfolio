import React from "react";
import { Zap, Shield, Smartphone, Search, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../utils/animations";

const benefits = [
  {
    id: 1,
    title: "Lightning Fast",
    description:
      "Optimized performance for instant load times and smooth interactions.",
    icon: <Zap size={32} />,
  },
  {
    id: 2,
    title: "Pixel Perfect",
    description:
      "Meticulous attention to detail ensuring flawless design implementation.",
    icon: <Heart size={32} />,
  },
  {
    id: 3,
    title: "Responsive",
    description:
      "Seamless experiences across all devices, from mobile to desktop.",
    icon: <Smartphone size={32} />,
  },
  {
    id: 4,
    title: "SEO Ready",
    description:
      "Built with best practices to help your site rank higher in search results.",
    icon: <Search size={32} />,
  },
  {
    id: 5,
    title: "Clean Code",
    description:
      "Maintainable, scalable, and robust codebases that are easy to extend.",
    icon: <Shield size={32} />,
  },
  {
    id: 6,
    title: "On Time",
    description:
      "Reliable delivery and clear communication throughout the project.",
    icon: <Clock size={32} />,
  },
];

const Benefits = () => {
  return (
    <section className="py-32 bg-brand-dark relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20 text-center md:text-left"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            WHY <br /> <span className="text-slate-500">CHOOSE ME</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-slate-400 text-lg max-w-xl"
          >
            I don't just write code; I build digital solutions that solve real
            business problems and drive growth.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-900/30 p-8 rounded-2xl border border-slate-800 hover:border-brand-orange/50 transition-all duration-300 group hover:bg-slate-900/50"
            >
              <div className="mb-6 text-brand-orange group-hover:scale-110 transition-transform duration-300 origin-left">
                {benefit.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-orange transition-colors">
                {benefit.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
