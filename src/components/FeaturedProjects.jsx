import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { projects } from "../pages/Works";
import { fadeInUp, staggerContainer } from "../utils/animations";

const FeaturedProjects = () => {
  const featured = projects.slice(0, 3);

  return (
    <section className="py-32 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
        >
          <div>
            <motion.h2
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-white mb-6"
            >
              SELECTED <br /> <span className="text-slate-500">WORKS</span>
            </motion.h2>
          </div>

          <motion.div variants={fadeInUp}>
            <Link
              to="/works"
              className="group flex items-center gap-2 text-white border-b border-white pb-1 hover:text-brand-orange hover:border-brand-orange transition-all duration-300"
            >
              View All Projects
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 gap-24">
          {featured.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Image Column */}
              <div
                className={`lg:col-span-7 ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <div className="relative overflow-hidden rounded-2xl aspect-[16/10] bg-slate-800">
                  <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-all duration-500 z-10" />
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Content Column */}
              <div
                className={`lg:col-span-5 ${
                  index % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <span className="text-brand-orange text-sm font-bold uppercase tracking-widest mb-4 block">
                  {project.category}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-3 mb-8">
                  {project.tech.map((t, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-slate-800/50 text-slate-300 text-sm rounded-full border border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white font-bold hover:text-brand-orange transition-colors text-lg group/link"
                >
                  Visit Website{" "}
                  <ArrowRight
                    size={20}
                    className="ml-2 group-hover/link:translate-x-1 transition-transform"
                  />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
