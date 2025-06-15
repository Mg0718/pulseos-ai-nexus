
import React, { Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import ThreeJSErrorBoundary from "./ThreeJSErrorBoundary";

// Lazy load ThreeJS components to prevent context issues
const ThreeJSScene = React.lazy(() => 
  import("./ThreeJSComponents").then(module => ({ default: module.ThreeJSScene })).catch(() => ({ 
    default: () => <div className="absolute inset-0" /> 
  }))
);

const stats = [
  { label: "Teams Powered", value: "50K+", change: "+127%" },
  { label: "Hours Saved Daily", value: "2.3M", change: "+89%" },
  { label: "ROI Average", value: "340%", change: "+156%" },
  { label: "Global Reach", value: "120", change: "+67%" }
];

const HeroSection = () => {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, -200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <motion.section 
      style={{ y: heroY, opacity: heroOpacity }}
      className="relative min-h-screen flex items-center justify-center px-6 pt-20"
    >
      <ThreeJSErrorBoundary fallback={<div className="absolute inset-0" />}>
        <Suspense fallback={<div className="absolute inset-0" />}>
          <ThreeJSScene />
        </Suspense>
      </ThreeJSErrorBoundary>
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", stiffness: 100 }}
          className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/30"
        >
          <Brain className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
        >
          The Future of
          <br />
          <span className="bg-gradient-to-r from-white via-purple-300 to-white bg-clip-text text-transparent">
            Business Intelligence
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          PulseOS is the AI-powered business operating system that transforms how global teams collaborate, 
          automate, and scale their operations in the modern world.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            asChild
            size="lg"
            className="group bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white border-0 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <Link to="/dashboard">
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button 
            variant="ghost"
            size="lg"
            className="text-white hover:bg-white/10 border border-white/20 px-8 py-4 text-lg rounded-2xl transition-all duration-300"
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.label} 
              className="text-center"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-white/60 text-sm mb-1">{stat.label}</div>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                {stat.change}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
