import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { fadeInUp, staggerContainer } from "../utils/animations";
import InfiniteMarquee from "./InfiniteMarquee";
import Terminal from "./Terminal";
import NumberCounter from "./NumberCounter";
import about from "../data/about.json";
import { COMPANY_NAME, COMPANY_TITLE, COMPANY_TAGLINE, COMPANY_LOGO } from "../seo/site";

const About = () => {
  return (
    <section
      id="about"
      className="bg-brand-surface relative overflow-hidden flex flex-col"
    >
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
              {about.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-8 flex items-center gap-4 bg-white border border-brand-line rounded-2xl p-5"
            >
              {COMPANY_LOGO ? (
                <img
                  src={COMPANY_LOGO}
                  alt={COMPANY_NAME}
                  className="w-14 h-14 rounded-full object-cover border border-brand-line bg-white shrink-0"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-brand-ink text-white flex items-center justify-center font-display font-bold text-lg shrink-0">
                  {COMPANY_NAME.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-brand-ink font-bold text-sm uppercase tracking-wider">
                  {COMPANY_TITLE} · {COMPANY_NAME}
                </p>
                <p className="text-brand-muted text-sm mt-0.5">{COMPANY_TAGLINE}</p>
              </div>
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
              {about.stats.map((stat, i) => (
                <div key={i}>
                  <NumberCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    className="text-5xl md:text-6xl font-bold font-display text-brand-ink block mb-2"
                  />
                  <p className="text-brand-muted font-bold uppercase tracking-widest text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Decorative Visual (Dynamic Terminal) */}
          <motion.div
            variants={fadeInUp}
            className="relative mt-16 lg:mt-0 lg:col-span-7"
          >
            <Terminal />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
