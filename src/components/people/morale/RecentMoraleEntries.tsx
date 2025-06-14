
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Smile, Frown } from "lucide-react";
import { format } from "date-fns";

interface MoraleEntry {
  id: string;
  user_id: string;
  team_id?: string;
  morale_score: number;
  sentiment: string;
  feedback_text?: string;
  created_at: string;
}

interface RecentMoraleEntriesProps {
  moraleEntries: MoraleEntry[];
}

export const RecentMoraleEntries = ({ moraleEntries }: RecentMoraleEntriesProps) => {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-8"
    >
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Recent Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {moraleEntries.length === 0 ? (
              <div className="text-center py-8 text-white/70">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No morale entries yet.</p>
                <p className="text-sm">Start tracking your wellbeing!</p>
              </div>
            ) : (
              moraleEntries.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex-shrink-0">
                    {getMoraleIcon(entry.morale_score)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getMoraleColor(entry.morale_score)}>
                        {entry.morale_score}/10
                      </Badge>
                      <span className="text-sm text-white/60">
                        {format(new Date(entry.created_at), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    {entry.feedback_text && (
                      <p className="text-white/80 text-sm">{entry.feedback_text}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
