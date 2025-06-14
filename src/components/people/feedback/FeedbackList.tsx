
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, ThumbsDown, Eye, EyeOff } from "lucide-react";
import { format } from "date-fns";

interface FeedbackEntry {
  id: string;
  from_user_id: string;
  to_user_id: string;
  feedback_type: string;
  visibility: string;
  title: string;
  content: string;
  sentiment_score: string | null;
  is_anonymous: boolean;
  created_at: string;
}

interface FeedbackListProps {
  feedbackEntries: FeedbackEntry[];
}

export const FeedbackList = ({ feedbackEntries }: FeedbackListProps) => {
  const getSentimentIcon = (sentiment: string | null) => {
    switch (sentiment) {
      case 'very_positive':
      case 'positive':
        return <ThumbsUp className="w-4 h-4 text-green-400" />;
      case 'very_negative':
      case 'negative':
        return <ThumbsDown className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getSentimentColor = (sentiment: string | null) => {
    switch (sentiment) {
      case 'very_positive':
        return 'bg-green-500/20 text-green-400';
      case 'positive':
        return 'bg-green-500/20 text-green-400';
      case 'neutral':
        return 'bg-gray-500/20 text-gray-400';
      case 'negative':
        return 'bg-red-500/20 text-red-400';
      case 'very_negative':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Recent Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedbackEntries.length === 0 ? (
            <div className="text-center py-8 text-white/70">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No feedback yet.</p>
              <p className="text-sm">Start by giving feedback to your colleagues!</p>
            </div>
          ) : (
            feedbackEntries.map((feedback) => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#6F2DBD]/20 text-purple-300">
                        {feedback.feedback_type}
                      </Badge>
                      {feedback.sentiment_score && (
                        <Badge className={getSentimentColor(feedback.sentiment_score)}>
                          {getSentimentIcon(feedback.sentiment_score)}
                          <span className="ml-1">{feedback.sentiment_score}</span>
                        </Badge>
                      )}
                      {feedback.visibility === 'anonymous' && (
                        <EyeOff className="w-4 h-4 text-white/60" />
                      )}
                      {feedback.visibility === 'manager_only' && (
                        <Eye className="w-4 h-4 text-white/60" />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-white/60">
                    {format(new Date(feedback.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>
                
                <h4 className="text-white font-medium mb-2">{feedback.title}</h4>
                <p className="text-white/80 text-sm">{feedback.content}</p>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
