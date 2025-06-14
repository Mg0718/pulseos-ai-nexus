
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MoraleOverviewCards } from "@/components/people/morale/MoraleOverviewCards";
import { MoraleTrendChart } from "@/components/people/morale/MoraleTrendChart";
import { TeamMoraleBreakdown } from "@/components/people/morale/TeamMoraleBreakdown";
import { RecentMoraleEntries } from "@/components/people/morale/RecentMoraleEntries";
import { MoraleSubmissionDialog } from "@/components/people/morale/MoraleSubmissionDialog";

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
            <MoraleSubmissionDialog onMoraleSubmitted={fetchMoraleData} />
          </div>
        </motion.div>

        <MoraleOverviewCards averageMorale={averageMorale} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MoraleTrendChart moraleEntries={moraleEntries} />
          <TeamMoraleBreakdown teamMorales={teamMorales} />
        </div>

        <RecentMoraleEntries moraleEntries={moraleEntries} />
      </div>
    </div>
  );
};

export default Morale;
