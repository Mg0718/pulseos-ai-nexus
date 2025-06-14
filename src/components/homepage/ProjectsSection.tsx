
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            See how leading organizations are transforming with PulseOS.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 10,
                rotateX: 5,
                z: 50
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="group cursor-pointer"
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:border-white/30 transition-all duration-500 overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-white/70 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-[#6F2DBD]/20 text-[#B9FAF8] border-[#6F2DBD]/30">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
