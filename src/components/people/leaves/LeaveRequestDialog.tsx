
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { differenceInDays } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

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

interface LeaveRequestDialogProps {
  onRequestSubmitted: (request: LeaveRequest) => void;
}

export const LeaveRequestDialog = ({ onRequestSubmitted }: LeaveRequestDialogProps) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  const handleSubmitRequest = async () => {
    if (!user || !newRequest.leave_type || !newRequest.start_date || !newRequest.end_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const startDate = new Date(newRequest.start_date);
      const endDate = new Date(newRequest.end_date);
      const days = differenceInDays(endDate, startDate) + 1;

      const mockRequest: LeaveRequest = {
        id: String(Date.now()),
        leave_type: newRequest.leave_type,
        start_date: newRequest.start_date,
        end_date: newRequest.end_date,
        days_requested: days,
        reason: newRequest.reason,
        status: 'pending',
        created_at: new Date().toISOString(),
      };

      onRequestSubmitted(mockRequest);
      toast.success('Leave request submitted successfully!');
      setIsDialogOpen(false);
      setNewRequest({
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: "",
      });
    } catch (error) {
      console.error('Error submitting leave request:', error);
      toast.error('Failed to submit leave request');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
          <Plus className="w-4 h-4 mr-2" />
          Request Leave
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="leave_type">Leave Type</Label>
            <Select
              value={newRequest.leave_type}
              onValueChange={(value) => setNewRequest(prev => ({ ...prev, leave_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
                <SelectItem value="maternity">Maternity Leave</SelectItem>
                <SelectItem value="paternity">Paternity Leave</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={newRequest.start_date}
                onChange={(e) => setNewRequest(prev => ({ ...prev, start_date: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={newRequest.end_date}
                onChange={(e) => setNewRequest(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={newRequest.reason}
              onChange={(e) => setNewRequest(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Brief reason for leave..."
              rows={3}
            />
          </div>

          <Button
            onClick={handleSubmitRequest}
            disabled={!newRequest.leave_type || !newRequest.start_date || !newRequest.end_date}
            className="w-full bg-[#6F2DBD] hover:bg-[#6F2DBD]/80"
          >
            Submit Request
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
