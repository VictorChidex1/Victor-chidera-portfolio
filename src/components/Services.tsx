import {
  Palette,
  Smartphone,
  Globe,
  Database,
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
      className="py-32 bg-brand-surface border-t border-brand-line"
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
              className="text-5xl font-bold font-display text-brand-ink mb-6 sticky top-32"
            >
              WHAT I <br /> <span className="text-brand-muted">DO</span>
            </motion.h2>
          </div>

          <div className="md:w-2/3 flex flex-col gap-8">
            {services.map((service) => (
              <motion.div
                key={service.id}
                variants={fadeInUp}
                className="group p-8 bg-white border border-brand-line hover:border-brand-ink rounded-2xl transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-brand-surface rounded-lg text-brand-ink group-hover:bg-brand-ink group-hover:text-white transition-colors">
                    {service.icon}
                  </div>
                  <ArrowUpRight className="text-slate-400 group-hover:text-brand-ink transition-colors" />
                </div>

                <h3 className="text-2xl font-bold font-display text-brand-ink mb-2">
                  {service.title}
                </h3>
                <p className="text-brand-muted text-lg">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
