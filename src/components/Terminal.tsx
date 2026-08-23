import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const codeLines = [
  {
    text: "> Initializing developer environment...",
    delay: 500,
    color: "text-slate-400",
  },
  { text: "> Loading dependencies...", delay: 1000, color: "text-slate-400" },
  { text: "const developer = {", delay: 1500, color: "text-brand-accent" },
  { text: "  name: 'Victor Chidera',", delay: 2000, color: "text-white" },
  { text: "  role: 'Fullstack Engineer',", delay: 2500, color: "text-white" },
  { text: "  skills: [", delay: 2900, color: "text-white" },
  {
    text: "    'React', 'Firebase', 'Supabase',",
    delay: 3200,
    color: "text-white",
  },
  {
    text: "    'Next.js', 'PostgreSQL', 'Tailwind'",
    delay: 3500,
    color: "text-white",
  },
  { text: "  ],", delay: 3800, color: "text-white" },
  { text: "  backend: [", delay: 4100, color: "text-white" },
  { text: "    'Node.js', 'Firebase Auth',", delay: 4400, color: "text-white" },
  {
    text: "    'Firestore', 'Security Rules',",
    delay: 4700,
    color: "text-white",
  },
  { text: "    'Cloud Functions'", delay: 5000, color: "text-white" },
  { text: "  ],", delay: 5300, color: "text-white" },
  { text: "  tools: [", delay: 5600, color: "text-white" },
  { text: "    'Git', 'GitHub',", delay: 5900, color: "text-white" },
  { text: "    'Vercel', 'REST API'", delay: 6200, color: "text-white" },
  { text: "  ],", delay: 6500, color: "text-white" },
  { text: "  competencies: [", delay: 6800, color: "text-white" },
  {
    text: "    'AI Integration', 'SaaS Arch',",
    delay: 7100,
    color: "text-white",
  },
  { text: "    'API Security'", delay: 7400, color: "text-white" },
  { text: "  ],", delay: 7700, color: "text-white" },
  { text: "  hardWorker: true,", delay: 8100, color: "text-green-400" },
  { text: "  quickLearner: true", delay: 8400, color: "text-green-400" },
  { text: "};", delay: 8700, color: "text-brand-accent" },
  {
    text: "> Build successful. Ready to create.",
    delay: 9400,
    color: "text-brand-muted",
  },
];

const Terminal = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    const timeouts: NodeJS.Timeout[] = [];

    codeLines.forEach((line, index) => {
      const timeout = setTimeout(() => {
        setVisibleLines((prev) => Math.max(prev, index + 1));
      }, line.delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isInView]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="w-full rounded-xl overflow-hidden bg-[#0d1117] border border-white/10 shadow-2xl shadow-black/50"
    >
      {/* Terminal Header */}
      <div className="bg-[#161b22] px-4 py-3 flex items-center gap-2 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="mx-auto text-xs font-mono text-slate-500">
          victor@macbook-pro:~
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-6 font-mono text-sm md:text-base leading-relaxed overflow-x-auto">
        {codeLines.slice(0, visibleLines).map((line, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${line.color} whitespace-pre`}
          >
            {line.text}
          </motion.div>
        ))}
        {/* Blinking Cursor */}
        {isInView && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            className="inline-block w-2.5 h-5 bg-white align-middle mt-1 ml-1"
          />
        )}
      </div>
    </motion.div>
  );
};

export default Terminal;
