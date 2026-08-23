import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { scaleIn } from "../utils/animations";

const CallToAction = () => {
  return (
    <section className="py-32 bg-brand-surface border-t border-brand-line relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-7xl font-bold font-display text-brand-ink mb-8 tracking-tight">
            Have an idea?
          </h2>
          <p className="text-xl text-brand-muted mb-12 max-w-2xl mx-auto">
            Let's build something extraordinary together. I'm currently
            available for new projects.
          </p>

          <Link
            to="/contact"
            className="inline-flex items-center gap-3 bg-brand-ink text-white px-10 py-5 rounded-full font-bold text-xl hover:bg-neutral-800 transition-all duration-300 hover:scale-105"
          >
            Start a Project <ArrowRight size={24} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
