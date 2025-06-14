
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";

const projects = [
  {
    title: "AI Workflow Automation",
    description: "Streamlined 200+ manual processes",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400",
    tech: ["AI", "Automation", "Analytics"]
  },
  {
    title: "Global Team Dashboard",
    description: "Real-time collaboration for 50+ teams",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
    tech: ["React", "WebRTC", "Cloud"]
  },
  {
    title: "Predictive Finance Suite", 
    description: "Automated financial forecasting",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400",
    tech: ["Machine Learning", "Finance", "APIs"]
  }
];

const ProjectCard = ({ project, index }: { project: typeof projects[0], index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
      transition={{ delay: index * 0.1, duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ 
        scale: 1.05,
        z: 50
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
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:border-white/30 transition-all duration-500 overflow-hidden relative">
        {/* Spotlight effect */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
          />
        )}

        <div className="aspect-video overflow-hidden relative">
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
            loading="lazy"
          />
          
          {/* Image overlay with gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <CardContent className="p-6 relative z-10">
          <motion.h3 
            className="text-xl font-bold text-white mb-2"
            animate={{ 
              rotateX: isHovered ? 5 : 0,
              y: isHovered ? -2 : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            {project.title}
          </motion.h3>
          
          <motion.p 
            className="text-white/70 mb-4"
            animate={{ 
              rotateX: isHovered ? 3 : 0,
              y: isHovered ? -1 : 0 
            }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {project.description}
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-2"
            animate={{ 
              rotateX: isHovered ? 2 : 0,
              y: isHovered ? -1 : 0 
            }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {project.tech.map((tech, techIndex) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: techIndex * 0.1 }}
                whileHover={{ scale: 1.1 }}
              >
                <Badge variant="secondary" className="bg-[#6F2DBD]/20 text-[#B9FAF8] border-[#6F2DBD]/30 hover:bg-[#6F2DBD]/30 transition-colors">
                  {tech}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>

        {/* Floating particles effect on hover */}
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                initial={{ 
                  x: mousePosition.x, 
                  y: mousePosition.y, 
                  opacity: 0, 
                  scale: 0 
                }}
                animate={{ 
                  x: mousePosition.x + (Math.random() - 0.5) * 100,
                  y: mousePosition.y + (Math.random() - 0.5) * 100,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity 
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
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Success Stories
          </motion.h2>
          <motion.p 
            className="text-xl text-white/70 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            See how leading organizations are transforming with PulseOS.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
