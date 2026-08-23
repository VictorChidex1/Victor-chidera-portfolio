import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useProjects } from "../hooks/useFirebaseData";

const TitleSection = () => {
  return (
    <div className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
      <div>
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-brand-ink leading-[0.9] tracking-tighter"
        >
          SELECTED <br /> <span className="text-brand-muted">WORKS</span>
        </motion.h2>
      </div>
      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-brand-muted text-lg md:text-xl max-w-md pb-4"
      >
        A curated selection of high-performance digital solutions, blending cutting-edge engineering with premium aesthetics.
      </motion.p>
    </div>
  );
};

const ProjectCard = ({ project, index }: { project: any; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // 3D rotation based on mouse position
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = (mouseX / width) - 0.5;
    const yPct = (mouseY / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-7xl mx-auto py-8 px-4 md:px-12 group"
      style={{ perspective: 2000 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative w-full rounded-[3rem] bg-[#0d1117] shadow-2xl border border-white/10 p-4 md:p-6 lg:p-10 flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 lg:gap-16 items-center group transition-shadow duration-500`}
      >
        {/* Image Side (Pops out slightly in 3D) */}
        <div 
          className="w-full lg:w-1/2 relative rounded-[2rem] overflow-hidden aspect-video md:aspect-[16/10]"
          style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
        >
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        
        {/* Content Side (Pops out heavily in 3D) */}
        <div 
          className={`w-full lg:w-1/2 flex flex-col justify-center py-4 lg:py-0 pointer-events-none ${isEven ? "lg:pr-8" : "lg:pl-8"}`}
          style={{ transform: "translateZ(60px)", transformStyle: "preserve-3d" }}
        >
          <div className="pointer-events-auto">
            <span className="text-brand-accent font-bold tracking-widest uppercase text-xs md:text-sm mb-4 block">
              {project.category}
            </span>
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              {project.title}
            </h3>
            <p className="text-white/70 text-base md:text-lg max-w-xl mb-8">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-10">
              {project.tech.map((t: string, i: number) => (
                <span 
                  key={i} 
                  className="px-4 py-2 bg-white/5 text-white/70 text-xs md:text-sm rounded-full font-medium border border-white/10"
                >
                  {t}
                </span>
              ))}
            </div>
            
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex group/btn items-center gap-4 bg-white text-brand-ink px-8 py-4 rounded-full font-bold hover:bg-brand-accent hover:text-white transition-colors shadow-lg"
            >
              Visit Website
              <ArrowRight size={24} className="-rotate-45 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FeaturedProjects = () => {
  const { projects } = useProjects();
  const featured = projects.slice(0, 3);

  return (
    <section className="bg-white pb-32 overflow-hidden">
      <TitleSection />
      
      <div className="flex flex-col gap-8 md:gap-16">
        {featured.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>

      {/* Outro Section */}
      <div className="pt-32 pb-16 flex justify-center">
        <Link
          to="/works"
          className="group flex flex-col items-center gap-8 text-brand-ink hover:text-brand-accent transition-colors"
        >
          <span className="text-4xl md:text-7xl font-display font-bold tracking-tighter">
            View All Projects
          </span>
          <div className="w-24 h-24 rounded-full bg-brand-surface border border-brand-line flex items-center justify-center group-hover:scale-110 group-hover:border-brand-accent transition-all duration-500 shadow-xl">
            <ArrowRight
              size={40}
              className="group-hover:translate-x-2 transition-transform text-brand-ink group-hover:text-brand-accent"
            />
          </div>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedProjects;
