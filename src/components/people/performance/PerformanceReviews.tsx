
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Calendar, Users, TrendingUp, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface PerformanceReview {
  id: string;
  user_id: string;
  reviewer_id: string;
  review_period_start: string;
  review_period_end: string;
  overall_rating: number | null;
  goals_achievement_rating: number | null;
  competency_rating: number | null;
  feedback: string | null;
  development_plan: string | null;
  status: string;
  due_date: string | null;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string | null;
  job_title: string | null;
}

export const PerformanceReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [newReviewOpen, setNewReviewOpen] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    review_period_start: "",
    review_period_end: "",
    overall_rating: "",
    goals_achievement_rating: "",
    competency_rating: "",
    feedback: "",
    development_plan: "",
    due_date: ""
  });

  useEffect(() => {
    if (user) {
      fetchReviews();
      fetchProfiles();
    }
  }, [user]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('performance_reviews')
      .select('*')
      .or(`user_id.eq.${user?.id},reviewer_id.eq.${user?.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return;
    }

    setReviews(data || []);
  };

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, job_title');

    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }

    setProfiles(data || []);
  };

  const handleCreateReview = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('performance_reviews')
      .insert({
        ...formData,
        reviewer_id: user.id,
        overall_rating: formData.overall_rating ? parseFloat(formData.overall_rating) : null,
        goals_achievement_rating: formData.goals_achievement_rating ? parseFloat(formData.goals_achievement_rating) : null,
        competency_rating: formData.competency_rating ? parseFloat(formData.competency_rating) : null,
      });

    if (error) {
      toast.error('Failed to create review');
      return;
    }

    toast.success('Performance review created successfully');
    setNewReviewOpen(false);
    setFormData({
      user_id: "",
      review_period_start: "",
      review_period_end: "",
      overall_rating: "",
      goals_achievement_rating: "",
      competency_rating: "",
      feedback: "",
      development_plan: "",
      due_date: ""
    });
    fetchReviews();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'draft': return 'bg-gray-500';
      case 'approved': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-white/50">Not rated</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`}
          />
        ))}
        <span className="text-white ml-2">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const getProfileName = (userId: string) => {
    const profile = profiles.find(p => p.id === userId);
    return profile?.full_name || 'Unknown User';
  };

  const avgRating = reviews.length > 0 
    ? reviews.filter(r => r.overall_rating).reduce((sum, r) => sum + (r.overall_rating || 0), 0) / reviews.filter(r => r.overall_rating).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Performance Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Total Reviews</p>
                <p className="text-2xl font-bold text-white">{reviews.length}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Average Rating</p>
                <p className="text-2xl font-bold text-white">{avgRating.toFixed(1)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Pending Reviews</p>
                <p className="text-2xl font-bold text-white">
                  {reviews.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">This Quarter</p>
                <p className="text-2xl font-bold text-white">
                  {reviews.filter(r => {
                    const reviewDate = new Date(r.created_at);
                    const quarterStart = new Date();
                    quarterStart.setMonth(Math.floor(quarterStart.getMonth() / 3) * 3, 1);
                    return reviewDate >= quarterStart;
                  }).length}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Performance Reviews</h2>
        <Dialog open={newReviewOpen} onOpenChange={setNewReviewOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
              <Plus className="w-4 h-4 mr-2" />
              New Review
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/20 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Create Performance Review</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Employee</Label>
                  <Select value={formData.user_id} onValueChange={(value) => setFormData({...formData, user_id: value})}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {profiles.map(profile => (
                        <SelectItem key={profile.id} value={profile.id}>
                          {profile.full_name} - {profile.job_title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">Due Date</Label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Review Period Start</Label>
                  <Input
                    type="date"
                    value={formData.review_period_start}
                    onChange={(e) => setFormData({...formData, review_period_start: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Review Period End</Label>
                  <Input
                    type="date"
                    value={formData.review_period_end}
                    onChange={(e) => setFormData({...formData, review_period_end: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white">Overall Rating (1-5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.overall_rating}
                    onChange={(e) => setFormData({...formData, overall_rating: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Goals Achievement (1-5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.goals_achievement_rating}
                    onChange={(e) => setFormData({...formData, goals_achievement_rating: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white">Competency (1-5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.competency_rating}
                    onChange={(e) => setFormData({...formData, competency_rating: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Feedback</Label>
                <Textarea
                  value={formData.feedback}
                  onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-white">Development Plan</Label>
                <Textarea
                  value={formData.development_plan}
                  onChange={(e) => setFormData({...formData, development_plan: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  rows={3}
                />
              </div>

              <Button onClick={handleCreateReview} className="w-full bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                Create Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {getProfileName(review.user_id)}
                  </h3>
                  <p className="text-white/70">
                    Review Period: {new Date(review.review_period_start).toLocaleDateString()} - {new Date(review.review_period_end).toLocaleDateString()}
                  </p>
                  <p className="text-white/60 text-sm">
                    Reviewer: {getProfileName(review.reviewer_id)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(review.status)} text-white`}>
                    {review.status}
                  </Badge>
                  {review.due_date && (
                    <span className="text-white/60 text-sm">
                      Due: {new Date(review.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-white/70 text-sm mb-1">Overall Rating</p>
                  {renderStars(review.overall_rating)}
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Goals Achievement</p>
                  {renderStars(review.goals_achievement_rating)}
                </div>
                <div>
                  <p className="text-white/70 text-sm mb-1">Competency</p>
                  {renderStars(review.competency_rating)}
                </div>
              </div>

              {review.feedback && (
                <div className="mb-4">
                  <p className="text-white/70 text-sm mb-2">Feedback</p>
                  <p className="text-white bg-white/5 p-3 rounded-lg">{review.feedback}</p>
                </div>
              )}

              {review.development_plan && (
                <div>
                  <p className="text-white/70 text-sm mb-2">Development Plan</p>
                  <p className="text-white bg-white/5 p-3 rounded-lg">{review.development_plan}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
