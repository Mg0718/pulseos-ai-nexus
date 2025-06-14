
import { motion } from "framer-motion";
import { Brain, Users, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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

const FeaturesSection = () => {
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
              whileHover={{ scale: 1.05, y: -10, rotateY: 5 }}
              className="group"
            >
              <Card className="bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 h-full overflow-hidden">
                <CardContent className="p-8 relative">
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ transform: "translateX(-100%)" }}
                    animate={{ transform: "translateX(100%)" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
