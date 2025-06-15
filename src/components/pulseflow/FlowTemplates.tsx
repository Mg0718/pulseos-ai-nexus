
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
import { workflowTemplates, getTemplateByCategory, getTemplateById } from './WorkflowTemplates';

const categories = ["All", "HR", "Finance", "Support", "Productivity", "Legal", "Sales"];
const complexityLevels = ["All", "Simple", "Medium", "Advanced"];

interface FlowTemplatesProps {
  onUseTemplate?: (templateId: string) => void;
}

const FlowTemplates = ({ onUseTemplate }: FlowTemplatesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedComplexity, setSelectedComplexity] = useState("All");
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredTemplates = workflowTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: any) => {
    if (onUseTemplate) {
      onUseTemplate(template.id);
    }
    
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
    }, 1000);
  };

  const handlePreviewTemplate = (template: any) => {
    toast({
      title: "Template Preview",
      description: `"${template.name}" - ${template.nodes.length} nodes, ${template.edges.length} connections`,
    });
  };

  const getTemplateIcon = (category: string) => {
    switch (category) {
      case 'HR': return Users;
      case 'Finance': return DollarSign;
      case 'Support': return Mail;
      case 'Productivity': return Calendar;
      case 'Legal': return FileText;
      case 'Sales': return Zap;
      default: return FileText;
    }
  };

  const getTemplateColor = (category: string) => {
    switch (category) {
      case 'HR': return 'bg-blue-600';
      case 'Finance': return 'bg-green-600';
      case 'Support': return 'bg-purple-600';
      case 'Productivity': return 'bg-orange-600';
      case 'Legal': return 'bg-indigo-600';
      case 'Sales': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
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
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => {
          const IconComponent = getTemplateIcon(template.category);
          const colorClass = getTemplateColor(template.category);
          
          return (
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
                    <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center transition-transform duration-300 ${hoveredTemplate === template.id ? 'scale-110' : ''}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">4.8</span>
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
                      {template.nodes.length} nodes
                    </div>
                    <div className="flex items-center gap-1 text-white/60">
                      <Download className="w-3 h-3" />
                      {template.edges.length} connections
                    </div>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      Ready
                    </Badge>
                  </div>

                  {/* Steps Preview */}
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-2">Workflow Steps:</p>
                    <div className="space-y-1">
                      {template.nodes.slice(0, 3).map((node, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-white/60">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          {node.data.label}
                        </div>
                      ))}
                      {template.nodes.length > 3 && (
                        <p className="text-purple-300 text-xs">+{template.nodes.length - 3} more steps</p>
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
          );
        })}
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
