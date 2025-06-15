
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Main interactive blur that follows mouse with cinematic movement */}
      <motion.div
        className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-500/30 via-blue-500/20 to-cyan-400/30 rounded-full blur-3xl"
        animate={{
          x: mousePosition.x / 30 - 300,
          y: mousePosition.y / 30 - 300,
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ 
          x: { type: "spring", damping: 25, stiffness: 50 },
          y: { type: "spring", damping: 25, stiffness: 50 },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" }
        }}
        style={{ left: "20%", top: "10%" }}
      />
      
      {/* Secondary blur with opposite movement and different colors */}
      <motion.div
        className="absolute w-[400px] h-[400px] bg-gradient-to-r from-pink-500/25 via-purple-600/20 to-indigo-500/25 rounded-full blur-3xl"
        animate={{
          x: -mousePosition.x / 20 + 200,
          y: -mousePosition.y / 20 + 200,
          scale: [1, 0.7, 1.2, 1],
          rotate: [360, 0],
        }}
        transition={{ 
          x: { type: "spring", damping: 30, stiffness: 60 },
          y: { type: "spring", damping: 30, stiffness: 60 },
          scale: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 25, repeat: Infinity, ease: "linear" }
        }}
        style={{ right: "15%", bottom: "15%" }}
      />

      {/* Tertiary floating blur */}
      <motion.div
        className="absolute w-[300px] h-[300px] bg-gradient-to-r from-cyan-400/20 via-blue-500/15 to-purple-600/20 rounded-full blur-2xl"
        animate={{
          x: mousePosition.x / 50 - 150,
          y: mousePosition.y / 50 - 150,
          scale: [0.8, 1.4, 0.8],
          rotate: [0, 270, 540],
        }}
        transition={{ 
          x: { type: "spring", damping: 40, stiffness: 80 },
          y: { type: "spring", damping: 40, stiffness: 80 },
          scale: { duration: 15, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 30, repeat: Infinity, ease: "linear" }
        }}
        style={{ left: "60%", top: "40%" }}
      />

      {/* Additional ambient blurs */}
      <motion.div
        className="absolute w-[200px] h-[200px] bg-gradient-to-r from-emerald-400/15 via-teal-500/10 to-cyan-400/15 rounded-full blur-xl"
        animate={{
          x: mousePosition.x / 80 - 100,
          y: -mousePosition.y / 80 + 100,
          scale: [1.2, 0.6, 1.5, 1.2],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{ 
          x: { type: "spring", damping: 50, stiffness: 100 },
          y: { type: "spring", damping: 50, stiffness: 100 },
          scale: { duration: 18, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 10, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ left: "10%", bottom: "20%" }}
      />

      {/* Orbital blurs that create depth */}
      <motion.div
        className="absolute w-[150px] h-[150px] bg-gradient-to-r from-yellow-400/10 via-orange-500/8 to-red-500/10 rounded-full blur-lg"
        animate={{
          x: Math.cos(Date.now() * 0.001) * 100 + mousePosition.x / 100,
          y: Math.sin(Date.now() * 0.001) * 100 + mousePosition.y / 100,
          scale: [1, 1.8, 1],
        }}
        transition={{ 
          x: { duration: 20, repeat: Infinity, ease: "linear" },
          y: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{ right: "30%", top: "60%" }}
      />
    </div>
  );
};

export default AnimatedBackground;
