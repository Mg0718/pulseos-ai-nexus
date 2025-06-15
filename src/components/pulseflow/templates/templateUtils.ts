
import { 
  Users, 
  DollarSign, 
  Mail, 
  Calendar,
  FileText,
  Zap,
  LucideIcon
} from "lucide-react";

export const getTemplateIcon = (category: string): LucideIcon => {
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

export const getTemplateColor = (category: string): string => {
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

export const categories = ["All", "HR", "Finance", "Support", "Productivity", "Legal", "Sales"];
