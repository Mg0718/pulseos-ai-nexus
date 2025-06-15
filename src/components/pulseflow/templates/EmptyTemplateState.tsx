
import { motion } from "framer-motion";
import { Filter } from "lucide-react";

const EmptyTemplateState = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <Filter className="w-12 h-12 text-white/40 mx-auto mb-4" />
      <h3 className="text-white text-lg font-medium mb-2">No templates found</h3>
      <p className="text-white/60">Try adjusting your search criteria or filters</p>
    </motion.div>
  );
};

export default EmptyTemplateState;
