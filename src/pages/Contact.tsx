import { useState } from "react";
import emailjs from "@emailjs/browser";
import { EMAIL_CONFIG } from "../config/email";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const COOLDOWN_MS = 30000; // 30-second cooldown

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const now = Date.now();
    if (now - lastSubmitTime < COOLDOWN_MS) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
      return;
    }

    setStatus("sending");
    setLastSubmitTime(now);

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: "Victor Chidera",
    };

    try {
      // 1. Submit to Firestore contacts collection
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp(),
      });

      // 2. Submit to EmailJS for email notification
      await emailjs.send(
        EMAIL_CONFIG.SERVICE_ID,
        EMAIL_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAIL_CONFIG.PUBLIC_KEY,
      );

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      console.error("Contact Submission Error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <main className="flex flex-col md:flex-row w-full min-h-screen bg-white">
      {/* LEFT SIDE: The Editorial Dark Canvas */}
      <div className="w-full md:w-1/2 bg-brand-ink text-white p-8 pt-32 md:p-16 lg:p-24 xl:p-32 flex flex-col justify-between relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-brand-accent/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-brand-accent text-sm font-bold uppercase tracking-widest mb-6 block">
              Start a conversation
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold font-display leading-[1.1] tracking-tighter mb-8">
              Let's build <br className="hidden lg:block" />
              <span className="text-white/50 italic">something</span> <br />
              extraordinary.
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-lg leading-relaxed font-medium">
              Whether you're looking to architect a scalable platform, redesign
              a flagship product, or simply explore what's possible—I'm ready to
              help you execute at the highest level.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative z-10 mt-16 md:mt-0 grid grid-cols-1 sm:grid-cols-2 gap-8 pt-12 border-t border-white/10"
        >
          <div>
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 block">
              Direct Contact
            </span>
            <a
              href="mailto:donchid.online@gmail.com"
              className="group flex items-center gap-3 text-lg font-medium hover:text-brand-accent transition-colors"
            >
              <Mail
                size={20}
                className="text-white/50 group-hover:text-brand-accent transition-colors"
              />
              donchid.online@gmail.com
            </a>
          </div>
          <div>
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3 block">
              Location
            </span>
            <div className="flex items-center gap-3 text-lg font-medium">
              <MapPin size={20} className="text-white/50" />
              Remote
            </div>
          </div>

          <div className="sm:col-span-2 mt-4">
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4 block">
              Social Profiles
            </span>
            <div className="flex gap-4">
              {[
                {
                  icon: <Github size={20} />,
                  href: "https://github.com/VictorChidex1",
                },
                {
                  icon: <Linkedin size={20} />,
                  href: "https://www.linkedin.com/in/victor-chidera-24151725b/",
                },
                { icon: <Twitter size={20} />, href: "#" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-brand-ink transition-all duration-300 hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: The Structural Form */}
      <div className="w-full md:w-1/2 bg-white p-8 py-24 md:p-16 lg:p-24 xl:p-32 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="space-y-2 group">
              <label className="block text-sm font-bold text-brand-muted uppercase tracking-widest transition-colors group-focus-within:text-brand-ink">
                01. What's your name?
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b-2 border-brand-line px-0 py-4 text-2xl font-medium text-brand-ink placeholder-slate-300 focus:outline-none focus:border-brand-ink transition-all rounded-none"
                placeholder="John Doe *"
              />
            </div>

            <div className="space-y-2 group">
              <label className="block text-sm font-bold text-brand-muted uppercase tracking-widest transition-colors group-focus-within:text-brand-ink">
                02. What's your email address?
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b-2 border-brand-line px-0 py-4 text-2xl font-medium text-brand-ink placeholder-slate-300 focus:outline-none focus:border-brand-ink transition-all rounded-none"
                placeholder="john@company.com *"
              />
            </div>

            <div className="space-y-2 group">
              <label className="block text-sm font-bold text-brand-muted uppercase tracking-widest transition-colors group-focus-within:text-brand-ink">
                03. Tell me about your project
              </label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b-2 border-brand-line px-0 py-4 text-2xl font-medium text-brand-ink placeholder-slate-300 focus:outline-none focus:border-brand-ink transition-all rounded-none resize-none"
                placeholder="Hello Victor, I need help with... *"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className={`group w-full md:w-auto inline-flex items-center justify-center gap-4 px-10 py-6 rounded-full font-bold text-lg transition-all duration-300 overflow-hidden relative ${
                status === "success"
                  ? "bg-green-500 text-white"
                  : status === "error"
                    ? "bg-red-500 text-white"
                    : "bg-brand-ink text-white hover:scale-105"
              }`}
            >
              {/* Button text */}
              <span className="relative z-10 flex items-center gap-2">
                {status === "idle" && (
                  <>
                    Send Message
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </>
                )}
                {status === "sending" && "Sending..."}
                {status === "success" && "Message Sent Successfully!"}
                {status === "error" && "Failed to Send. Try again."}
              </span>

              {/* Hover effect background */}
              {status === "idle" && (
                <div className="absolute inset-0 bg-neutral-800 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Contact;
