
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Play, Pause, Square, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface TimeEntry {
  id: string;
  clock_in: string;
  clock_out: string | null;
  break_duration: number;
  overtime_hours: number;
  total_hours: number | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export const TimeTrackingDashboard = () => {
  const { user } = useAuth();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (user) {
      fetchTimeEntries();
      checkActiveEntry();
    }
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTimeEntries = async () => {
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching time entries:', error);
      return;
    }

    setTimeEntries(data || []);
  };

  const checkActiveEntry = async () => {
    const { data, error } = await supabase
      .from('time_entries')
      .select('*')
      .eq('status', 'active')
      .maybeSingle();

    if (error) {
      console.error('Error checking active entry:', error);
      return;
    }

    if (data) {
      setCurrentEntry(data);
      setIsWorking(true);
    }
  };

  const handleClockIn = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('time_entries')
      .insert({
        user_id: user.id,
        clock_in: new Date().toISOString(),
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to clock in');
      return;
    }

    setCurrentEntry(data);
    setIsWorking(true);
    toast.success('Clocked in successfully');
    fetchTimeEntries();
  };

  const handleClockOut = async () => {
    if (!currentEntry) return;

    const clockOut = new Date();
    const clockIn = new Date(currentEntry.clock_in);
    const totalHours = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60);
    const overtimeHours = Math.max(0, totalHours - 8);

    const { error } = await supabase
      .from('time_entries')
      .update({
        clock_out: clockOut.toISOString(),
        total_hours: totalHours,
        overtime_hours: overtimeHours,
        status: 'completed'
      })
      .eq('id', currentEntry.id);

    if (error) {
      toast.error('Failed to clock out');
      return;
    }

    setCurrentEntry(null);
    setIsWorking(false);
    toast.success('Clocked out successfully');
    fetchTimeEntries();
  };

  const getCurrentDuration = () => {
    if (!currentEntry) return "00:00:00";
    
    const now = currentTime;
    const clockIn = new Date(currentEntry.clock_in);
    const diff = now.getTime() - clockIn.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTotalHoursThisWeek = () => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return timeEntries
      .filter(entry => new Date(entry.created_at) >= startOfWeek && entry.total_hours)
      .reduce((total, entry) => total + (entry.total_hours || 0), 0);
  };

  return (
    <div className="space-y-6">
      {/* Current Session Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Current Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-mono text-white mb-2">
                {getCurrentDuration()}
              </div>
              <Badge 
                variant={isWorking ? "default" : "secondary"}
                className={isWorking ? "bg-green-500" : "bg-gray-500"}
              >
                {isWorking ? "Working" : "Not Working"}
              </Badge>
            </div>
            
            <div className="flex gap-2 justify-center">
              {!isWorking ? (
                <Button 
                  onClick={handleClockIn}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Clock In
                </Button>
              ) : (
                <Button 
                  onClick={handleClockOut}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Clock Out
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              This Week Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-white">
                <span>Total Hours:</span>
                <span className="font-semibold">{getTotalHoursThisWeek().toFixed(1)}h</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Days Worked:</span>
                <span className="font-semibold">
                  {timeEntries.filter(entry => {
                    const entryDate = new Date(entry.created_at);
                    const startOfWeek = new Date();
                    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                    return entryDate >= startOfWeek && entry.total_hours;
                  }).length}
                </span>
              </div>
              <div className="flex justify-between text-white">
                <span>Avg Hours/Day:</span>
                <span className="font-semibold">
                  {(getTotalHoursThisWeek() / Math.max(1, timeEntries.filter(entry => {
                    const entryDate = new Date(entry.created_at);
                    const startOfWeek = new Date();
                    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                    return entryDate >= startOfWeek && entry.total_hours;
                  }).length)).toFixed(1)}h
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Time Entries */}
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Time Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {timeEntries.map((entry) => (
              <div 
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="text-white">
                    <div className="font-medium">
                      {new Date(entry.clock_in).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-white/70">
                      {new Date(entry.clock_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {entry.clock_out && (
                        <> - {new Date(entry.clock_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">
                    {entry.total_hours ? `${entry.total_hours.toFixed(1)}h` : 'Active'}
                  </div>
                  {entry.overtime_hours > 0 && (
                    <div className="text-xs text-yellow-400">
                      +{entry.overtime_hours.toFixed(1)}h OT
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
