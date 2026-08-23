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

  // Center the active state and hold it for a duration
  // For index 0, it stays at scale 1 from scroll 0 to 0.1, then shrinks as the next card arrives.
  const scale = useTransform(
    scrollProgress,
    [index * 0.2 - 0.1, index * 0.2, index * 0.2 + 0.1, index * 0.2 + 0.2],
    [0.85, 1, 1, 0.85]
  );

  const opacity = useTransform(
    scrollProgress,
    [index * 0.2 - 0.1, index * 0.2, index * 0.2 + 0.1, index * 0.2 + 0.2],
    [0, 1, 1, 0.2]
  );

  // Next card slides up exactly as the previous one shrinks
  const y = useTransform(
    scrollProgress,
    [index * 0.2 - 0.1, index * 0.2],
    [100, 0]
  );

  const rotateX = useTransform(
    scrollProgress,
    [index * 0.2 - 0.1, index * 0.2, index * 0.2 + 0.1, index * 0.2 + 0.2],
    [10, 0, 0, 10]
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
      className={`sticky top-[15vh] h-[70vh] md:h-[75vh] flex items-center justify-center mx-auto max-w-5xl px-4 md:px-6 perspective-1000`}
    >
      {/* Glassmorphic Main Card */}
      <div className="relative w-full h-full bg-white/5 backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] border border-white/10 p-6 md:p-14 overflow-hidden shadow-2xl shadow-black/80 group">
        
        {/* Massive Background Number */}
        <div className="absolute -bottom-16 -right-10 text-[200px] md:text-[300px] font-bold font-display text-white/[0.03] leading-none select-none pointer-events-none group-hover:scale-105 transition-transform duration-700">
          {String(step.id).padStart(2, "0")}
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Header Section */}
          <div>
            {/* Phase Label */}
            <div className="inline-flex items-center mb-6">
              <span className="text-brand-accent font-bold tracking-widest uppercase mr-4 text-xs md:text-sm">
                {step.phase}
              </span>
              <div className="h-px w-16 bg-brand-accent/50" />
            </div>

            {/* Title */}
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-8 leading-tight tracking-tighter">
              {step.title}
            </h3>
          </div>

          {/* Description */}
          <div className="max-w-3xl relative">
            <div className="absolute -left-4 md:-left-6 top-0 bottom-0 w-[2px] bg-brand-accent/30" />
            <p className="text-white/70 text-base md:text-xl leading-relaxed font-light pl-4 md:pl-6">
              {step.description}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/10">
            <div className="flex items-center space-x-3 text-sm font-mono text-white/50">
              <span className="text-white">{String(step.id).padStart(2, "0")}</span>
              <span className="text-white/20">/</span>
              <span>{String(steps.length).padStart(2, "0")}</span>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center space-x-2">
              {steps.map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    dotIndex === index ? "bg-brand-accent w-4" : "bg-white/20"
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
      className="relative bg-[#0d1117] min-h-[300vh]"
    >
      {/* Background layer that doesn't affect normal flow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Animated Glowing Orb for Glass Refraction */}
        <div className="sticky top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-brand-accent/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('/assets/images/grid-pattern.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay z-0"></div>

      {/* Section Header - Normal Flow */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-32 pb-16 md:pt-40 md:pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold font-display text-white mb-2 md:mb-4 text-center tracking-tighter leading-[0.9]"
        >
          THE <br className="hidden md:block" />
          <span className="text-white/20">PROCESS</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-white/60 text-base md:text-xl max-w-xl mx-auto text-center font-light px-4"
        >
          My systematic, tailored approach to engineering high-performance digital solutions.
        </motion.p>
      </div>

      {/* Process Cards Container */}
      <div className="relative z-10 pb-[20vh]">
        {steps.map((step, index) => (
          <ProcessCard
            key={step.id}
            step={step}
            index={index}
            scrollProgress={scrollYProgress}
          />
        ))}
      </div>

      {/* Scroll Progress Bar (Glowing Track) */}
      <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-50 hidden xl:flex">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-1 h-64 bg-white/10 rounded-full overflow-hidden relative shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <motion.div
              className="absolute top-0 left-0 w-full bg-brand-accent shadow-[0_0_15px_var(--color-brand-accent)]"
              style={{
                scaleY: scrollYProgress,
                transformOrigin: "top",
                bottom: 0
              }}
            />
          </div>
          <motion.span
            className="text-xs font-bold tracking-widest uppercase text-white/50"
            style={{
              opacity: useTransform(scrollYProgress, [0, 1], [0.3, 1]),
            }}
          >
            Scroll
          </motion.span>
        </div>
      </div>
    </section>
  );
};

export default Process;
