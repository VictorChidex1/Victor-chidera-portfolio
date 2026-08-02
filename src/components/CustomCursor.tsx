import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const scale = useMotionValue(1);
  const scaleSpring = useSpring(scale, { damping: 20, stiffness: 300 });

  const bg = useMotionValue('white');
  const border = useMotionValue('none');

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMouseMove = (e: MouseEvent) => {
      let targetX = e.clientX;
      let targetY = e.clientY;
      
      const target = e.target as HTMLElement;
      const magneticEl = target.closest('.magnetic') as HTMLElement;
      
      if (magneticEl) {
        const rect = magneticEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        
        magneticEl.animate([
          { transform: `translate(${distX * 0.3}px, ${distY * 0.3}px)` }
        ], { duration: 400, fill: 'forwards', easing: 'ease-out' });
        
        targetX = centerX + distX * 0.1;
        targetY = centerY + distY * 0.1;
      }
      
      cursorX.set(targetX);
      cursorY.set(targetY);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactable = target.closest('a, button, .magnetic, input, textarea');
      
      if (interactable) {
        scale.set(3.5);
        bg.set('transparent');
        border.set('1px solid white');
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactable = target.closest('a, button, .magnetic, input, textarea');
      
      if (interactable) {
        scale.set(1);
        bg.set('white');
        border.set('none');
        
        const magneticEl = target.closest('.magnetic') as HTMLElement;
        if (magneticEl) {
          magneticEl.animate([
            { transform: 'translate(0px, 0px)' }
          ], { duration: 700, fill: 'forwards', easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' });
        }
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
    };
  }, [cursorX, cursorY, scale, bg, border]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block will-change-transform"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
        scale: scaleSpring,
        backgroundColor: bg,
        border: border,
      }}
    />
  );
};

export default CustomCursor;
