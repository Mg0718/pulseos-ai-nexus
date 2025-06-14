
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, TrendingUp, AlertTriangle, Smile, Frown } from "lucide-react";

interface MoraleOverviewCardsProps {
  averageMorale: number;
}

export const MoraleOverviewCards = ({ averageMorale }: MoraleOverviewCardsProps) => {
  const getMoraleColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMoraleIcon = (score: number) => {
    if (score >= 7) return <Smile className="w-5 h-5 text-green-400" />;
    if (score >= 4) return <Heart className="w-5 h-5 text-yellow-400" />;
    return <Frown className="w-5 h-5 text-red-400" />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Your Average</p>
                <p className={`text-2xl font-bold ${getMoraleColor(averageMorale)}`}>
                  {averageMorale.toFixed(1)}/10
                </p>
              </div>
              {getMoraleIcon(averageMorale)}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Team Average</p>
                <p className="text-2xl font-bold text-green-400">8.1/10</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">At Risk</p>
                <p className="text-2xl font-bold text-red-400">2</p>
                <p className="text-red-400 text-xs">members</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
