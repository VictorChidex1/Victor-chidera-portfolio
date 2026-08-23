import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

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

const ProcessCard = ({ step, index, scrollProgress }: any) => {
  const cardRef = useRef(null);

  // Calculate scale based on scroll position
  const scale = useTransform(
    scrollProgress,
    [index * 0.2, index * 0.2 + 0.1, index * 0.2 + 0.3],
    [0.92, 1, 0.92]
  );

  // Opacity based on scroll position
  const opacity = useTransform(
    scrollProgress,
    [index * 0.2 - 0.1, index * 0.2, index * 0.2 + 0.4, index * 0.2 + 0.5],
    [0.4, 1, 1, 0.4]
  );

  // Y position for stacking effect
  const y = useTransform(
    scrollProgress,
    [index * 0.2, index * 0.2 + 0.3],
    [50, 0]
  );

  // Rotation for subtle 3D effect
  const rotateX = useTransform(
    scrollProgress,
    [index * 0.2, index * 0.2 + 0.3],
    [5, 0]
  );

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        opacity,
        y,
        rotateX,
      }}
      className={`sticky top-1/4 h-[60vh] flex items-center justify-center mx-auto max-w-4xl px-6`}
    >
      {/* Main Card */}
      <div className="relative w-full h-full bg-white rounded-2xl border border-brand-line p-8 md:p-12 overflow-hidden shadow-sm group">
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Header Section */}
          <div>
            {/* Phase Label */}
            <div className="inline-flex items-center mb-6">
              <span className="text-brand-muted text-sm tracking-widest uppercase mr-4">
                {step.phase}
              </span>
              <div className="h-px w-12 bg-brand-line" />
            </div>

            {/* Title */}
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-brand-ink mb-6 leading-tight tracking-tight">
              {step.title}
            </h3>
          </div>

          {/* Description */}
          <div className="max-w-2xl relative">
            <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-brand-line" />
            <p className="text-brand-muted text-base md:text-lg leading-relaxed font-light pl-6">
              {step.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-brand-line">
            <div className="flex items-center space-x-2 text-xs font-mono text-brand-muted">
              <span>{String(step.id).padStart(2, "0")}</span>
              <span>/</span>
              <span>{String(steps.length).padStart(2, "0")}</span>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center space-x-1">
              {steps.map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    dotIndex === index ? "bg-brand-ink" : "bg-brand-line"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Process = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={containerRef}
      className="relative bg-brand-surface min-h-[300vh]"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex flex-col items-center justify-center bg-brand-surface/90 backdrop-blur-xl py-16 h-[30vh] border-b border-brand-line">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-bold font-display text-brand-ink mb-4 text-center"
        >
          Process
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-brand-muted text-lg md:text-xl max-w-xl mx-auto text-center font-light"
        >
          My systematic, tailored process.
        </motion.p>
      </div>

      {/* Process Cards Container */}
      <div className="relative">
        {steps.map((step, index) => (
          <ProcessCard
            key={step.id}
            step={step}
            index={index}
            scrollProgress={scrollYProgress}
          />
        ))}
      </div>

      {/* Scroll Progress Bar */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-1 h-40 bg-brand-line rounded-full overflow-hidden">
            <motion.div
              className="w-full bg-brand-ink rounded-full"
              style={{
                scaleY: scrollYProgress,
                transformOrigin: "top",
              }}
            />
          </div>
          <motion.span
            className="text-xs font-semibold text-brand-muted whitespace-nowrap"
            style={{
              opacity: useTransform(scrollYProgress, [0, 1], [0.5, 1]),
            }}
          >
            Scroll Progress
          </motion.span>
        </div>
      </div>
    </section>
  );
};

export default Process;
