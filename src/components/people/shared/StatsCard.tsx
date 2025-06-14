
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
  color: string;
  delay?: number;
}

export const StatsCard = ({ title, value, trend, icon: Icon, color, delay = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm mb-1">{title}</p>
              <p className="text-2xl font-bold text-white">{value}</p>
              {trend && (
                <p className="text-green-400 text-sm">{trend}</p>
              )}
            </div>
            <Icon className={`w-8 h-8 ${color}`} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
