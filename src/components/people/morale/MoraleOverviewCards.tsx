
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, TrendingUp, AlertTriangle, Smile, Frown, Users } from "lucide-react";

interface MoraleOverviewCardsProps {
  averageMorale: number;
  teamAverage?: number;
  atRiskCount?: number;
}

export const MoraleOverviewCards = ({ 
  averageMorale, 
  teamAverage = 8.1, 
  atRiskCount = 2 
}: MoraleOverviewCardsProps) => {
  const getMoraleColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getMoraleIcon = (score: number) => {
    if (score >= 7) return <Smile className="w-8 h-8 text-green-400" />;
    if (score >= 4) return <Heart className="w-8 h-8 text-yellow-400" />;
    return <Frown className="w-8 h-8 text-red-400" />;
  };

  const getTrendColor = (current: number, comparison: number) => {
    if (current > comparison) return 'text-green-400';
    if (current < comparison) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Your Average</p>
                <p className={`text-3xl font-bold ${getMoraleColor(averageMorale)}`}>
                  {averageMorale.toFixed(1)}/10
                </p>
                <p className={`text-sm ${getTrendColor(averageMorale, 7)}`}>
                  {averageMorale > 7 ? '+' : ''}{(averageMorale - 7).toFixed(1)} from baseline
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
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Team Average</p>
                <p className="text-3xl font-bold text-green-400">{teamAverage}/10</p>
                <p className="text-green-400 text-sm">↗ +0.3 this week</p>
              </div>
              <div className="relative">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <Users className="w-4 h-4 text-green-400 absolute -bottom-1 -right-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Needs Attention</p>
                <p className="text-3xl font-bold text-red-400">{atRiskCount}</p>
                <p className="text-red-400 text-xs">team members</p>
              </div>
              <div className="relative">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                {atRiskCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
