
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock } from "lucide-react";
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

interface LeaveRequestsListProps {
  leaveRequests: LeaveRequest[];
}

export const LeaveRequestsList = ({ leaveRequests }: LeaveRequestsListProps) => {
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

  return (
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
  );
};
