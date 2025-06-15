
import { motion } from "framer-motion";
import { Brain, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-xl flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Brain className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold text-white">PulseOS</span>
          </div>
          <Button 
            asChild
            className="group bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105"
          >
            <Link to="/dashboard">
              <LogIn className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
              Enter Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
