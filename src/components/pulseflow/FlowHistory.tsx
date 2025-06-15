
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Clock, CheckCircle, XCircle, AlertTriangle, Play, Eye, MoreVertical } from "lucide-react";

const executionHistory = [
  {
    id: 1,
    flowName: "Employee Onboarding",
    status: "completed",
    startTime: "2024-01-15T10:30:00Z",
    endTime: "2024-01-15T10:32:45Z",
    duration: "2m 45s",
    trigger: "New Employee: John Doe",
    steps: 8,
    completedSteps: 8,
    logs: [
      "Trigger: New employee detected",
      "Action: Created email account",
      "Action: Sent welcome email",
      "Action: Added to Slack workspace",
      "Completed successfully"
    ]
  },
  {
    id: 2,
    flowName: "Invoice Reminder",
    status: "running",
    startTime: "2024-01-15T14:15:00Z",
    endTime: null,
    duration: "1h 23m",
    trigger: "Invoice #1234 overdue",
    steps: 6,
    completedSteps: 3,
    logs: [
      "Trigger: Invoice overdue detected",
      "Delay: Waiting 7 days",
      "Action: Sent first reminder",
      "Currently executing..."
    ]
  },
  {
    id: 3,
    flowName: "Leave Approval",
    status: "failed",
    startTime: "2024-01-15T09:00:00Z",
    endTime: "2024-01-15T09:01:30Z",
    duration: "1m 30s",
    trigger: "Leave Request: Alice Smith",
    steps: 7,
    completedSteps: 3,
    error: "Manager email notification failed",
    logs: [
      "Trigger: Leave request submitted",
      "Action: Sent to manager",
      "Error: Email service unavailable",
      "Flow terminated"
    ]
  },
  {
    id: 4,
    flowName: "Weekly Report Generation",
    status: "completed",
    startTime: "2024-01-14T08:00:00Z",
    endTime: "2024-01-14T08:15:30Z",
    duration: "15m 30s",
    trigger: "Weekly schedule",
    steps: 5,
    completedSteps: 5,
    logs: [
      "Trigger: Weekly schedule activated",
      "Action: Collected analytics data",
      "Action: Generated PDF report",
      "Action: Sent to stakeholders",
      "Completed successfully"
    ]
  },
  {
    id: 5,
    flowName: "Customer Support Ticket",
    status: "completed",
    startTime: "2024-01-14T16:45:00Z",
    endTime: "2024-01-14T16:46:15Z",
    duration: "1m 15s",
    trigger: "New support ticket #5678",
    steps: 9,
    completedSteps: 9,
    logs: [
      "Trigger: New ticket created",
      "Condition: Priority check passed",
      "Action: Routed to technical team",
      "Action: Set SLA timer",
      "Completed successfully"
    ]
  }
];

const FlowHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedExecution, setSelectedExecution] = useState<any>(null);

  const statuses = ["all", "completed", "running", "failed"];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "running":
        return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "running":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "failed":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    }
  };

  const filteredHistory = executionHistory.filter(execution => {
    const matchesSearch = execution.flowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         execution.trigger.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || execution.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Execution History</h2>
          <p className="text-white/70">Track and monitor your workflow executions</p>
        </div>
        <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
          <Clock className="w-4 h-4 mr-2" />
          Real-time Monitor
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
          <Input
            placeholder="Search executions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
          />
        </div>
        <div className="flex gap-2">
          {statuses.map((status) => (
            <Button
              key={status}
              variant={selectedStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStatus(status)}
              className={
                selectedStatus === status
                  ? "bg-purple-600 hover:bg-purple-700 capitalize"
                  : "border-white/20 text-white hover:bg-white/10 capitalize"
              }
            >
              {status === "all" ? "All Status" : status}
            </Button>
          ))}
        </div>
      </div>

      {/* Execution List */}
      <div className="space-y-4">
        {filteredHistory.map((execution, index) => (
          <motion.div
            key={execution.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(execution.status)}
                      <h3 className="text-white font-semibold text-lg">{execution.flowName}</h3>
                      <Badge className={`${getStatusColor(execution.status)} border-0`}>
                        {execution.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-white/60 text-sm">Trigger</div>
                        <div className="text-white">{execution.trigger}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-sm">Started</div>
                        <div className="text-white">{formatDate(execution.startTime)}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-sm">Duration</div>
                        <div className="text-white">{execution.duration}</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-white/60">Progress</span>
                        <span className="text-white">{execution.completedSteps}/{execution.steps} steps</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            execution.status === 'completed' ? 'bg-green-500' :
                            execution.status === 'failed' ? 'bg-red-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${(execution.completedSteps / execution.steps) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Error Message */}
                    {execution.error && (
                      <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg mb-4">
                        <div className="flex items-center gap-2 text-red-300">
                          <XCircle className="w-4 h-4" />
                          <span className="font-medium">Error:</span>
                          <span>{execution.error}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedExecution(execution)}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {execution.status === 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Execution Details Modal */}
      {selectedExecution && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-b from-slate-900 to-purple-900 rounded-lg border border-white/20 p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white text-xl font-semibold">Execution Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedExecution(null)}
                className="text-white hover:bg-white/10"
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-white/60 text-sm">Flow Name</div>
                  <div className="text-white font-medium">{selectedExecution.flowName}</div>
                </div>
                <div>
                  <div className="text-white/60 text-sm">Status</div>
                  <Badge className={`${getStatusColor(selectedExecution.status)} border-0`}>
                    {selectedExecution.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <div className="text-white/60 text-sm mb-2">Execution Logs</div>
                <div className="bg-black/30 rounded-lg p-4 font-mono text-sm">
                  {selectedExecution.logs.map((log: string, index: number) => (
                    <div key={index} className="text-green-400 mb-1">
                      [{new Date().toLocaleTimeString()}] {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredHistory.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No executions found</h3>
          <p className="text-white/70">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default FlowHistory;
