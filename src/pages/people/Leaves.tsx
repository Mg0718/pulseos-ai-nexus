
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar as CalendarIcon, Clock, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

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
      // Fetch leave requests
      const { data: requests, error: requestsError } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Fetch leave balances
      const { data: balances, error: balancesError } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('user_id', user.id)
        .eq('year', new Date().getFullYear());

      if (balancesError) throw balancesError;

      setLeaveRequests(requests || []);
      setLeaveBalances(balances || []);
    } catch (error) {
      console.error('Error fetching leave data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'vacation':
        return 'bg-blue-500/20 text-blue-400';
      case 'sick':
        return 'bg-red-500/20 text-red-400';
      case 'personal':
        return 'bg-purple-500/20 text-purple-400';
      case 'maternity':
      case 'paternity':
        return 'bg-pink-500/20 text-pink-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
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
            <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
              <Plus className="w-4 h-4 mr-2" />
              Request Leave
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leave Balances */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5" />
                  Leave Balances
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {leaveBalances.map((balance) => {
                  const remaining = balance.allocated_days + balance.carried_over_days - balance.used_days;
                  return (
                    <div key={balance.leave_type} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-white capitalize">{balance.leave_type}</span>
                        <Badge className={getLeaveTypeColor(balance.leave_type)}>
                          {remaining} days left
                        </Badge>
                      </div>
                      <div className="text-sm text-white/70">
                        <p>Allocated: {balance.allocated_days} days</p>
                        <p>Used: {balance.used_days} days</p>
                        {balance.carried_over_days > 0 && (
                          <p>Carried over: {balance.carried_over_days} days</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

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
            <Card className="bg-white/10 backdrop-blur-xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Recent Leave Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.length === 0 ? (
                    <div className="text-center py-8 text-white/70">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No leave requests found.</p>
                      <p className="text-sm">Click "Request Leave" to submit your first request.</p>
                    </div>
                  ) : (
                    leaveRequests.map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <Badge className={getLeaveTypeColor(request.leave_type)}>
                              {request.leave_type}
                            </Badge>
                            <Badge variant="outline" className={getStatusColor(request.status)}>
                              {getStatusIcon(request.status)}
                              <span className="ml-1 capitalize">{request.status}</span>
                            </Badge>
                          </div>
                          <span className="text-sm text-white/60">
                            {format(new Date(request.created_at), 'MMM dd, yyyy')}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-white/70">Start Date</p>
                            <p className="text-white">{format(new Date(request.start_date), 'MMM dd, yyyy')}</p>
                          </div>
                          <div>
                            <p className="text-sm text-white/70">End Date</p>
                            <p className="text-white">{format(new Date(request.end_date), 'MMM dd, yyyy')}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-sm text-white/70">Duration</p>
                          <p className="text-white">{request.days_requested} days</p>
                        </div>

                        {request.reason && (
                          <div>
                            <p className="text-sm text-white/70">Reason</p>
                            <p className="text-white/90">{request.reason}</p>
                          </div>
                        )}
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

export default Leaves;
