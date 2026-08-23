import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { fadeInUp, staggerContainer } from "../utils/animations";
import InfiniteMarquee from "./InfiniteMarquee";
import Terminal from "./Terminal";
import NumberCounter from "./NumberCounter";

const About = () => {
  return (
    <section id="about" className="bg-brand-surface relative overflow-hidden flex flex-col">
      {/* The Infinite Marquee placed at the very top of the section */}
      <div className="w-full mt-20 mb-32 z-0">
        <InfiniteMarquee />
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-32 w-full relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Text Content */}
          <div className="lg:col-span-5">
            <motion.h2
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold font-display text-brand-ink mb-8 leading-tight tracking-tighter"
            >
              PASSIONATE <br />{" "}
              <span className="text-brand-muted">CREATOR</span>
            </motion.h2>

            <motion.div
              variants={fadeInUp}
              className="space-y-6 text-lg text-brand-muted leading-relaxed"
            >
              <p>
                Hello! I'm Victor Chidera, a Full-Stack Product Engineer with a
                deep passion for building pixel-perfect, accessible, and
                performant web experiences.
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

            <motion.div variants={fadeInUp} className="mt-10">
              <a
                href="/victor-chidera-full-stack-cv.pdf"
                download
                className="magnetic inline-flex items-center gap-2 px-8 py-4 bg-brand-ink text-white font-bold rounded-full hover:bg-brand-accent transition-colors duration-300 shadow-lg"
              >
                <Download size={20} />
                Download CV
              </a>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-2 gap-8 mt-16"
            >
              <div>
                <NumberCounter 
                  end={3} 
                  suffix="+" 
                  className="text-5xl md:text-6xl font-bold font-display text-brand-ink block mb-2" 
                />
                <p className="text-brand-muted font-bold uppercase tracking-widest text-xs">
                  Years Exp.
                </p>
              </div>
              <div>
                <NumberCounter 
                  end={10} 
                  suffix="+" 
                  className="text-5xl md:text-6xl font-bold font-display text-brand-ink block mb-2" 
                />
                <p className="text-brand-muted font-bold uppercase tracking-widest text-xs">
                  Projects
                </p>
              </div>
            </motion.div>
          </div>

          {/* Decorative Visual (Dynamic Terminal) */}
          <motion.div variants={fadeInUp} className="relative mt-16 lg:mt-0 lg:col-span-7">
            <Terminal />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
