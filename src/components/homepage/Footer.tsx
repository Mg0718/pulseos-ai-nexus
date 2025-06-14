
import { motion } from "framer-motion";
import { Brain } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-white">PulseOS</span>
          </div>
          <motion.p 
            className="text-white/60 text-center md:text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            © 2024 PulseOS. All rights reserved. Transforming business, one pulse at a time.
          </motion.p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
