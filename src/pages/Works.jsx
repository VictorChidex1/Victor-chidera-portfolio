import React from "react";
import { ExternalLink, Code } from "lucide-react";
import { motion } from "framer-motion";
import foodflowImg from "../assets/images/foodflow.png";
import eventflow from "../assets/images/eventflow.png";
import healthpoint from "../assets/images/healthpoint.png";

export const projects = [
  {
    id: 1,
    title: "FoodFlow",
    category: "Ecommerce & Management System",
    description:
      "A comprehensive food delivery management system optimizing restaurant workflows. Built with the same Dark Blue & Orange theme.",
    tech: ["React", "Node.js", "Tailwind"],
    // REPLACE with your real link
    link: "https://victorchidex1.github.io/food-delivery-app/",
    image: foodflowImg,
  },
  {
    id: 2,
    title: "EventFlow",
    category: "Full Stack App & Productivity",
    description:
      "Analytics dashboard for online retailers with real-time data visualization. Track sales, customer behavior, and inventory seamlessly.",
    tech: ["React", "Node.js", "Tailwind"],
    link: "https://eventflow-neon.vercel.app/#/",
    image: eventflow,
  },
  {
    id: 3,
    title: "HealthPoint",
    category: "Healthcare & Appointment System",
    description:
      "Book appointments with top specialists (cardiology, pediatrics, and more) at Healthpoint Hospital. Easily manage your health records and consultations online.",
    tech: ["React", "Node.js", "Tailwind", "TypeScript"],
    link: "https://healthpoint-hospital.vercel.app/#/",
    image: healthpoint,
  },
];

const Works = () => {
  return (
    <section className="py-24 pt-32 bg-brand-dark min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Selected Works
          </h2>
          <div className="w-20 h-1 bg-brand-orange"></div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-brand-orange/50 transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              {/* IMAGE AREA */}
              <div className="h-48 bg-slate-800 relative overflow-hidden group">
                {/* Dark Overlay that disappears on hover */}
                <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-all duration-300 z-10" />

                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  // Fallback logic if image fails to load
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />

                {/* Fallback Icon (Hidden unless image fails) */}
                <div className="absolute inset-0 flex items-center justify-center hidden bg-slate-800">
                  <Code
                    className="text-slate-600 group-hover:text-brand-orange transition-colors"
                    size={48}
                  />
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className="p-6 flex-1 flex flex-col">
                <span className="text-brand-orange text-xs font-bold uppercase tracking-wider mb-2 block">
                  {project.category}
                </span>
                <h3 className="text-xl font-bold text-white mb-3">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-brand-dark text-slate-300 text-xs rounded border border-slate-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* BUTTON */}
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-white hover:text-brand-orange font-medium transition-colors"
                >
                  View Project <ExternalLink size={16} className="ml-2" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Works;
