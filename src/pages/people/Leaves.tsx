
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LeaveRequestDialog } from "@/components/people/leaves/LeaveRequestDialog";
import { LeaveBalanceCard } from "@/components/people/leaves/LeaveBalanceCard";
import { LeaveRequestsList } from "@/components/people/leaves/LeaveRequestsList";

interface LeaveRequest {
  id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason: string;
  status: string;
  created_at: string;
}

interface LeaveBalance {
  leave_type: string;
  allocated_days: number;
  used_days: number;
  carried_over_days: number;
}

const Leaves = () => {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveData();
  }, [user]);

  const fetchLeaveData = async () => {
    if (!user) return;

    try {
      // Mock data for now since we have table issues
      const mockRequests: LeaveRequest[] = [
        {
          id: "1",
          leave_type: "vacation",
          start_date: "2024-12-25",
          end_date: "2024-12-29",
          days_requested: 5,
          reason: "Holiday vacation",
          status: "pending",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          leave_type: "sick",
          start_date: "2024-12-15",
          end_date: "2024-12-15",
          days_requested: 1,
          reason: "Medical appointment",
          status: "approved",
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      const mockBalances: LeaveBalance[] = [
        { leave_type: "vacation", allocated_days: 15, used_days: 5, carried_over_days: 2 },
        { leave_type: "sick", allocated_days: 10, used_days: 1, carried_over_days: 0 },
        { leave_type: "personal", allocated_days: 5, used_days: 0, carried_over_days: 1 },
      ];

      setLeaveRequests(mockRequests);
      setLeaveBalances(mockBalances);
    } catch (error) {
      console.error('Error fetching leave data:', error);
      toast.error('Failed to load leave data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSubmitted = (newRequest: LeaveRequest) => {
    setLeaveRequests(prev => [newRequest, ...prev]);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-white">Loading...</div>
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
              <h1 className="text-3xl font-bold text-white mb-2">Leave Management</h1>
              <p className="text-white/70">Track your time off and leave balances.</p>
            </div>
            <LeaveRequestDialog onRequestSubmitted={handleRequestSubmitted} />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Balances */}
          <div className="lg:col-span-1 space-y-6">
            <LeaveBalanceCard leaveBalances={leaveBalances} />

            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="text-white"
                />
              </CardContent>
            </Card>
          </div>

          {/* Leave Requests */}
          <div className="lg:col-span-2">
            <LeaveRequestsList leaveRequests={leaveRequests} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaves;
