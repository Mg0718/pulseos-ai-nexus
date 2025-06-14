
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface MoraleTrendChartProps {
  moraleEntries: MoraleEntry[];
}

export const MoraleTrendChart = ({ moraleEntries }: MoraleTrendChartProps) => {
  const chartData = moraleEntries.map((entry, index) => ({
    date: new Date(entry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: entry.morale_score,
    index,
  })).reverse();

  return (
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
  );
};
