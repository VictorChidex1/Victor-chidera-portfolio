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
    role: "Afrobeats Superstar (Raploard)",
    content:
      "Victor built my artist porfolio website with a sleek, immersive media player to showcase music, tour dates, and facilitate bookings. Highly recommended.",
    image: "/emmanuel-olafisoye.webp",
  },
  {
    id: 3,
    name: "Dr Ozioma Glory",
    role: "Marketing Director, CreativeFlow",
    content:
      "I was impressed by Victor's ability to translate our design concepts into pixel-perfect code. He is a true professional indeed.",
    image: "/dr-ozioma.webp",
  },
];

const Testimonials = () => {
  return (
    <section
      id="testimonials"
      className="py-32 bg-white border-t border-brand-line"
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
            className="text-5xl font-bold font-display text-brand-ink mb-6"
          >
            KIND <br /> <span className="text-brand-muted">WORDS</span>
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
              className="bg-white p-8 rounded-2xl border border-brand-line relative group hover:border-brand-ink transition-colors"
            >
              <Quote
                className="absolute top-8 right-8 text-slate-200 group-hover:text-brand-ink/20 transition-colors"
                size={48}
              />

              <p className="text-brand-muted text-lg mb-8 relative z-10 leading-relaxed">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full border border-brand-line"
                />
                <div>
                  <h4 className="text-brand-ink font-bold">{testimonial.name}</h4>
                  <p className="text-brand-muted text-sm">{testimonial.role}</p>
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
