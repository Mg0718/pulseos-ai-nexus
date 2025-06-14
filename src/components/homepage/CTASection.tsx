
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-32 px-6 relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-16 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[#6F2DBD]/20 via-transparent to-[#A663CC]/20"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto relative z-10">
            Join the revolution. Experience the future of business operations today.
          </p>
          <Button 
            asChild
            size="lg"
            className="group bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] hover:from-[#A663CC] hover:to-[#6F2DBD] text-white px-12 py-6 text-xl font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 relative z-10"
          >
            <Link to="/auth">
              <Zap className="w-6 h-6 mr-3 group-hover:animate-pulse" />
              Get Started Now
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;
