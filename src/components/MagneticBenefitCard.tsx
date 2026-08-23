import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticBenefitCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

const MagneticBenefitCard = ({
  title,
  description,
  icon,
  className = "",
  delay = 0,
}: MagneticBenefitCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for the magnetic effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the movement using spring physics
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate distance from center of the card
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Magnetic pull strength (higher divisor = weaker pull)
    const pullStrength = 3;
    
    mouseX.set((e.clientX - centerX) / pullStrength);
    mouseY.set((e.clientY - centerY) / pullStrength);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Reset to center
    mouseX.set(0);
    mouseY.set(0);
  };

  // We need to conditionally apply the continuous float. 
  // If hovered, we pause the float so the magnetic effect takes over cleanly.
  
  return (
    <motion.div
      ref={ref}
      className={`absolute ${className}`}
      // Entrance animation
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay, type: "spring", bounce: 0.4 }}
    >
      <motion.div
        animate={isHovered ? {} : {
          y: [0, -15, 0],
        }}
        transition={isHovered ? {} : {
          duration: 4 + (delay * 2), // Randomize float speed based on delay
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ x, y }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2rem] w-[300px] shadow-2xl hover:bg-white/10 transition-colors duration-500 cursor-pointer group"
      >
        <div className="mb-6 text-brand-accent transform group-hover:scale-110 transition-transform duration-500 origin-left">
          {icon}
        </div>
        <h3 className="text-2xl font-bold font-display text-white mb-4 tracking-wide">
          {title}
        </h3>
        <p className="text-white/60 leading-relaxed text-sm">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default MagneticBenefitCard;
