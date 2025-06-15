
import { useState } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star,
  Download,
  Eye,
  Clock,
  LucideIcon
} from "lucide-react";
import { WorkflowTemplate } from '../WorkflowTemplates';

interface TemplateCardProps {
  template: WorkflowTemplate;
  index: number;
  onPreview: (template: WorkflowTemplate) => void;
  onUseTemplate: (template: WorkflowTemplate) => void;
  getTemplateIcon: (category: string) => LucideIcon;
  getTemplateColor: (category: string) => string;
}

const TemplateCard = ({ 
  template, 
  index, 
  onPreview, 
  onUseTemplate, 
  getTemplateIcon, 
  getTemplateColor 
}: TemplateCardProps) => {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const IconComponent = getTemplateIcon(template.category);
  const colorClass = getTemplateColor(template.category);

  return (
    <motion.div
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

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreview(template)}
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Eye className="w-3 h-3 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={() => onUseTemplate(template)}
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
};

export default TemplateCard;
