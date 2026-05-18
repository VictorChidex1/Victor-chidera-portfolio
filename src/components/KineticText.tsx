import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface KineticTextProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  delay?: number;
}

const KineticText = ({ children, as: Tag = 'div', className = '', delay = 0 }: KineticTextProps) => {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll('.kinetic-word');

    const ctx = gsap.context(() => {
      gsap.to(words, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: '0%',
        rotate: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.04,
        delay: delay,
      });
    }, el);

    return () => ctx.revert();
  }, [delay, children]);

  const words = children.split(' ');

  return (
    <Tag ref={containerRef} className={`${className} flex flex-wrap`}>
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden align-bottom mr-[0.25em] pb-2"
        >
          <span className="inline-block kinetic-word translate-y-[110%] rotate-6 opacity-0 origin-bottom-left will-change-transform">
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
};

export default KineticText;
