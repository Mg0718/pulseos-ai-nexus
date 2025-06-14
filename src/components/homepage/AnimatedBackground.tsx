
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
      {/* Main interactive blur that follows mouse */}
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
      
      {/* Secondary blur with opposite movement */}
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

      {/* Additional floating blurs */}
      <motion.div
        className="absolute w-48 h-48 bg-gradient-to-r from-[#6F2DBD]/10 to-[#A663CC]/15 rounded-full blur-2xl"
        animate={{
          x: mousePosition.x / 80,
          y: mousePosition.y / 80,
          scale: [0.8, 1.1, 0.8],
          rotate: [0, 180, 360],
        }}
        transition={{ 
          x: { type: "spring", damping: 40, stiffness: 80 },
          y: { type: "spring", damping: 40, stiffness: 80 },
          scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
        style={{ left: "60%", top: "50%" }}
      />

      <motion.div
        className="absolute w-32 h-32 bg-gradient-to-r from-[#A663CC]/20 to-[#B298DC]/10 rounded-full blur-xl"
        animate={{
          x: mousePosition.x / 100,
          y: -mousePosition.y / 100,
          scale: [1.2, 0.7, 1.2],
        }}
        transition={{ 
          x: { type: "spring", damping: 60, stiffness: 120 },
          y: { type: "spring", damping: 60, stiffness: 120 },
          scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ left: "20%", bottom: "30%" }}
      />
    </div>
  );
};

export default AnimatedBackground;
