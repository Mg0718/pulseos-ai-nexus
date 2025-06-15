
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Building2, 
  Download, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  Play,
  Users,
  Settings,
  Zap,
  Heart,
  Brain,
  Briefcase,
  ShoppingCart,
  GraduationCap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import FloatingSidebar from "@/components/FloatingSidebar";
import { supabase } from "@/integrations/supabase/client";

const Templates = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("all");

  useEffect(() => {
    fetchTemplates();
    fetchDeployments();
  }, []);

  const fetchTemplates = async () => {
    const { data } = await supabase
      .from('industry_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (data) setTemplates(data);
  };

  const fetchDeployments = async () => {
    const { data } = await supabase
      .from('template_deployments')
      .select('*, industry_templates(*)')
      .order('created_at', { ascending: false });
    
    if (data) setDeployments(data);
  };

  const getIndustryIcon = (industry: string) => {
    switch (industry.toLowerCase()) {
      case 'tech': return <Zap className="w-6 h-6" />;
      case 'healthcare': return <Heart className="w-6 h-6" />;
      case 'finance': return <Briefcase className="w-6 h-6" />;
      case 'retail': return <ShoppingCart className="w-6 h-6" />;
      case 'education': return <GraduationCap className="w-6 h-6" />;
      case 'consulting': return <Brain className="w-6 h-6" />;
      default: return <Building2 className="w-6 h-6" />;
    }
  };

  const getIndustryColor = (industry: string) => {
    switch (industry.toLowerCase()) {
      case 'tech': return 'bg-blue-500';
      case 'healthcare': return 'bg-red-500';
      case 'finance': return 'bg-green-500';
      case 'retail': return 'bg-purple-500';
      case 'education': return 'bg-yellow-500';
      case 'consulting': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const defaultTemplates = [
    {
      id: 'tech-startup',
      name: 'Tech Startup Pack',
      industry: 'tech',
      description: 'Complete setup for technology startups with development focus',
      modules: ['People & TeamOps', 'Finance', 'Innovation Hub', 'PulseFlow', 'Analytics'],
      deployments: 1250,
      rating: 4.8
    },
    {
      id: 'healthcare-provider',
      name: 'Healthcare Provider',
      industry: 'healthcare',
      description: 'HIPAA-compliant workflows for healthcare organizations',
      modules: ['People & TeamOps', 'Compliance', 'Document Management', 'Analytics'],
      deployments: 890,
      rating: 4.9
    },
    {
      id: 'financial-services',
      name: 'Financial Services',
      industry: 'finance',
      description: 'Regulatory-compliant setup for financial institutions',
      modules: ['Finance', 'Compliance', 'PulseContracts', 'Analytics', 'Admin'],
      deployments: 670,
      rating: 4.7
    },
    {
      id: 'retail-business',
      name: 'Retail Business',
      industry: 'retail',
      description: 'Multi-location retail operations and inventory management',
      modules: ['People & TeamOps', 'Finance', 'FieldOps', 'Analytics', 'PulseSync'],
      deployments: 540,
      rating: 4.6
    },
    {
      id: 'education-institution',
      name: 'Education Institution',
      industry: 'education',
      description: 'Academic institutions and training organizations',
      modules: ['People & TeamOps', 'Document Management', 'Analytics', 'Onboarding'],
      deployments: 320,
      rating: 4.5
    },
    {
      id: 'consulting-firm',
      name: 'Consulting Firm',
      industry: 'consulting',
      description: 'Professional services and client management focus',
      modules: ['People & TeamOps', 'PulseContracts', 'Finance', 'Analytics', 'PulseComms'],
      deployments: 780,
      rating: 4.8
    }
  ];

  const stats = [
    { label: "Available Templates", value: defaultTemplates.length, icon: Building2, color: "bg-blue-500" },
    { label: "Total Deployments", value: defaultTemplates.reduce((sum, t) => sum + t.deployments, 0).toLocaleString(), icon: Download, color: "bg-green-500" },
    { label: "Active Deployments", value: deployments.filter(d => d.status === 'completed').length, icon: CheckCircle, color: "bg-purple-500" },
    { label: "Success Rate", value: "96.8%", icon: Zap, color: "bg-orange-500" }
  ];

  const filteredTemplates = defaultTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || template.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <FloatingSidebar />
      
      <div className="pl-24 pr-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Industry Templates</h1>
              <p className="text-gray-400">Pre-configured PulseOS setups for different industries</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Settings className="w-4 h-4 mr-2" />
              Template Builder
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 text-sm">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                  >
                    <option value="all" className="bg-slate-800">All Industries</option>
                    <option value="tech" className="bg-slate-800">Technology</option>
                    <option value="healthcare" className="bg-slate-800">Healthcare</option>
                    <option value="finance" className="bg-slate-800">Finance</option>
                    <option value="retail" className="bg-slate-800">Retail</option>
                    <option value="education" className="bg-slate-800">Education</option>
                    <option value="consulting" className="bg-slate-800">Consulting</option>
                  </select>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Templates Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
        >
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 ${getIndustryColor(template.industry)} rounded-xl flex items-center justify-center text-white`}>
                        {getIndustryIcon(template.industry)}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{template.name}</CardTitle>
                        <p className="text-gray-400 text-sm capitalize">{template.industry}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-white text-sm">{template.rating}</span>
                      </div>
                      <p className="text-gray-400 text-xs">{template.deployments.toLocaleString()} deploys</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">{template.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-gray-400 text-xs mb-2">Included Modules:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.modules.slice(0, 3).map((module, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-purple-400 text-purple-300">
                          {module}
                        </Badge>
                      ))}
                      {template.modules.length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-400 text-gray-400">
                          +{template.modules.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <Download className="w-4 h-4 mr-2" />
                      Deploy
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Play className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Deployments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Recent Deployments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deployments.slice(0, 5).map((deployment, index) => (
                  <motion.div
                    key={deployment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">
                        {deployment.industry_templates?.name || "Template"} deployment
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(deployment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={`${
                      deployment.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                      deployment.status === 'deploying' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-gray-500/20 text-gray-300'
                    } border-0 text-xs`}>
                      {deployment.status}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Templates;
