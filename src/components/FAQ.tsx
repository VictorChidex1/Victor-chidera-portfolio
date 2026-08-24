import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus, RotateCcw } from "lucide-react";

const faqs = [
  {
    question: "What services do you offer?",
    answer:
      "I specialize in full-stack web development, offering custom website design, frontend development with React/Next.js, backend solutions, and SEO optimization to ensure your digital presence is powerful and effective.",
  },
  {
    question: "What is your typical timeline?",
    answer:
      "Timelines vary depending on the project's scope and complexity. A standard portfolio or business site typically takes 2-4 weeks, while more complex web applications may take 6-10 weeks. I provide a detailed timeline during our initial consultation.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Absolutely. I offer various maintenance packages to keep your website secure, up-to-date, and performing optimally. From content updates to technical troubleshooting, I'm here to support your growth.",
  },
  {
    question: "What is your pricing structure?",
    answer:
      "My pricing is project-based, ensuring transparency and no surprise costs. I assess your specific needs and goals to provide a tailored quote. I also offer hourly rates for smaller tasks or ongoing consultation.",
  },
  {
    question: "How do we get started?",
    answer:
      "It's simple! Click the 'Contact Me' button to send me a message or book a free discovery call. We'll discuss your vision, requirements, and how we can collaborate to bring your digital dreams to life.",
  },
];

const FlipCard = ({ question, answer }: { question: string; answer: string }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full h-[320px] md:h-[350px] cursor-pointer group"
      style={{ perspective: 1200 }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Front Side (Question) */}
        <div 
          className="absolute inset-0 w-full h-full bg-brand-surface border border-brand-line rounded-[2rem] p-8 flex flex-col justify-between hover:border-brand-ink/30 transition-colors shadow-sm"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-brand-muted font-medium text-xs md:text-sm tracking-widest uppercase">Question</span>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform shrink-0">
              <Plus size={20} className="text-brand-ink" />
            </div>
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-brand-ink leading-tight">
            {question}
          </h3>
        </div>

        {/* Back Side (Answer) */}
        <div 
          className="absolute inset-0 w-full h-full bg-brand-ink rounded-[2rem] p-8 flex flex-col justify-between shadow-2xl"
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-start">
            <span className="text-white/50 font-medium text-xs md:text-sm tracking-widest uppercase">Answer</span>
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:rotate-180 transition-transform duration-500 shrink-0">
              <RotateCcw size={18} className="text-white" />
            </div>
          </div>
          <p className="text-white/90 text-base md:text-lg leading-relaxed overflow-y-auto">
            {answer}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const FAQ = () => {
  return (
    <section className="py-32 bg-white relative overflow-hidden" id="faq">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-brand-ink leading-[0.9] tracking-tighter"
            >
              FAQ<span className="text-brand-accent">.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-brand-muted text-lg max-w-sm pb-2"
          >
            Click any card to flip it and reveal the answer. If you have any other questions, feel free to reach out.
          </motion.p>
        </div>

        {/* 3D Flip Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {faqs.map((faq, index) => {
            // Make the 5th item span 2 columns on desktop to complete the bento grid perfectly
            const isLastItem = index === 4;
            
            return (
              <div 
                key={index} 
                className={isLastItem ? "lg:col-span-2" : ""}
              >
                <FlipCard question={faq.question} answer={faq.answer} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
