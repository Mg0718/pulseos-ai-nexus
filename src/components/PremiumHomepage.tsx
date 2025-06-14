
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Brain, 
  Sparkles, 
  ArrowRight, 
  Users, 
  BarChart3, 
  Shield,
  Star,
  Check,
  Zap,
  Globe,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Advanced AI that learns your team's patterns and automates complex business processes with unprecedented accuracy.",
    gradient: "from-[#6F2DBD] to-[#A663CC]"
  },
  {
    icon: Users,
    title: "Global Team Orchestration",
    description: "Seamlessly coordinate distributed teams across time zones with intelligent scheduling and communication tools.",
    gradient: "from-[#A663CC] to-[#B298DC]"
  },
  {
    icon: BarChart3,
    title: "Predictive Analytics",
    description: "Real-time insights and predictive modeling that help you make data-driven decisions before opportunities pass.",
    gradient: "from-[#B298DC] to-[#B8D0EB]"
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CEO, TechFlow",
    content: "PulseOS transformed our operations. We've seen 40% increase in productivity and our teams have never been more aligned.",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO, InnovateNow",
    content: "The AI automation features are incredible. Tasks that used to take hours now complete in minutes with higher accuracy.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    rating: 5
  },
  {
    name: "Emily Watson",
    role: "Head of Operations, GrowthCo",
    content: "Finally, a business OS that actually understands how modern teams work. The ROI was evident within the first month.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    rating: 5
  }
];

const stats = [
  { label: "Teams Powered", value: "50K+", change: "+127%" },
  { label: "Hours Saved Daily", value: "2.3M", change: "+89%" },
  { label: "ROI Average", value: "340%", change: "+156%" },
  { label: "Global Reach", value: "120", change: "+67%" }
];

const PremiumHomepage = () => {
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const heroY = useTransform(scrollY, [0, 800], [0, -200]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6F2DBD] via-[#A663CC] to-[#B298DC] overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x / 50,
            y: mousePosition.y / 50,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 100 }}
          style={{ left: "10%", top: "20%" }}
        />
        <motion.div
          className="absolute w-64 h-64 bg-[#B9FAF8]/10 rounded-full blur-2xl"
          animate={{
            x: -mousePosition.x / 30,
            y: -mousePosition.y / 30,
          }}
          transition={{ type: "spring", damping: 50, stiffness: 100 }}
          style={{ right: "10%", bottom: "20%" }}
        />
      </div>

      {/* Hero Section */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex items-center justify-center px-6"
      >
        <div className="max-w-6xl mx-auto text-center">
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
            <span className="bg-gradient-to-r from-white via-[#B9FAF8] to-white bg-clip-text text-transparent">
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
              size="lg"
              className="group bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
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
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/60 text-sm mb-1">{stat.label}</div>
                <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                  {stat.change}
                </Badge>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Engineered for Excellence
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Every feature is meticulously crafted to deliver unparalleled performance and user experience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group"
              >
                <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 h-full">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Trusted by Leaders
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Join thousands of forward-thinking organizations already transforming their operations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:border-white/30 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-white/80 mb-6 leading-relaxed">{testimonial.content}</p>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-white font-semibold">{testimonial.name}</div>
                        <div className="text-white/60 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
              Join the revolution. Experience the future of business operations today.
            </p>
            <Button 
              size="lg"
              className="group bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] hover:from-[#A663CC] hover:to-[#6F2DBD] text-white px-12 py-6 text-xl font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0"
            >
              <Zap className="w-6 h-6 mr-3 group-hover:animate-pulse" />
              Get Started Now
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-white" />
              <span className="text-2xl font-bold text-white">PulseOS</span>
            </div>
            <p className="text-white/60">© 2024 PulseOS. Transforming business, one pulse at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PremiumHomepage;
