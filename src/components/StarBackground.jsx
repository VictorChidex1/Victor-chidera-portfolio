import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const StarBackground = () => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      const starCount = 50; // Adjust number of stars

      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100, // Percentage
          y: Math.random() * 100, // Percentage
          size: Math.random() * 2 + 1, // Size between 1px and 3px
          opacity: Math.random() * 0.5 + 0.3, // Opacity between 0.3 and 0.8
          duration: Math.random() * 3 + 2, // Animation duration between 2s and 5s
          delay: Math.random() * 2, // Animation delay
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

export default StarBackground;
