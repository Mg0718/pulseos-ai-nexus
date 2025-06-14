
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
    <div className="min-h-screen bg-gradient-to-br from-[#6F2DBD] via-[#A663CC] to-[#B298DC] overflow-x-hidden relative">
      {/* Particles Background */}
      <ParticlesBackground />

      {/* Animated Background Blurs */}
      <AnimatedBackground />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Projects Carousel Section */}
      <ProjectsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PremiumHomepage;
