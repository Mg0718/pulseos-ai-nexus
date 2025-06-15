
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Play, Copy, Star, Users, Clock, Zap } from "lucide-react";

const templates = [
  {
    id: 1,
    name: "Employee Onboarding",
    description: "Automated workflow for new employee setup including account creation, email setup, and welcome sequence",
    category: "HR",
    popularity: 4.8,
    uses: 234,
    estimatedTime: "2 hours",
    nodes: 8,
    preview: "New Employee → Create Accounts → Send Welcome Email → Assign Mentor → Schedule Training",
    tags: ["Popular", "HR", "Automation"]
  },
  {
    id: 2,
    name: "Invoice Reminder",
    description: "Send automated reminders for overdue invoices with escalation",
    category: "Finance",
    popularity: 4.6,
    uses: 187,
    estimatedTime: "30 mins",
    nodes: 6,
    preview: "Invoice Overdue → Wait 7 Days → Send Reminder → Wait 7 Days → Escalate",
    tags: ["Finance", "Automation"]
  },
  {
    id: 3,
    name: "Leave Approval",
    description: "Multi-step leave request approval with manager notifications",
    category: "HR",
    popularity: 4.7,
    uses: 156,
    estimatedTime: "1 hour",
    nodes: 7,
    preview: "Leave Request → Manager Approval → HR Review → Calendar Update → Notification",
    tags: ["HR", "Approval"]
  },
  {
    id: 4,
    name: "Customer Support Ticket",
    description: "Route support tickets based on priority and assign to teams",
    category: "Support",
    popularity: 4.5,
    uses: 123,
    estimatedTime: "45 mins",
    nodes: 9,
    preview: "New Ticket → Priority Check → Route to Team → SLA Timer → Escalation",
    tags: ["Support", "Routing"]
  },
  {
    id: 5,
    name: "Weekly Report Generation",
    description: "Generate and distribute weekly reports to stakeholders",
    category: "Analytics",
    popularity: 4.4,
    uses: 98,
    estimatedTime: "1.5 hours",
    nodes: 5,
    preview: "Schedule Weekly → Collect Data → Generate Report → Send to Stakeholders",
    tags: ["Analytics", "Reporting"]
  },
  {
    id: 6,
    name: "Project Milestone Alert",
    description: "Alert team when project milestones are reached or overdue",
    category: "Project Management",
    popularity: 4.3,
    uses: 76,
    estimatedTime: "1 hour",
    nodes: 6,
    preview: "Milestone Due → Check Status → Send Alert → Update Dashboard",
    tags: ["Projects", "Alerts"]
  }
];

const FlowTemplates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "HR", "Finance", "Support", "Analytics", "Project Management"];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const useTemplate = (template: any) => {
    console.log("Using template:", template);
    // TODO: Load template into canvas
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Flow Templates</h2>
          <p className="text-white/70">Pre-built workflows to get you started quickly</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Star className="w-4 h-4 mr-2" />
          Browse Community
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? "bg-purple-600 hover:bg-purple-700 whitespace-nowrap"
                  : "border-white/20 text-white hover:bg-white/10 whitespace-nowrap"
              }
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-2">{template.name}</CardTitle>
                    <p className="text-white/70 text-sm mb-3">{template.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      {template.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-white/20 text-white/80 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm">{template.popularity}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Flow Preview */}
                  <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-white/60 text-xs mb-1">Flow Preview:</div>
                    <div className="text-white text-sm font-mono">{template.preview}</div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-white/60 text-xs mb-1">
                        <Users className="w-3 h-3" />
                        Uses
                      </div>
                      <div className="text-white font-medium">{template.uses}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-white/60 text-xs mb-1">
                        <Clock className="w-3 h-3" />
                        Setup Time
                      </div>
                      <div className="text-white font-medium">{template.estimatedTime}</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-white/60 text-xs mb-1">
                        <Zap className="w-3 h-3" />
                        Nodes
                      </div>
                      <div className="text-white font-medium">{template.nodes}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => useTemplate(template)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white/40" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No templates found</h3>
          <p className="text-white/70">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default FlowTemplates;
