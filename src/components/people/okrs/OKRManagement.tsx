
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Plus, TrendingUp, Calendar, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface OKR {
  id: string;
  title: string;
  description: string | null;
  objective: string;
  key_results: any[];
  quarter: string;
  progress_percentage: number;
  status: string;
  created_at: string;
  team_id: string | null;
}

interface KeyResult {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
}

export const OKRManagement = () => {
  const { user } = useAuth();
  const [okrs, setOKRs] = useState<OKR[]>([]);
  const [newOKROpen, setNewOKROpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    objective: "",
    quarter: "",
    status: "active"
  });
  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    { id: "1", description: "", target: 0, current: 0, unit: "" }
  ]);

  useEffect(() => {
    if (user) {
      fetchOKRs();
    }
  }, [user]);

  const fetchOKRs = async () => {
    const { data, error } = await supabase
      .from('okrs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching OKRs:', error);
      return;
    }

    setOKRs(data || []);
  };

  const addKeyResult = () => {
    setKeyResults([...keyResults, { 
      id: Date.now().toString(), 
      description: "", 
      target: 0, 
      current: 0, 
      unit: "" 
    }]);
  };

  const updateKeyResult = (id: string, field: keyof KeyResult, value: any) => {
    setKeyResults(keyResults.map(kr => 
      kr.id === id ? { ...kr, [field]: value } : kr
    ));
  };

  const removeKeyResult = (id: string) => {
    if (keyResults.length > 1) {
      setKeyResults(keyResults.filter(kr => kr.id !== id));
    }
  };

  const calculateProgress = (keyResults: KeyResult[]) => {
    if (keyResults.length === 0) return 0;
    const totalProgress = keyResults.reduce((sum, kr) => {
      const progress = kr.target > 0 ? Math.min((kr.current / kr.target) * 100, 100) : 0;
      return sum + progress;
    }, 0);
    return totalProgress / keyResults.length;
  };

  const handleCreateOKR = async () => {
    if (!user) return;

    const progress = calculateProgress(keyResults);

    const { error } = await supabase
      .from('okrs')
      .insert({
        ...formData,
        user_id: user.id,
        key_results: keyResults,
        progress_percentage: progress
      });

    if (error) {
      toast.error('Failed to create OKR');
      return;
    }

    toast.success('OKR created successfully');
    setNewOKROpen(false);
    setFormData({
      title: "",
      description: "",
      objective: "",
      quarter: "",
      status: "active"
    });
    setKeyResults([{ id: "1", description: "", target: 0, current: 0, unit: "" }]);
    fetchOKRs();
  };

  const updateOKRProgress = async (okrId: string, newKeyResults: KeyResult[]) => {
    const progress = calculateProgress(newKeyResults);

    const { error } = await supabase
      .from('okrs')
      .update({
        key_results: newKeyResults,
        progress_percentage: progress
      })
      .eq('id', okrId);

    if (error) {
      toast.error('Failed to update progress');
      return;
    }

    toast.success('Progress updated');
    fetchOKRs();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'delayed': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCurrentQuarter = () => {
    const now = new Date();
    const year = now.getFullYear();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return `${year}-Q${quarter}`;
  };

  const activeOKRs = okrs.filter(okr => okr.status === 'active');
  const completedOKRs = okrs.filter(okr => okr.status === 'completed');
  const avgProgress = okrs.length > 0 
    ? okrs.reduce((sum, okr) => sum + okr.progress_percentage, 0) / okrs.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* OKR Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Active OKRs</p>
                <p className="text-2xl font-bold text-white">{activeOKRs.length}</p>
              </div>
              <Target className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Completed</p>
                <p className="text-2xl font-bold text-white">{completedOKRs.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Avg Progress</p>
                <p className="text-2xl font-bold text-white">{avgProgress.toFixed(0)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Current Quarter</p>
                <p className="text-2xl font-bold text-white">{getCurrentQuarter()}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Objectives & Key Results</h2>
        <Dialog open={newOKROpen} onOpenChange={setNewOKROpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
              <Plus className="w-4 h-4 mr-2" />
              New OKR
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-white/20 max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-white">Create New OKR</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Q1 Growth Objectives"
                  />
                </div>
                <div>
                  <Label className="text-white">Quarter</Label>
                  <Input
                    value={formData.quarter}
                    onChange={(e) => setFormData({...formData, quarter: e.target.value})}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="2024-Q1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">Objective</Label>
                <Textarea
                  value={formData.objective}
                  onChange={(e) => setFormData({...formData, objective: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Increase user engagement and product adoption"
                  rows={2}
                />
              </div>

              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Additional context and details"
                  rows={2}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white">Key Results</Label>
                  <Button 
                    type="button" 
                    onClick={addKeyResult}
                    size="sm"
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Key Result
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {keyResults.map((kr, index) => (
                    <div key={kr.id} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-6">
                        <Input
                          value={kr.description}
                          onChange={(e) => updateKeyResult(kr.id, 'description', e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Increase monthly active users"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={kr.target}
                          onChange={(e) => updateKeyResult(kr.id, 'target', parseFloat(e.target.value))}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Target"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          value={kr.unit}
                          onChange={(e) => updateKeyResult(kr.id, 'unit', e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="users"
                        />
                      </div>
                      <div className="col-span-2">
                        {keyResults.length > 1 && (
                          <Button 
                            type="button"
                            onClick={() => removeKeyResult(kr.id)}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 w-full"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateOKR} className="w-full bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                Create OKR
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* OKRs List */}
      <div className="space-y-4">
        {okrs.map((okr) => (
          <Card key={okr.id} className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white">{okr.title}</CardTitle>
                  <p className="text-white/70 mt-1">{okr.objective}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(okr.status)} text-white`}>
                    {okr.status}
                  </Badge>
                  <Badge variant="outline" className="text-white border-white/20">
                    {okr.quarter}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/70">Overall Progress</span>
                    <span className="text-white font-semibold">{okr.progress_percentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={okr.progress_percentage} className="h-2" />
                </div>

                <div>
                  <h4 className="text-white font-medium mb-3">Key Results</h4>
                  <div className="space-y-3">
                    {okr.key_results.map((kr: KeyResult, index: number) => {
                      const progress = kr.target > 0 ? Math.min((kr.current / kr.target) * 100, 100) : 0;
                      return (
                        <div key={index} className="bg-white/5 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-white">{kr.description}</p>
                            <div className="text-right">
                              <p className="text-white font-medium">
                                {kr.current} / {kr.target} {kr.unit}
                              </p>
                              <p className="text-white/70 text-sm">{progress.toFixed(0)}%</p>
                            </div>
                          </div>
                          <Progress value={progress} className="h-1" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {okr.description && (
                  <div className="text-white/70 text-sm bg-white/5 p-3 rounded-lg">
                    {okr.description}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
