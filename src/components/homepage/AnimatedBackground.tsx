
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-r from-white/10 to-[#B9FAF8]/20 rounded-full blur-3xl"
        animate={{
          x: mousePosition.x / 50,
          y: mousePosition.y / 50,
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          x: { type: "spring", damping: 50, stiffness: 100 },
          y: { type: "spring", damping: 50, stiffness: 100 },
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ left: "10%", top: "20%" }}
      />
      <motion.div
        className="absolute w-64 h-64 bg-gradient-to-r from-[#B9FAF8]/15 to-white/10 rounded-full blur-2xl"
        animate={{
          x: -mousePosition.x / 30,
          y: -mousePosition.y / 30,
          scale: [1, 0.8, 1],
        }}
        transition={{ 
          x: { type: "spring", damping: 50, stiffness: 100 },
          y: { type: "spring", damping: 50, stiffness: 100 },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ right: "10%", bottom: "20%" }}
      />
    </div>
  );
};

export default AnimatedBackground;
