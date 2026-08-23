import { motion } from "framer-motion";

const skills = [
  "FRONTEND",
  "BACKEND",
  "SYSTEM ARCHITECTURE",
  "UI/UX DESIGN",
  "AI INTEGRATION",
  "SERVERLESS",
  "WEBGL",
  "API SECURITY"
];

// Duplicate the array to create a seamless loop
const marqueeContent = [...skills, ...skills, ...skills, ...skills];

const InfiniteMarquee = () => {
  return (
    <div className="relative w-full overflow-hidden bg-brand-ink py-6 flex items-center transform -rotate-2 scale-110">
      {/* Top/Bottom subtle borders for the marquee */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/10" />
      
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -1000], // Will adjust to percentage below to be truly infinite
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
        style={{
          // Use CSS for true infinite scrolling width calculation
          animation: "marquee 30s linear infinite",
        }}
      >
        {/* We use a custom style block to define the keyframe since tailwind doesn't have marquee built-in by default */}
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
          `}
        </style>
        
        <div className="flex gap-16 px-8 items-center">
          {marqueeContent.map((skill, idx) => (
            <div key={idx} className="flex items-center gap-16">
              <span className="text-white/40 text-3xl font-display font-bold tracking-widest whitespace-nowrap">
                {skill}
              </span>
              <span className="text-brand-accent text-3xl font-bold">•</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default InfiniteMarquee;
