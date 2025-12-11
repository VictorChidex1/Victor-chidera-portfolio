import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
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
                Hello! I'm Victor Chidera, a Full-Stack Product Engineer with a
                deep passion for building pixel-perfect, accessible, and
                performant web experiences. I specialize in the React and
                Firebase ecosystem.
              </p>
              <p>
                Expert in taking applications from concept to production (0 to
                1), leveraging Serverless architecture to build scalable,
                secure, and high-performance products and applications.
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

            <motion.div variants={fadeInUp} className="mt-8">
              <a
                href="/victor-chidera-full-stack-cv.pdf"
                download
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white font-medium rounded-full hover:bg-brand-orange/90 transition-all shadow-lg hover:shadow-brand-orange/20"
              >
                <Download size={20} />
                Download CV
              </a>
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
                <span className="text-green-400">'Fullstack Dev'</span>,<br />
                &nbsp;&nbsp;skills: [
                <span className="text-green-400">'React'</span>,{" "}
                <span className="text-green-400">'Firebase'</span>,{" "}
                <span className="text-green-400">'Tailwind'</span>],
                <br />
                &nbsp;&nbsp;backend: [
                <span className="text-green-400">'Firebase Auth'</span>,{" "}
                <span className="text-green-400">'Firestore'</span>,
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-green-400">'Security Rules'</span>,{" "}
                <span className="text-green-400">'Cloud Functions'</span>],
                <br />
                &nbsp;&nbsp;tools: [
                <span className="text-green-400">'Git'</span>,{" "}
                <span className="text-green-400">'GitHub'</span>,{" "}
                <span className="text-green-400">'Vercel'</span>,{" "}
                <span className="text-green-400">'REST API'</span>],
                <br />
                &nbsp;&nbsp;competencies: [
                <span className="text-green-400">'AI Integration'</span>,{" "}
                <span className="text-green-400">'SaaS Arch'</span>,
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-green-400">'API Security'</span>],
                <br />
                &nbsp;&nbsp;hardWorker:{" "}
                <span className="text-brand-orange">true</span>,<br />
                &nbsp;&nbsp;quickLearner:{" "}
                <span className="text-brand-orange">true</span>,
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
