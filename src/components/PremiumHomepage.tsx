
import { motion } from "framer-motion";
import ParticlesBackground from "./homepage/ParticlesBackground";
import AnimatedBackground from "./homepage/AnimatedBackground";
import Header from "./homepage/Header";
import HeroSection from "./homepage/HeroSection";
import FeaturesSection from "./homepage/FeaturesSection";
import ProjectsSection from "./homepage/ProjectsSection";
import TestimonialsSection from "./homepage/TestimonialsSection";
import CTASection from "./homepage/CTASection";
import Footer from "./homepage/Footer";

const PremiumHomepage = () => {
  return (
    <motion.div 
      className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-black via-purple-950/30 to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
    >
      {/* Enhanced Particles Background with mouse interaction */}
      <ParticlesBackground />

      {/* Enhanced Animated Background Blurs with cinematic movement */}
      <AnimatedBackground />

      {/* Header with smooth entrance */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      >
        <Header />
      </motion.div>

      {/* Hero Section with 3D elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
      >
        <HeroSection />
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <FeaturesSection />
      </motion.div>

      {/* Enhanced Projects Carousel Section with 3D animations */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <ProjectsSection />
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <TestimonialsSection />
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <CTASection />
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default PremiumHomepage;
