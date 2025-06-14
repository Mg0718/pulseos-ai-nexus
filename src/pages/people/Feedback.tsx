
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, MessageSquare, TrendingUp, Eye, EyeOff, ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
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
  from_profile?: {
    full_name: string;
    avatar_url: string;
  };
  to_profile?: {
    full_name: string;
    avatar_url: string;
  };
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  job_title: string;
}

const Feedback = () => {
  const { user } = useAuth();
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    to_user_id: "",
    feedback_type: "peer",
    visibility: "open",
    title: "",
    content: "",
    is_anonymous: false,
  });

  useEffect(() => {
    fetchFeedbackData();
    fetchProfiles();
  }, [user]);

  const fetchFeedbackData = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id, full_name, avatar_url,
          feedback_given:feedback_entries!from_user_id(
            id, to_user_id, feedback_type, visibility, title, content, 
            sentiment_score, is_anonymous, created_at,
            to_profile:profiles!to_user_id(full_name, avatar_url)
          ),
          feedback_received:feedback_entries!to_user_id(
            id, from_user_id, feedback_type, visibility, title, content,
            sentiment_score, is_anonymous, created_at,
            from_profile:profiles!from_user_id(full_name, avatar_url)
          )
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      const allFeedback = [
        ...(data.feedback_given || []),
        ...(data.feedback_received || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setFeedbackEntries(allFeedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, job_title')
        .neq('id', user?.id);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('feedback_entries')
        .insert({
          from_user_id: user.id,
          ...newFeedback,
        });

      if (error) throw error;

      toast.success('Feedback submitted successfully!');
      setIsDialogOpen(false);
      setNewFeedback({
        to_user_id: "",
        feedback_type: "peer",
        visibility: "open",
        title: "",
        content: "",
        is_anonymous: false,
      });
      fetchFeedbackData();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-white">Loading feedback...</div>
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
              <h1 className="text-3xl font-bold text-white mb-2">360° Feedback</h1>
              <p className="text-white/70">Give and receive constructive feedback to grow together.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                  <Plus className="w-4 h-4 mr-2" />
                  Give Feedback
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Give Feedback</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipient">To</Label>
                    <Select
                      value={newFeedback.to_user_id}
                      onValueChange={(value) => setNewFeedback(prev => ({ ...prev, to_user_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.full_name} - {profile.job_title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="type">Feedback Type</Label>
                    <Select
                      value={newFeedback.feedback_type}
                      onValueChange={(value) => setNewFeedback(prev => ({ ...prev, feedback_type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="peer">Peer Feedback</SelectItem>
                        <SelectItem value="manager">Manager Feedback</SelectItem>
                        <SelectItem value="self">Self Assessment</SelectItem>
                        <SelectItem value="360">360 Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select
                      value={newFeedback.visibility}
                      onValueChange={(value) => setNewFeedback(prev => ({ ...prev, visibility: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="anonymous">Anonymous</SelectItem>
                        <SelectItem value="manager_only">Manager Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newFeedback.title}
                      onChange={(e) => setNewFeedback(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Brief feedback title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Feedback</Label>
                    <Textarea
                      id="content"
                      value={newFeedback.content}
                      onChange={(e) => setNewFeedback(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Share your constructive feedback..."
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="anonymous"
                      checked={newFeedback.is_anonymous}
                      onCheckedChange={(checked) => setNewFeedback(prev => ({ ...prev, is_anonymous: checked }))}
                    />
                    <Label htmlFor="anonymous">Submit anonymously</Label>
                  </div>

                  <Button
                    onClick={handleSubmitFeedback}
                    disabled={!newFeedback.to_user_id || !newFeedback.title || !newFeedback.content}
                    className="w-full bg-[#6F2DBD] hover:bg-[#6F2DBD]/80"
                  >
                    Submit Feedback
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feedback Statistics */}
          <div className="lg:col-span-1 space-y-6">
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
                    {feedbackEntries.filter(f => f.from_user_id === user?.id).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Received</span>
                  <span className="text-white font-semibold">
                    {feedbackEntries.filter(f => f.to_user_id === user?.id).length}
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
          </div>

          {/* Feedback Feed */}
          <div className="lg:col-span-2">
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
                            {!feedback.is_anonymous && (
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={feedback.from_profile?.avatar_url || feedback.to_profile?.avatar_url} />
                                <AvatarFallback>
                                  {(feedback.from_profile?.full_name || feedback.to_profile?.full_name)?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div>
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
                              <p className="text-sm text-white/60">
                                {format(new Date(feedback.created_at), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <h4 className="text-white font-medium mb-2">{feedback.title}</h4>
                        <p className="text-white/80 text-sm">{feedback.content}</p>
                      </motion.div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
