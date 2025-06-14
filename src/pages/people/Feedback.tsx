import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { FeedbackStats } from "@/components/people/feedback/FeedbackStats";
import { FeedbackForm } from "@/components/people/feedback/FeedbackForm";
import { FeedbackList } from "@/components/people/feedback/FeedbackList";
import { FeedbackMetrics } from "@/components/people/feedback/FeedbackMetrics";

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

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  job_title: string | null;
}

const Feedback = () => {
  const { user } = useAuth();
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedbackData();
    fetchProfiles();
  }, [user]);

  const fetchFeedbackData = async () => {
    if (!user) return;

    try {
      // Fetch feedback entries where user is involved
      const { data: givenFeedback, error: givenError } = await supabase
        .from('feedback_entries')
        .select('*')
        .eq('from_user_id', user.id)
        .order('created_at', { ascending: false });

      const { data: receivedFeedback, error: receivedError } = await supabase
        .from('feedback_entries')
        .select('*')
        .eq('to_user_id', user.id)
        .order('created_at', { ascending: false });

      if (givenError) throw givenError;
      if (receivedError) throw receivedError;

      const allFeedback = [
        ...(givenFeedback || []),
        ...(receivedFeedback || [])
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
            <FeedbackForm 
              profiles={profiles} 
              userId={user?.id} 
              onFeedbackSubmitted={fetchFeedbackData} 
            />
          </div>
        </motion.div>

        {/* Add Feedback Metrics */}
        <FeedbackMetrics />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feedback Statistics */}
          <div className="lg:col-span-1 space-y-6">
            <FeedbackStats feedbackEntries={feedbackEntries} userId={user?.id} />
          </div>

          {/* Feedback Feed */}
          <div className="lg:col-span-2">
            <FeedbackList feedbackEntries={feedbackEntries} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
