import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { fadeInUp, staggerContainer } from "../utils/animations";

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

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <motion.div
      variants={fadeInUp}
      className="border-b border-slate-800 last:border-none"
    >
      <button
        onClick={onClick}
        className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
      >
        <span
          className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${
            isOpen
              ? "text-brand-orange"
              : "text-white group-hover:text-brand-orange"
          }`}
        >
          {question}
        </span>
        <span
          className={`ml-4 p-2 rounded-full border transition-all duration-300 ${
            isOpen
              ? "border-brand-orange text-brand-orange rotate-180"
              : "border-slate-700 text-slate-400 group-hover:border-brand-orange group-hover:text-brand-orange"
          }`}
        >
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="text-slate-400 text-lg leading-relaxed pb-6 pr-12">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="py-20 px-6 bg-brand-dark relative overflow-hidden"
      id="faq"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Frequently Asked{" "}
              <span className="text-brand-orange">Questions</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Got questions? I've got answers. Here are some of the most common
              inquiries I receive.
            </p>
          </motion.div>

          <div className="bg-slate-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-slate-800/50">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
