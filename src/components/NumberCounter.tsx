import { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface NumberCounterProps {
  end: number;
  suffix?: string;
  className?: string;
}

const NumberCounter = ({ end, suffix = "", className = "" }: NumberCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    mass: 1,
  });

  const displayValue = useTransform(springValue, (current) => {
    return Math.floor(current) + suffix;
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(end);
    }
  }, [isInView, end, springValue]);

  return (
    <div ref={ref}>
      <motion.span className={className}>
        {displayValue}
      </motion.span>
    </div>
  );
};

export default NumberCounter;
