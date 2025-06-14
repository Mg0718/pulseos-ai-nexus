
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TeamMorale {
  team_name: string;
  avg_score: number;
  trend: number;
  member_count: number;
}

interface TeamMoraleBreakdownProps {
  teamMorales: TeamMorale[];
}

export const TeamMoraleBreakdown = ({ teamMorales }: TeamMoraleBreakdownProps) => {
  const getMoraleColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Team Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMorales.map((team) => (
              <div key={team.team_name} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{team.team_name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${getMoraleColor(team.avg_score)}`}>
                        {team.avg_score.toFixed(1)}
                      </span>
                      {team.trend > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                  </div>
                  <Progress 
                    value={(team.avg_score / 10) * 100} 
                    className="h-2"
                  />
                  <p className="text-xs text-white/60 mt-1">
                    {team.member_count} members
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
