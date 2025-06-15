
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Star,
  X,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

const OKRNudges = ({ userId }: { userId: string }) => {
  const [nudges, setNudges] = useState<any[]>([]);

  useEffect(() => {
    fetchNudges();
  }, [userId]);

  const fetchNudges = async () => {
    const { data } = await supabase
      .from('okr_nudges')
      .select('*, okrs(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setNudges(data);
  };

  const acknowledgeNudge = async (nudgeId: string) => {
    await supabase
      .from('okr_nudges')
      .update({ acknowledged_at: new Date().toISOString() })
      .eq('id', nudgeId);
    
    fetchNudges();
  };

  const getNudgeIcon = (type: string) => {
    switch (type) {
      case 'reminder': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'suggestion': return <Brain className="w-4 h-4 text-purple-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'celebration': return <Star className="w-4 h-4 text-green-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNudgeColor = (type: string) => {
    switch (type) {
      case 'reminder': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'suggestion': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'celebration': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const unacknowledgedNudges = nudges.filter(n => !n.acknowledged_at);

  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Performance Nudges
          {unacknowledgedNudges.length > 0 && (
            <Badge className="bg-purple-500/20 text-purple-300 border-0">
              {unacknowledgedNudges.length} new
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {nudges.slice(0, 5).map((nudge, index) => (
            <motion.div
              key={nudge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getNudgeColor(nudge.nudge_type)} ${
                nudge.acknowledged_at ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getNudgeIcon(nudge.nudge_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs border-current">
                      {nudge.nudge_type}
                    </Badge>
                    {nudge.ai_generated && (
                      <Badge variant="outline" className="text-xs border-purple-400 text-purple-300">
                        <Brain className="w-3 h-3 mr-1" />
                        AI Generated
                      </Badge>
                    )}
                  </div>
                  <p className="text-white text-sm mb-2">{nudge.content}</p>
                  {nudge.okrs && (
                    <p className="text-gray-400 text-xs mb-3">
                      Related to: {nudge.okrs.title}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">
                      {new Date(nudge.created_at).toLocaleDateString()}
                    </span>
                    {!nudge.acknowledged_at ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 h-6 text-xs px-2"
                          onClick={() => acknowledgeNudge(nudge.id)}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Got it
                        </Button>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-xs border-green-400 text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Acknowledged
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {nudges.length === 0 && (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No AI nudges yet</p>
            <p className="text-gray-500 text-xs">AI will provide suggestions as you work on your OKRs</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OKRNudges;
