import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeInUp, staggerContainer } from "../utils/animations";

const steps = [
  {
    id: 1,
    phase: "Phase I",
    title: "Request & Vision",
    description:
      "Like all great adventures do, we must first set the scene. You are able to do this smoothly and efficiently via the project request. The information you provide really helps me to understand whether I am the right person for your creative vision. If I believe that my skillset is certain to do the project justice, I will arrange a video call to meet you (and/or your team). I strive to get back to every project request within 48 hours.",
  },
  {
    id: 2,
    phase: "Phase II",
    title: "Meeting & Scope",
    description:
      "We dive deeper into the details. Through a collaborative meeting, we define the project scope, features, and technical requirements to ensure we're on the same page. We'll discuss your goals, target audience, and the specific problems we're solving to create a solid foundation for the project.",
  },
  {
    id: 3,
    phase: "Phase III",
    title: "Proposal & Timeline",
    description:
      "I present a detailed proposal outlining the strategy, deliverables, and a clear timeline. This document serves as our roadmap, ensuring transparency and alignment on expectations. Once approved, we're ready to kick off the development process.",
  },
  {
    id: 4,
    phase: "Phase IV",
    title: "Design & Construction",
    description:
      "This is where the magic happens. I craft pixel-perfect designs and write clean, efficient code, keeping you updated at every milestone. You'll see your vision come to life through regular updates and demos, allowing for feedback and refinement along the way.",
  },
  {
    id: 5,
    phase: "Phase V",
    title: "Launch & Handover",
    description:
      "After rigorous testing and refinement, your project goes live. I provide necessary training and documentation to ensure you're fully equipped to manage your new digital asset. We'll ensure a smooth transition and I'll be available for any post-launch support you might need.",
  },
];

const Card = ({ step, index, progress, range, targetScale }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-screen flex items-start justify-center sticky top-28 pt-10"
    >
      <motion.div
        style={{
          scale,
          top: `calc(${index * 25}px)`,
        }}
        className="relative flex flex-col w-[1000px] h-[500px] bg-slate-900 rounded-3xl border border-slate-800 p-12 origin-top overflow-hidden shadow-2xl"
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(10,minmax(0,1fr))] opacity-20 pointer-events-none">
          {[...Array(200)].map((_, i) => (
            <div key={i} className="border-[0.5px] border-slate-700" />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-purple-400 text-sm font-medium mb-8">
              ✨ {step.phase}
            </div>
            <h3 className="text-5xl font-bold text-white mb-6">{step.title}</h3>
          </div>

          <div className="max-w-2xl">
            <p className="text-slate-400 text-lg leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Process = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={container} className="relative bg-brand-dark">
      <div className="max-w-7xl mx-auto px-6 py-32">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-4 text-center"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-6xl md:text-8xl font-bold text-white mb-6"
          >
            Process
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-slate-400 text-xl max-w-xl mx-auto"
          >
            My systematic, tailored process.
          </motion.p>
        </motion.div>

        <div className="mt-0">
          {steps.map((step, index) => {
            const targetScale = 1 - (steps.length - index) * 0.05;
            return (
              <Card
                key={step.id}
                index={index}
                step={step}
                progress={scrollYProgress}
                range={[index * 0.25, 1]}
                targetScale={targetScale}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Process;
