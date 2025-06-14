
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";

interface LeaveBalance {
  leave_type: string;
  allocated_days: number;
  used_days: number;
  carried_over_days: number;
}

interface LeaveBalanceCardProps {
  leaveBalances: LeaveBalance[];
}

export const LeaveBalanceCard = ({ leaveBalances }: LeaveBalanceCardProps) => {
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
  );
};
