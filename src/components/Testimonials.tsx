import React, { useState } from "react";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Esther Onyinye",
    role: "CEO, TechStart",
    content:
      "Working with Victor was an absolute pleasure. He transformed our outdated website into a modern, high-converting platform. The attention to detail and fluid animations are truly unmatched.",
    image: "/esther-onyinye.webp",
  },
  {
    id: 2,
    name: "Emmanuel Olafisoye",
    role: "Afrobeats Superstar (Raploard)",
    content:
      "Victor built my artist portfolio website with a sleek, immersive media player to showcase music, tour dates, and facilitate bookings. The aesthetic is incredibly premium. Highly recommended.",
    image: "/emmanuel-olafisoye.webp",
  },
  {
    id: 3,
    name: "Dr Ozioma Glory",
    role: "Marketing Director, CreativeFlow",
    content:
      "I was impressed by Victor's ability to translate our abstract design concepts into pixel-perfect code. He is a true professional and delivered a breathtaking final product.",
    image: "/dr-ozioma.webp",
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="py-32 bg-[#0d1117] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="mb-24 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-white leading-[0.9] tracking-tighter"
          >
            KIND <br /> <span className="text-white/20">WORDS</span>
          </motion.h2>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[450px] md:h-[400px] w-full flex items-center justify-center" style={{ perspective: 1200 }}>
          <AnimatePresence initial={false}>
            {testimonials.map((testimonial, index) => {
              const position = 
                index === activeIndex ? "active" :
                index === (activeIndex - 1 + testimonials.length) % testimonials.length ? "prev" :
                "next";

              // Map position to fluid physics styles
              const variants = {
                active: {
                  x: "0%",
                  scale: 1,
                  opacity: 1,
                  zIndex: 30,
                  filter: "blur(0px)",
                  rotateY: 0
                },
                prev: {
                  x: "-70%", 
                  scale: 0.8,
                  opacity: 0.4,
                  zIndex: 20,
                  filter: "blur(8px)",
                  rotateY: 15
                },
                next: {
                  x: "70%", 
                  scale: 0.8,
                  opacity: 0.4,
                  zIndex: 20,
                  filter: "blur(8px)",
                  rotateY: -15
                }
              };

              return (
                <motion.div
                  key={testimonial.id}
                  variants={variants}
                  initial={false}
                  animate={position}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  onClick={() => setActiveIndex(index)}
                  className={`absolute w-full max-w-[90%] md:max-w-2xl bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] backdrop-blur-xl cursor-pointer ${position === 'active' ? 'shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-default' : ''}`}
                >
                  <Quote
                    className={`absolute top-8 right-8 ${position === 'active' ? 'text-brand-accent/20' : 'text-white/5'} transition-colors duration-500`}
                    size={64}
                  />

                  <p className={`text-xl md:text-3xl font-medium leading-relaxed mb-10 relative z-10 transition-colors duration-500 ${position === 'active' ? 'text-white' : 'text-white/40'}`}>
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-4 relative z-10">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-white/20 object-cover"
                    />
                    <div>
                      <h4 className={`font-bold text-lg md:text-xl transition-colors duration-500 ${position === 'active' ? 'text-white' : 'text-white/60'}`}>
                        {testimonial.name}
                      </h4>
                      <p className="text-white/40 text-sm md:text-base">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Carousel Controls */}
        <div className="flex justify-center items-center gap-6 mt-12 md:mt-20 relative z-10">
          <button 
            onClick={prev}
            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 hover:border-white/20 transition-all duration-300 backdrop-blur-md shadow-lg"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            {testimonials.map((_, i) => (
              <button 
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-500 ${i === activeIndex ? 'w-8 bg-brand-accent' : 'w-2 bg-white/20 hover:bg-white/40'}`}
              />
            ))}
          </div>

          <button 
            onClick={next}
            className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:scale-110 hover:border-white/20 transition-all duration-300 backdrop-blur-md shadow-lg"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      
      {/* Premium Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[600px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
};

export default Testimonials;
