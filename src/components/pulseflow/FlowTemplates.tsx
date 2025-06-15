
import { useState } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Users, 
  DollarSign, 
  Mail, 
  Calendar,
  FileText,
  Zap,
  Star,
  Download,
  Eye,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const templates = [
  {
    id: 1,
    name: "Employee Onboarding",
    description: "Automate the complete employee onboarding process from welcome email to account setup",
    category: "HR",
    icon: Users,
    color: "bg-blue-600",
    complexity: "Medium",
    estimatedTime: "30 min",
    rating: 4.8,
    downloads: 1247,
    steps: [
      "New employee trigger",
      "Send welcome email",
      "Create accounts",
      "Schedule orientation",
      "Send equipment checklist"
    ],
    integrations: ["Gmail", "Slack", "BambooHR", "Office 365"]
  },
  {
    id: 2,
    name: "Invoice Processing",
    description: "Smart invoice approval workflow with automatic routing and payment processing",
    category: "Finance",
    icon: DollarSign,
    color: "bg-green-600",
    complexity: "Advanced",
    estimatedTime: "45 min",
    rating: 4.9,
    downloads: 892,
    steps: [
      "Invoice received",
      "Extract data with AI",
      "Route for approval",
      "Process payment",
      "Update accounting"
    ],
    integrations: ["QuickBooks", "Stripe", "DocuSign", "Slack"]
  },
  {
    id: 3,
    name: "Customer Support Ticket",
    description: "Route and escalate support tickets based on priority and department",
    category: "Support",
    icon: Mail,
    color: "bg-purple-600",
    complexity: "Simple",
    estimatedTime: "15 min",
    rating: 4.6,
    downloads: 2156,
    steps: [
      "Ticket received",
      "Categorize with AI",
      "Assign to agent",
      "Set priority",
      "Send confirmation"
    ],
    integrations: ["Zendesk", "Intercom", "Slack", "Teams"]
  },
  {
    id: 4,
    name: "Meeting Scheduler",
    description: "Automatically schedule meetings and send calendar invites with availability checks",
    category: "Productivity",
    icon: Calendar,
    color: "bg-orange-600",
    complexity: "Medium",
    estimatedTime: "25 min",
    rating: 4.7,
    downloads: 634,
    steps: [
      "Meeting request",
      "Check availability",
      "Find optimal time",
      "Send calendar invite",
      "Set up meeting room"
    ],
    integrations: ["Google Calendar", "Outlook", "Zoom", "Teams"]
  },
  {
    id: 5,
    name: "Document Approval",
    description: "Multi-stage document review and approval process with version control",
    category: "Legal",
    icon: FileText,
    color: "bg-indigo-600",
    complexity: "Advanced",
    estimatedTime: "40 min",
    rating: 4.5,
    downloads: 423,
    steps: [
      "Document submitted",
      "Route to reviewers",
      "Collect feedback",
      "Consolidate changes",
      "Final approval"
    ],
    integrations: ["DocuSign", "SharePoint", "Google Drive", "Slack"]
  },
  {
    id: 6,
    name: "Lead Qualification",
    description: "Score and qualify leads automatically based on behavior and demographics",
    category: "Sales",
    icon: Zap,
    color: "bg-yellow-600",
    complexity: "Medium",
    estimatedTime: "35 min",
    rating: 4.8,
    downloads: 756,
    steps: [
      "Lead captured",
      "Score lead",
      "Enrich data",
      "Assign to sales",
      "Send follow-up"
    ],
    integrations: ["Salesforce", "HubSpot", "Marketo", "LinkedIn"]
  }
];

const categories = ["All", "HR", "Finance", "Support", "Productivity", "Legal", "Sales"];
const complexityLevels = ["All", "Simple", "Medium", "Advanced"];

const FlowTemplates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedComplexity, setSelectedComplexity] = useState("All");
  const [hoveredTemplate, setHoveredTemplate] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    const matchesComplexity = selectedComplexity === "All" || template.complexity === selectedComplexity;
    
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  const handleUseTemplate = (template: any) => {
    toast({
      title: "Template Loading",
      description: `Loading "${template.name}" template to the canvas...`,
    });
    
    // Simulate loading template
    setTimeout(() => {
      toast({
        title: "Template Loaded",
        description: `"${template.name}" is now ready for customization.`,
      });
    }, 2000);
  };

  const handlePreviewTemplate = (template: any) => {
    toast({
      title: "Template Preview",
      description: `Opening preview for "${template.name}"...`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Workflow Templates</h2>
          <p className="text-white/70">Choose from pre-built automation templates to get started quickly</p>
        </div>
        <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30 w-fit">
          {filteredTemplates.length} Templates
        </Badge>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-purple-600 hover:bg-purple-700 text-white" 
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Complexity Filter */}
            <div className="flex gap-2">
              {complexityLevels.map((complexity) => (
                <Button
                  key={complexity}
                  variant={selectedComplexity === complexity ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedComplexity(complexity)}
                  className={selectedComplexity === complexity 
                    ? "bg-purple-600 hover:bg-purple-700 text-white" 
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }
                >
                  <Filter className="w-3 h-3 mr-1" />
                  {complexity}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onHoverStart={() => setHoveredTemplate(template.id)}
            onHoverEnd={() => setHoveredTemplate(null)}
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group h-full">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 ${template.color} rounded-xl flex items-center justify-center transition-transform duration-300 ${hoveredTemplate === template.id ? 'scale-110' : ''}`}>
                    <template.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm">{template.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-white text-lg group-hover:text-purple-300 transition-colors">
                    {template.name}
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className="border-white/20 text-white/60 text-xs"
                  >
                    {template.category}
                  </Badge>
                </div>
                
                <CardDescription className="text-white/70">
                  {template.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-white/60">
                    <Clock className="w-3 h-3" />
                    {template.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1 text-white/60">
                    <Download className="w-3 h-3" />
                    {template.downloads}
                  </div>
                  <Badge 
                    className={
                      template.complexity === 'Simple' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                      template.complexity === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                      'bg-red-500/20 text-red-300 border-red-500/30'
                    }
                  >
                    {template.complexity}
                  </Badge>
                </div>

                {/* Steps Preview */}
                <div>
                  <p className="text-white/80 text-sm font-medium mb-2">Workflow Steps:</p>
                  <div className="space-y-1">
                    {template.steps.slice(0, 3).map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-white/60">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                        {step}
                      </div>
                    ))}
                    {template.steps.length > 3 && (
                      <p className="text-purple-300 text-xs">+{template.steps.length - 3} more steps</p>
                    )}
                  </div>
                </div>

                {/* Integrations */}
                <div>
                  <p className="text-white/80 text-sm font-medium mb-2">Integrations:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.integrations.slice(0, 3).map((integration) => (
                      <Badge 
                        key={integration}
                        className="bg-white/10 text-white/70 border-white/20 text-xs"
                      >
                        {integration}
                      </Badge>
                    ))}
                    {template.integrations.length > 3 && (
                      <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30 text-xs">
                        +{template.integrations.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreviewTemplate(template)}
                    className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Filter className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <h3 className="text-white text-lg font-medium mb-2">No templates found</h3>
          <p className="text-white/60">Try adjusting your search criteria or filters</p>
        </motion.div>
      )}
    </div>
  );
};

export default FlowTemplates;
