
import { useState } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Play,
  MoreHorizontal,
  Eye,
  RotateCcw,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const executionHistory = [
  {
    id: "exec_001",
    workflowName: "Employee Onboarding",
    status: "success",
    startTime: "2025-01-15T14:30:00Z",
    endTime: "2025-01-15T14:32:15Z",
    duration: "2m 15s",
    trigger: "New employee created",
    stepsCompleted: 5,
    totalSteps: 5,
    data: {
      employeeName: "Sarah Chen",
      department: "Engineering",
      startDate: "2025-01-20"
    }
  },
  {
    id: "exec_002",
    workflowName: "Invoice Processing",
    status: "failed",
    startTime: "2025-01-15T13:45:00Z",
    endTime: "2025-01-15T13:47:30Z",
    duration: "2m 30s",
    trigger: "Invoice received",
    stepsCompleted: 3,
    totalSteps: 5,
    error: "Payment gateway timeout",
    data: {
      invoiceNumber: "INV-2025-001",
      amount: "$2,450.00",
      vendor: "Acme Corp"
    }
  },
  {
    id: "exec_003",
    workflowName: "Support Ticket Routing",
    status: "success",
    startTime: "2025-01-15T12:15:00Z",
    endTime: "2025-01-15T12:15:45Z",
    duration: "45s",
    trigger: "New support ticket",
    stepsCompleted: 4,
    totalSteps: 4,
    data: {
      ticketId: "TKT-12345",
      priority: "High",
      assignedTo: "John Doe"
    }
  },
  {
    id: "exec_004",
    workflowName: "Meeting Scheduler",
    status: "running",
    startTime: "2025-01-15T15:20:00Z",
    endTime: null,
    duration: "Running...",
    trigger: "Meeting request",
    stepsCompleted: 2,
    totalSteps: 5,
    data: {
      requestedBy: "Alice Johnson",
      meetingType: "Project Review",
      attendees: 4
    }
  },
  {
    id: "exec_005",
    workflowName: "Document Approval",
    status: "success",
    startTime: "2025-01-15T11:00:00Z",
    endTime: "2025-01-15T11:05:30Z",
    duration: "5m 30s",
    trigger: "Document submitted",
    stepsCompleted: 6,
    totalSteps: 6,
    data: {
      documentName: "Q4 Budget Proposal",
      approver: "Finance Team",
      finalStatus: "Approved"
    }
  },
  {
    id: "exec_006",
    workflowName: "Lead Qualification",
    status: "warning",
    startTime: "2025-01-15T10:30:00Z",
    endTime: "2025-01-15T10:32:00Z",
    duration: "2m 0s",
    trigger: "Lead captured",
    stepsCompleted: 4,
    totalSteps: 5,
    warning: "Email delivery delayed",
    data: {
      leadName: "Tech Solutions Inc",
      score: 85,
      source: "Website Form"
    }
  }
];

const statusConfig = {
  success: {
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30"
  },
  failed: {
    icon: XCircle,
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30"
  },
  running: {
    icon: Play,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30"
  },
  warning: {
    icon: AlertCircle,
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/20",
    borderColor: "border-yellow-500/30"
  }
};

const FlowHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hoveredExecution, setHoveredExecution] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredHistory = executionHistory.filter(execution => {
    const matchesSearch = execution.workflowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         execution.trigger.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || execution.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleRetryExecution = (execution: any) => {
    toast({
      title: "Retrying Workflow",
      description: `Retrying "${execution.workflowName}" execution...`,
    });
  };

  const handleViewDetails = (execution: any) => {
    toast({
      title: "Execution Details",
      description: `Opening details for execution ${execution.id}...`,
    });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Execution History</h2>
          <p className="text-white/70">Track and monitor all workflow executions and their results</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Eye className="w-4 h-4 mr-2" />
            Live Monitor
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <Input
                placeholder="Search executions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {[
                { value: "all", label: "All Status" },
                { value: "success", label: "Success" },
                { value: "failed", label: "Failed" },
                { value: "running", label: "Running" },
                { value: "warning", label: "Warning" }
              ].map((status) => (
                <Button
                  key={status.value}
                  variant={statusFilter === status.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status.value)}
                  className={statusFilter === status.value 
                    ? "bg-purple-600 hover:bg-purple-700 text-white" 
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }
                >
                  <Filter className="w-3 h-3 mr-1" />
                  {status.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution List */}
      <div className="space-y-4">
        {filteredHistory.map((execution, index) => {
          const statusInfo = statusConfig[execution.status as keyof typeof statusConfig];
          const StatusIcon = statusInfo.icon;
          
          return (
            <motion.div
              key={execution.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredExecution(execution.id)}
              onHoverEnd={() => setHoveredExecution(null)}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                        <h3 className="text-white font-semibold text-lg">{execution.workflowName}</h3>
                        <Badge className={`${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} text-xs`}>
                          {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="border-white/20 text-white/60 text-xs">
                          {execution.id}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-white/60 text-sm">Trigger</p>
                          <p className="text-white text-sm font-medium">{execution.trigger}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Duration</p>
                          <p className="text-white text-sm font-medium">{execution.duration}</p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Progress</p>
                          <p className="text-white text-sm font-medium">
                            {execution.stepsCompleted}/{execution.totalSteps} steps
                          </p>
                        </div>
                        <div>
                          <p className="text-white/60 text-sm">Started</p>
                          <p className="text-white text-sm font-medium">
                            {formatTimestamp(execution.startTime)}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white/60 text-sm">Progress</span>
                          <span className="text-white/60 text-sm">
                            {Math.round((execution.stepsCompleted / execution.totalSteps) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              execution.status === 'success' ? 'bg-green-500' :
                              execution.status === 'failed' ? 'bg-red-500' :
                              execution.status === 'running' ? 'bg-blue-500' :
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${(execution.stepsCompleted / execution.totalSteps) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Error/Warning Message */}
                      {(execution.error || execution.warning) && (
                        <div className={`p-3 rounded-lg mb-4 ${
                          execution.error ? 'bg-red-500/20 border border-red-500/30' : 'bg-yellow-500/20 border border-yellow-500/30'
                        }`}>
                          <p className={`text-sm ${execution.error ? 'text-red-300' : 'text-yellow-300'}`}>
                            {execution.error || execution.warning}
                          </p>
                        </div>
                      )}

                      {/* Execution Data */}
                      <div className="bg-white/5 rounded-lg p-4">
                        <p className="text-white/80 text-sm font-medium mb-2">Execution Data:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {Object.entries(execution.data).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-white/60 text-xs uppercase tracking-wide">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="text-white text-sm">{value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(execution)}
                        className="text-white hover:bg-white/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {execution.status === 'failed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRetryExecution(execution)}
                          className="text-white hover:bg-white/10"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredHistory.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Calendar className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">No executions found</h3>
          <p className="text-white/60">Try adjusting your search criteria or create a workflow to see executions here</p>
        </motion.div>
      )}
    </div>
  );
};

export default FlowHistory;
