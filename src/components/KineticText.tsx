import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface KineticTextProps {
  children: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  delay?: number;
}

const KineticText = ({ children, as: Tag = 'div', className = '', delay = 0 }: KineticTextProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "0px 0px -15% 0px" });

  const words = children.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
      }
    }
  };

  const childVariants = {
    hidden: { y: '110%', rotate: 6, opacity: 0 },
    visible: { 
      y: '0%', 
      rotate: 0, 
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" as const } 
    }
  };

  const MotionTag = motion(Tag as any) as any;

  return (
    <MotionTag 
      ref={containerRef} 
      className={`${className} flex flex-wrap`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden align-bottom mr-[0.25em] pb-2"
        >
          <motion.span 
            variants={childVariants}
            className="inline-block origin-bottom-left will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
};

export default KineticText;
