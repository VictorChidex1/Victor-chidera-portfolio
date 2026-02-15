import React from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/2348063807769"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      {/* Pulse/Glow Effect */}
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75 duration-1000 group-hover:duration-500"></span>

      {/* Main Button */}
      <div className="relative p-4 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#128C7E] transition-all transform hover:scale-110 duration-300">
        <FaWhatsapp size={32} />
      </div>
    </motion.a>
  );
};

export default WhatsAppButton;
