
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface FeedbackEntry {
  id: string;
  from_user_id: string;
  to_user_id: string;
  created_at: string;
}

interface FeedbackStatsProps {
  feedbackEntries: FeedbackEntry[];
  userId: string | undefined;
}

export const FeedbackStats = ({ feedbackEntries, userId }: FeedbackStatsProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Feedback Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-white/70">Given</span>
          <span className="text-white font-semibold">
            {feedbackEntries.filter(f => f.from_user_id === userId).length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Received</span>
          <span className="text-white font-semibold">
            {feedbackEntries.filter(f => f.to_user_id === userId).length}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">This Month</span>
          <span className="text-white font-semibold">
            {feedbackEntries.filter(f => 
              new Date(f.created_at).getMonth() === new Date().getMonth()
            ).length}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
