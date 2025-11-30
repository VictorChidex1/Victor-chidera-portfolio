import React from "react";
import {
  Code,
  Palette,
  Smartphone,
  Globe,
  Database,
  Layout,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../utils/animations";

const services = [
  {
    id: 1,
    title: "Web Development",
    description:
      "Building fast, responsive, and scalable websites using modern technologies.",
    icon: <Globe size={24} />,
  },
  {
    id: 2,
    title: "UI/UX Design",
    description: "Creating intuitive and visually appealing user interfaces.",
    icon: <Palette size={24} />,
  },
  {
    id: 3,
    title: "Mobile Apps",
    description:
      "Developing cross-platform mobile applications for iOS and Android.",
    icon: <Smartphone size={24} />,
  },
  {
    id: 4,
    title: "Full Stack",
    description:
      "End-to-end development including backend API design and database management.",
    icon: <Database size={24} />,
  },
];

const Services = () => {
  return (
    <section
      id="services"
      className="py-32 bg-brand-dark border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-16"
        >
          <div className="md:w-1/3">
            <motion.h2
              variants={fadeInUp}
              className="text-5xl font-bold text-white mb-6 sticky top-32"
            >
              WHAT I <br /> <span className="text-slate-500">DO</span>
            </motion.h2>
          </div>

          <div className="md:w-2/3 flex flex-col gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                className="group p-8 bg-slate-900/30 border border-slate-800 hover:border-brand-orange/50 rounded-2xl transition-all duration-300 hover:bg-slate-900/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-800 rounded-lg text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    {service.icon}
                  </div>
                  <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-400 text-lg">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
