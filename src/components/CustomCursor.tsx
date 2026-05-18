import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const xSet = gsap.quickSetter(cursor, 'x', 'px');
    const ySet = gsap.quickSetter(cursor, 'y', 'px');

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const speed = 0.2;

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      
      const target = e.target as HTMLElement;
      const magneticEl = target.closest('.magnetic') as HTMLElement;
      
      if (magneticEl) {
        const rect = magneticEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distX = mouse.x - centerX;
        const distY = mouse.y - centerY;
        
        gsap.to(magneticEl, {
          x: distX * 0.3,
          y: distY * 0.3,
          duration: 0.4,
          ease: 'power2.out'
        });
        
        mouse.x = centerX + distX * 0.1;
        mouse.y = centerY + distY * 0.1;
      }
    };

    window.addEventListener('mousemove', onMouseMove);

    const ticker = gsap.ticker.add(() => {
      const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
      pos.x += (mouse.x - pos.x) * dt;
      pos.y += (mouse.y - pos.y) * dt;
      xSet(pos.x);
      ySet(pos.y);
    });

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactable = target.closest('a, button, .magnetic, input, textarea');
      
      if (interactable) {
        gsap.to(cursor, {
          scale: 3.5,
          backgroundColor: 'transparent',
          border: '1px solid white',
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactable = target.closest('a, button, .magnetic, input, textarea');
      
      if (interactable) {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: 'white',
          border: 'none',
          duration: 0.3,
          ease: 'power2.out'
        });
        
        const magneticEl = target.closest('.magnetic') as HTMLElement;
        if (magneticEl) {
          gsap.to(magneticEl, {
            x: 0,
            y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.3)'
          });
        }
      }
    };

    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('mouseout', onMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('mouseout', onMouseOut);
      gsap.ticker.remove(ticker);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference hidden md:block will-change-transform"
      style={{ transform: 'translate(-50%, -50%)' }}
    />
  );
};

export default CustomCursor;
