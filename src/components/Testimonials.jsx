import React from "react";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "../utils/animations";

const testimonials = [
  {
    id: 1,
    name: "Esther Onyinye",
    role: "CEO, TechStart",
    content:
      "Working with Victor was an absolute pleasure. He transformed our outdated website into a modern, high-converting platform.",
    image: "/esther-onyinye.webp",
  },
  {
    id: 2,
    name: "Emmanuel Olafisoye",
    role: "Product Manager, InnovateCorp",
    content:
      "The dashboard application Victor built for us has streamlined our internal processes significantly. Highly recommended.",
    image: "/emmanuel-olafisoye.webp",
  },
  {
    id: 3,
    name: "Dr Ozioma Glory",
    role: "Marketing Director, CreativeFlow",
    content:
      "I was impressed by Victor's ability to translate our design concepts into pixel-perfect code. He is a true professional.",
    image: "/dr-ozioma.webp",
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-32 bg-brand-dark border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-20"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-5xl font-bold text-white mb-6"
          >
            KIND <br /> <span className="text-slate-500">WORDS</span>
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-slate-900/30 p-8 rounded-2xl border border-slate-800 relative group hover:border-brand-orange/30 transition-colors"
            >
              <Quote
                className="absolute top-8 right-8 text-slate-800 group-hover:text-brand-orange/20 transition-colors"
                size={48}
              />

              <p className="text-slate-300 text-lg mb-8 relative z-10 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border border-slate-700"
                />
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-slate-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
