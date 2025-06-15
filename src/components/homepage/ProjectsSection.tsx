
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useRef, lazy, Suspense } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";

// Lazy load images for performance
const LazyImage = lazy(() => import("../ui/LazyImage"));

const projects = [
  {
    id: 1,
    title: "AI Workflow Automation",
    description: "Streamlined 200+ manual processes with intelligent automation",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    tech: ["AI", "Automation", "Analytics"],
    metrics: { efficiency: "+127%", time_saved: "2.3M hrs", cost_reduction: "40%" },
    category: "AI/ML"
  },
  {
    id: 2,
    title: "Global Team Dashboard",
    description: "Real-time collaboration platform for 50+ distributed teams",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    tech: ["React", "WebRTC", "Cloud"],
    metrics: { users: "10K+", uptime: "99.9%", satisfaction: "4.8/5" },
    category: "Collaboration"
  },
  {
    id: 3,
    title: "Predictive Finance Suite", 
    description: "Automated financial forecasting with machine learning",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
    tech: ["Machine Learning", "Finance", "APIs"],
    metrics: { accuracy: "94%", revenue_impact: "+$2.1M", predictions: "1000+" },
    category: "FinTech"
  },
  {
    id: 4,
    title: "Smart IoT Platform",
    description: "Connected device management with predictive analytics",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
    tech: ["IoT", "Edge Computing", "Analytics"],
    metrics: { devices: "50K+", latency: "<50ms", efficiency: "+85%" },
    category: "IoT"
  },
  {
    id: 5,
    title: "Blockchain Security Suite",
    description: "Enterprise-grade security with decentralized architecture",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    tech: ["Blockchain", "Security", "Web3"],
    metrics: { transactions: "1M+", security_score: "A+", breaches: "0" },
    category: "Security"
  },
  {
    id: 6,
    title: "Neural Network Optimizer",
    description: "Advanced deep learning model optimization platform",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    tech: ["Deep Learning", "GPU Computing", "Python"],
    metrics: { performance: "+300%", models: "500+", accuracy: "97%" },
    category: "AI/ML"
  }
];

const ProjectCard = ({ project, index }: { project: typeof projects[0], index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8, type: "spring", stiffness: 100 }}
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ 
        scale: 1.05,
        z: 50,
        rotateX: 5,
        rotateY: isHovered ? (mousePosition.x - 200) / 50 : 0,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ 
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      className="group cursor-pointer"
    >
      <Card className="bg-black/40 backdrop-blur-xl border-white/20 hover:border-purple-400/50 transition-all duration-700 overflow-hidden relative h-full">
        {/* Dynamic spotlight effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139,92,246,0.3), rgba(168,85,247,0.1) 40%, transparent 70%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Image container with 3D effects */}
        <div className="aspect-video overflow-hidden relative">
          <Suspense fallback={
            <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 animate-pulse" />
          }>
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              style={{
                filter: isHovered ? "brightness(1.1) contrast(1.1)" : "brightness(0.9)"
              }}
            />
          </Suspense>
          
          {/* Category badge */}
          <motion.div
            className="absolute top-4 left-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <Badge className="bg-purple-600/80 text-white border-0 backdrop-blur-sm">
              {project.category}
            </Badge>
          </motion.div>

          {/* Hover overlay with metrics */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-3 gap-2 w-full">
              {Object.entries(project.metrics).map(([key, value], i) => (
                <motion.div
                  key={key}
                  className="text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                >
                  <div className="text-white font-bold text-sm">{value}</div>
                  <div className="text-white/70 text-xs capitalize">{key.replace('_', ' ')}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <CardContent className="p-6 relative z-10">
          <motion.h3 
            className="text-xl font-bold text-white mb-2 flex items-center justify-between"
            animate={{ 
              rotateX: isHovered ? 3 : 0,
              y: isHovered ? -2 : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            {project.title}
            <motion.div
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowRight className="w-5 h-5 text-purple-400" />
            </motion.div>
          </motion.h3>
          
          <motion.p 
            className="text-white/80 mb-4 leading-relaxed"
            animate={{ 
              rotateX: isHovered ? 2 : 0,
              y: isHovered ? -1 : 0 
            }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {project.description}
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-2"
            animate={{ 
              rotateX: isHovered ? 1 : 0,
              y: isHovered ? -1 : 0 
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {project.tech.map((tech, techIndex) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + techIndex * 0.05 }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <Badge 
                  variant="secondary" 
                  className="bg-purple-600/20 text-purple-300 border-purple-500/30 hover:bg-purple-600/30 transition-all duration-300"
                >
                  {tech}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>

        {/* Floating particles effect on hover */}
        {isHovered && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-400/80 rounded-full"
                initial={{ 
                  x: mousePosition.x, 
                  y: mousePosition.y, 
                  opacity: 0, 
                  scale: 0 
                }}
                animate={{ 
                  x: mousePosition.x + (Math.random() - 0.5) * 150,
                  y: mousePosition.y + (Math.random() - 0.5) * 150,
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0]
                }}
                transition={{ 
                  duration: 2.5,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </Card>
    </motion.div>
  );
};

const ProjectsSection = () => {
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2 
            className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-white via-purple-300 to-cyan-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Success Stories
          </motion.h2>
          <motion.p 
            className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover how leading organizations are transforming their operations with PulseOS. 
            Real results, measurable impact, and unprecedented growth.
          </motion.p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <motion.button
            className="group bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-3 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>View All Projects</span>
            <ExternalLink className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
