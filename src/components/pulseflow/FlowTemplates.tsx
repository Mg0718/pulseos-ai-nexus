
import { useState } from 'react';
import { WorkflowTemplates, WorkflowTemplate } from './WorkflowTemplates';
import TemplateFilters from './templates/TemplateFilters';
import TemplateCard from './templates/TemplateCard';
import WorkflowPreviewModal from './WorkflowPreviewModal';
import { 
  Mail, 
  Database, 
  Webhook, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Users, 
  ShoppingCart,
  LucideIcon 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FlowTemplates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewTemplate, setPreviewTemplate] = useState<WorkflowTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();

  const categories = ['All', ...Array.from(new Set(WorkflowTemplates.map(t => t.category)))];

  const filteredTemplates = WorkflowTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTemplateIcon = (category: string): LucideIcon => {
    switch (category) {
      case 'Communication': return Mail;
      case 'Data Processing': return Database;
      case 'Integration': return Webhook;
      case 'Customer Support': return MessageSquare;
      case 'Project Management': return Calendar;
      case 'Content': return FileText;
      case 'HR': return Users;
      case 'E-commerce': return ShoppingCart;
      default: return Database;
    }
  };

  const getTemplateColor = (category: string): string => {
    switch (category) {
      case 'Communication': return 'bg-blue-600';
      case 'Data Processing': return 'bg-green-600';
      case 'Integration': return 'bg-purple-600';
      case 'Customer Support': return 'bg-orange-600';
      case 'Project Management': return 'bg-red-600';
      case 'Content': return 'bg-yellow-600';
      case 'HR': return 'bg-pink-600';
      case 'E-commerce': return 'bg-indigo-600';
      default: return 'bg-gray-600';
    }
  };

  const handlePreview = (template: WorkflowTemplate) => {
    setPreviewTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleUseTemplate = (template: WorkflowTemplate) => {
    toast({
      title: "Template loaded",
      description: `"${template.name}" template has been loaded into the workflow builder.`,
    });
    // Navigate to builder with template
    window.location.href = `/pulseflow?template=${template.id}`;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <TemplateFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <TemplateCard
            key={template.id}
            template={template}
            index={index}
            onPreview={handlePreview}
            onUseTemplate={handleUseTemplate}
            getTemplateIcon={getTemplateIcon}
            getTemplateColor={getTemplateColor}
          />
        ))}
      </div>

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
