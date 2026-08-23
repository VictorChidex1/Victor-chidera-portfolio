import React, { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const services = [
  {
    id: 1,
    title: "Web Development",
    description: "Building fast, responsive, and scalable websites using modern technologies. Focusing on performance, accessibility, and SEO to deliver exceptional digital experiences.",
    gradient: "from-orange-500 to-rose-500",
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    id: 2,
    title: "UI/UX Design",
    description: "Creating intuitive, accessible, and visually stunning user interfaces. Every pixel is crafted to ensure a seamless and delightful user journey.",
    gradient: "from-indigo-500 to-purple-600",
    tags: ["Figma", "Prototyping", "Design Systems", "Wireframing"],
  },
  {
    id: 3,
    title: "Mobile Apps",
    description: "Developing cross-platform mobile applications for iOS and Android. Native-like performance with fluid animations and offline capabilities.",
    gradient: "from-cyan-500 to-blue-600",
    tags: ["React Native", "Expo", "iOS", "Android"],
  },
  {
    id: 4,
    title: "Full Stack",
    description: "End-to-end development including scalable backend architecture, secure API design, and robust database management.",
    gradient: "from-emerald-500 to-teal-600",
    tags: ["Node.js", "PostgreSQL", "Firebase", "Cloudflare"],
  },
];

const Services = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);

  return (
    <section id="services" className="py-32 bg-brand-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-brand-ink leading-[0.9] tracking-tighter"
          >
            WHAT I <br /> <span className="text-brand-muted">DO</span>
          </motion.h2>
        </div>

        <div className="flex flex-col gap-4">
          {services.map((service, index) => {
            const isExpanded = hoveredIndex === index;

            return (
              <motion.div
                key={service.id}
                layout
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={() => setHoveredIndex(index)}
                className={`relative overflow-hidden cursor-pointer rounded-[2rem] md:rounded-[3rem] transition-colors duration-500 flex flex-col justify-center ${
                  isExpanded 
                    ? "bg-brand-ink min-h-[400px] md:min-h-[500px]" 
                    : "bg-white border border-brand-line hover:border-brand-ink/30 h-[100px] md:h-[120px]"
                }`}
              >
                {/* Abstract Gradient Mesh Cloud (Only visible when expanded) */}
                <div 
                  className={`absolute right-0 top-0 bottom-0 w-full md:w-1/2 pointer-events-none transition-opacity duration-1000 ${
                    isExpanded ? "opacity-30" : "opacity-0"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} blur-[80px] md:blur-[120px] scale-150 transform translate-x-1/4 translate-y-1/4 rounded-full`} />
                </div>

                <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 z-10 pointer-events-none">
                  {/* Top Header Row */}
                  <div className="flex justify-between items-center w-full">
                    <motion.h3 
                      layout="position"
                      className={`font-display font-bold transition-colors duration-500 whitespace-nowrap ${
                        isExpanded ? "text-3xl md:text-5xl lg:text-7xl text-white" : "text-2xl md:text-4xl text-brand-ink"
                      }`}
                    >
                      {service.title}
                    </motion.h3>
                    <motion.div 
                      layout="position"
                      className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 shrink-0 ${
                        isExpanded ? "bg-white text-brand-ink scale-110 shadow-2xl" : "bg-brand-surface text-brand-muted"
                      }`}
                    >
                      <ArrowUpRight size={isExpanded ? 32 : 24} className={isExpanded ? "transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" : ""} />
                    </motion.div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="flex flex-col md:flex-row justify-between items-end gap-8 mt-12"
                      >
                        <div className="max-w-2xl">
                          <p className="text-white/80 text-lg md:text-2xl leading-relaxed mb-8">
                            {service.description}
                          </p>
                          <div className="flex flex-wrap gap-2 md:gap-3">
                            {service.tags.map((tag, i) => (
                              <span 
                                key={i}
                                className="px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 text-xs md:text-sm font-medium backdrop-blur-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
