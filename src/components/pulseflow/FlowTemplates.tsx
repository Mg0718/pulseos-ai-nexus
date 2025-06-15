
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { workflowTemplates, WorkflowTemplate } from './WorkflowTemplates';
import WorkflowPreviewModal from './WorkflowPreviewModal';
import TemplateCard from './templates/TemplateCard';
import TemplateFilters from './templates/TemplateFilters';
import EmptyTemplateState from './templates/EmptyTemplateState';
import { getTemplateIcon, getTemplateColor, categories } from './templates/templateUtils';

interface FlowTemplatesProps {
  onUseTemplate?: (templateId: string) => void;
}

const FlowTemplates = ({ onUseTemplate }: FlowTemplatesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [previewTemplate, setPreviewTemplate] = useState<WorkflowTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const filteredTemplates = workflowTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: WorkflowTemplate) => {
    if (onUseTemplate) {
      onUseTemplate(template.id);
    }
    
    toast({
      title: "Template Loading",
      description: `Loading "${template.name}" template to the canvas...`,
    });
    
    setIsPreviewOpen(false);
  };

  const handlePreviewTemplate = (template: WorkflowTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
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
      <TemplateFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <EmptyTemplateState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTemplates.map((template, index) => (
            <TemplateCard
              key={template.id}
              template={template}
              index={index}
              onPreview={handlePreviewTemplate}
              onUseTemplate={handleUseTemplate}
              getTemplateIcon={getTemplateIcon}
              getTemplateColor={getTemplateColor}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      <WorkflowPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={previewTemplate}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
};

export default FlowTemplates;
