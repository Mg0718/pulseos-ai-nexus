
import { motion } from "framer-motion";

export const BlockchainHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h1 className="text-4xl font-bold text-white mb-2">Advanced Blockchain Finance</h1>
      <p className="text-white/70 text-lg">
        Smart contract automation with multi-sig security, ML analytics, and regulatory compliance
      </p>
    </motion.div>
  );
};
