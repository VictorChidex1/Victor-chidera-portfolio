import { useRef  } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const steps = [
  {
    id: 1,
    phase: "Phase I",
    title: "Request & Vision",
    description:
      "Like all great adventures do, we must first set the scene. You are able to do this smoothly and efficiently via the project request. The information you provide really helps me to understand whether I am the right person for your creative vision. If I believe that my skillset is certain to do the project justice, I will arrange a video call to meet you (and/or your team). I strive to get back to every project request within 48 hours.",
    color: "from-blue-500/20 to-cyan-500/20",
    glow: "bg-blue-500/10",
  },
  {
    id: 2,
    phase: "Phase II",
    title: "Meeting & Scope",
    description:
      "We dive deeper into the details. Through a collaborative meeting, we define the project scope, features, and technical requirements to ensure we're on the same page. We'll discuss your goals, target audience, and the specific problems we're solving to create a solid foundation for the project.",
    color: "from-purple-500/20 to-pink-500/20",
    glow: "bg-purple-500/10",
  },
  {
    id: 3,
    phase: "Phase III",
    title: "Proposal & Timeline",
    description:
      "I present a detailed proposal outlining the strategy, deliverables, and a clear timeline. This document serves as our roadmap, ensuring transparency and alignment on expectations. Once approved, we're ready to kick off the development process.",
    color: "from-orange-500/20 to-red-500/20",
    glow: "bg-orange-500/10",
  },
  {
    id: 4,
    phase: "Phase IV",
    title: "Design & Construction",
    description:
      "This is where the magic happens. I craft pixel-perfect designs and write clean, efficient code, keeping you updated at every milestone. You'll see your vision come to life through regular updates and demos, allowing for feedback and refinement along the way.",
    color: "from-green-500/20 to-emerald-500/20",
    glow: "bg-green-500/10",
  },
  {
    id: 5,
    phase: "Phase V",
    title: "Launch & Handover",
    description:
      "After rigorous testing and refinement, your project goes live. I provide necessary training and documentation to ensure you're fully equipped to manage your new digital asset. We'll ensure a smooth transition and I'll be available for any post-launch support you might need.",
    color: "from-teal-500/20 to-cyan-500/20",
    glow: "bg-teal-500/10",
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
      <div className="relative w-full h-full bg-slate-900/90 backdrop-blur-xl rounded-xl border border-slate-800/50 p-8 md:p-12 overflow-hidden shadow-2xl group">
        {/* Tech Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
        </div>

        {/* Scanning Line Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent animate-scan" />
        </div>

        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-orange/50 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-orange/50 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-orange/50 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-orange/50 rounded-br-lg" />

        {/* Decorative Tech Elements */}
        <div className="absolute top-6 right-6 flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="w-1 h-1 bg-brand-orange rounded-full animate-pulse" />
            <span className="w-1 h-1 bg-brand-orange rounded-full animate-pulse delay-75" />
            <span className="w-1 h-1 bg-brand-orange rounded-full animate-pulse delay-150" />
          </div>
          <div className="px-2 py-1 rounded bg-brand-orange/10 border border-brand-orange/20">
            <span className="text-xs font-mono text-brand-orange uppercase tracking-wider">
              SYS.ACTIVE
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Header Section */}
          <div>
            {/* Phase Badge */}
            <div className="inline-flex items-center mb-6">
              <span className="text-brand-orange font-mono text-sm tracking-widest uppercase mr-4">
                [{step.phase}]
              </span>
              <div className="h-[1px] w-12 bg-brand-orange/30" />
            </div>

            {/* Title */}
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              {step.title}
            </h3>
          </div>

          {/* Description */}
          <div className="max-w-2xl relative">
            <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-brand-orange/50 to-transparent" />
            <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light pl-6">
              {step.description}
            </p>
          </div>

          {/* Tech Footer */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800/50">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
              <span>ID: {String(step.id).padStart(2, "0")}</span>
              <span>//</span>
              <span>EXEC_MODE</span>
            </div>

            {/* Progress Dots */}
            <div className="flex items-center space-x-1">
              {steps.map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className={`w-1.5 h-1.5 rounded-sm transition-all duration-300 ${
                    dotIndex === index ? "bg-brand-orange" : "bg-slate-700"
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
      className="relative bg-brand-dark min-h-[300vh]"
    >
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex flex-col items-center justify-center bg-brand-dark/90 backdrop-blur-xl py-16 h-[30vh] border-b border-slate-800/50">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-7xl font-bold text-white mb-4 text-center bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent"
        >
          Process
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto text-center font-light"
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
          <div className="w-1 h-40 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="w-full bg-gradient-to-b from-brand-orange to-amber-500 rounded-full"
              style={{
                scaleY: scrollYProgress,
                transformOrigin: "top",
              }}
            />
          </div>
          <motion.span
            className="text-xs font-semibold text-slate-400 whitespace-nowrap"
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
