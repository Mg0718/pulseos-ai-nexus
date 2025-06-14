
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Heart, TrendingUp, TrendingDown, AlertTriangle, Smile, Frown, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MoraleEntry {
  id: string;
  user_id: string;
  team_id?: string;
  morale_score: number;
  sentiment: string;
  feedback_text?: string;
  created_at: string;
}

interface TeamMorale {
  team_name: string;
  avg_score: number;
  trend: number;
  member_count: number;
}

const Morale = () => {
  const { user } = useAuth();
  const [moraleEntries, setMoraleEntries] = useState<MoraleEntry[]>([]);
  const [teamMorales, setTeamMorales] = useState<TeamMorale[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMorale, setNewMorale] = useState({
    morale_score: [7],
    feedback_text: "",
  });

  useEffect(() => {
    fetchMoraleData();
  }, [user]);

  const fetchMoraleData = async () => {
    if (!user) return;

    try {
      // Fetch user's morale entries
      const { data: moraleData, error: moraleError } = await supabase
        .from('morale_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (moraleError) throw moraleError;

      // Fetch team morale data (this would require more complex queries in real implementation)
      const mockTeamData: TeamMorale[] = [
        { team_name: "Engineering", avg_score: 8.2, trend: 0.5, member_count: 12 },
        { team_name: "Product", avg_score: 7.8, trend: -0.2, member_count: 8 },
        { team_name: "Design", avg_score: 8.5, trend: 0.8, member_count: 6 },
        { team_name: "Marketing", avg_score: 7.2, trend: -0.5, member_count: 5 },
      ];

      setMoraleEntries(moraleData || []);
      setTeamMorales(mockTeamData);
    } catch (error) {
      console.error('Error fetching morale data:', error);
      toast.error('Failed to load morale data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMorale = async () => {
    if (!user) return;

    try {
      const sentiment = newMorale.morale_score[0] >= 8 ? 'very_positive' :
                      newMorale.morale_score[0] >= 6 ? 'positive' :
                      newMorale.morale_score[0] >= 4 ? 'neutral' :
                      newMorale.morale_score[0] >= 2 ? 'negative' : 'very_negative';

      const { error } = await supabase
        .from('morale_entries')
        .insert({
          user_id: user.id,
          morale_score: newMorale.morale_score[0],
          sentiment,
          feedback_text: newMorale.feedback_text || null,
        });

      if (error) throw error;

      toast.success('Morale feedback submitted successfully!');
      setIsDialogOpen(false);
      setNewMorale({
        morale_score: [7],
        feedback_text: "",
      });
      fetchMoraleData();
    } catch (error) {
      console.error('Error submitting morale:', error);
      toast.error('Failed to submit morale feedback');
    }
  };

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

  const chartData = moraleEntries.map((entry, index) => ({
    date: format(new Date(entry.created_at), 'MMM dd'),
    score: entry.morale_score,
    index,
  })).reverse();

  const averageMorale = moraleEntries.length > 0 
    ? moraleEntries.reduce((sum, entry) => sum + entry.morale_score, 0) / moraleEntries.length
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-white">Loading morale data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Team Morale</h1>
              <p className="text-white/70">Track wellbeing and happiness across teams.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Morale
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>How are you feeling today?</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <Label>Morale Score (1-10)</Label>
                    <div className="mt-4 mb-2">
                      <Slider
                        value={newMorale.morale_score}
                        onValueChange={(value) => setNewMorale(prev => ({ ...prev, morale_score: value }))}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-white/60">
                      <span>Very Low</span>
                      <span className={`font-semibold ${getMoraleColor(newMorale.morale_score[0])}`}>
                        {newMorale.morale_score[0]}/10
                      </span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="feedback">What's affecting your mood? (Optional)</Label>
                    <Textarea
                      id="feedback"
                      value={newMorale.feedback_text}
                      onChange={(e) => setNewMorale(prev => ({ ...prev, feedback_text: e.target.value }))}
                      placeholder="Share what's on your mind..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <Button
                    onClick={handleSubmitMorale}
                    className="w-full bg-[#6F2DBD] hover:bg-[#6F2DBD]/80"
                  >
                    Submit Morale Check
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Overview Cards */}
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Morale Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Your Morale Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis domain={[1, 10]} stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F9FAFB'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#6F2DBD" 
                        fill="#6F2DBD" 
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-white/60">
                    No morale data yet. Log your first entry!
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Team Morale Breakdown */}
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
        </div>

        {/* Recent Morale Entries */}
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
      </div>
    </div>
  );
};

export default Morale;
