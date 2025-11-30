import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../utils/animations";

const About = () => {
  return (
    <section
      id="about"
      className="py-32 bg-brand-dark relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Text Content */}
          <div>
            <motion.h2
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight"
            >
              PASSIONATE <br /> <span className="text-slate-500">CREATOR</span>
            </motion.h2>

            <motion.div
              variants={fadeInUp}
              className="space-y-6 text-lg text-slate-400 leading-relaxed"
            >
              <p>
                Hello! I'm Victor Chidera, a Frontend Developer with a deep
                passion for building pixel-perfect, accessible, and performant
                web experiences.
              </p>
              <p>
                My journey started with a curiosity for how things work on the
                web, which has evolved into a career of crafting interfaces that
                not only look good but feel amazing to use.
              </p>
              <p>
                When I'm not coding, I'm exploring the latest design trends,
                optimizing application performance, or contributing to
                open-source projects.
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 gap-8 mt-12"
            >
              <div>
                <h4 className="text-5xl font-bold text-white mb-2">2+</h4>
                <p className="text-brand-orange font-medium uppercase tracking-wider text-sm">
                  Years Exp.
                </p>
              </div>
              <div>
                <h4 className="text-5xl font-bold text-white mb-2">10+</h4>
                <p className="text-brand-orange font-medium uppercase tracking-wider text-sm">
                  Projects
                </p>
              </div>
            </motion.div>
          </div>

          {/* Decorative Visual */}
          <motion.div variants={fadeInUp} className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange/20 to-transparent rounded-3xl transform rotate-6 border border-white/5 blur-sm"></div>
            <div className="relative bg-slate-900/50 p-10 rounded-3xl border border-slate-800 backdrop-blur-sm">
              <code className="text-sm md:text-base text-slate-300 font-mono">
                <span className="text-purple-400">const</span>{" "}
                <span className="text-yellow-200">developer</span> = {"{"}{" "}
                <br />
                &nbsp;&nbsp;name:{" "}
                <span className="text-green-400">'Victor Chidera'</span>,<br />
                &nbsp;&nbsp;role:{" "}
                <span className="text-green-400">'Frontend Dev'</span>,<br />
                &nbsp;&nbsp;skills: [
                <span className="text-green-400">'React'</span>,{" "}
                <span className="text-green-400">'Next.js'</span>,{" "}
                <span className="text-green-400">'Tailwind'</span>],
                <br />
                &nbsp;&nbsp;hardWorker:{" "}
                <span className="text-brand-orange">true</span>,<br />
                &nbsp;&nbsp;quickLearner:{" "}
                <span className="text-brand-orange">true</span>
                <br />
                {"}"};
              </code>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
