
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay, parseISO } from "date-fns";

interface LeaveEntry {
  id: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface LeaveCalendarViewProps {
  leaveEntries?: LeaveEntry[];
}

const mockLeaveEntries: LeaveEntry[] = [
  {
    id: "1",
    employee: "Sarah Chen",
    type: "vacation",
    startDate: "2024-12-25",
    endDate: "2024-12-29",
    status: "approved"
  },
  {
    id: "2",
    employee: "Marcus Johnson",
    type: "sick",
    startDate: "2024-12-15",
    endDate: "2024-12-15",
    status: "approved"
  },
];

export const LeaveCalendarView = ({ leaveEntries = mockLeaveEntries }: LeaveCalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getDayLeaves = (date: Date) => {
    return leaveEntries.filter(entry => {
      const start = parseISO(entry.startDate);
      const end = parseISO(entry.endDate);
      return date >= start && date <= end;
    });
  };

  const selectedDayLeaves = selectedDate ? getDayLeaves(selectedDate) : [];

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'vacation':
        return 'bg-blue-500/20 text-blue-400';
      case 'sick':
        return 'bg-red-500/20 text-red-400';
      case 'personal':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Leave Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="text-white"
            modifiers={{
              hasLeave: (date) => getDayLeaves(date).length > 0
            }}
            modifiersStyles={{
              hasLeave: { 
                backgroundColor: 'rgba(111, 45, 189, 0.3)',
                color: 'white',
                fontWeight: 'bold'
              }
            }}
          />
        </CardContent>
      </Card>

      <Card className="bg-white/10 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white">
            {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Select a date'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDayLeaves.length > 0 ? (
            <div className="space-y-3">
              {selectedDayLeaves.map((leave) => (
                <div
                  key={leave.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{leave.employee}</span>
                    <Badge className={getLeaveTypeColor(leave.type)}>
                      {leave.type}
                    </Badge>
                  </div>
                  <p className="text-white/70 text-sm">
                    {format(parseISO(leave.startDate), 'MMM dd')} - {format(parseISO(leave.endDate), 'MMM dd')}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/60">
              <p>No leaves scheduled for this date</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
