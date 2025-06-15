
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Target, TrendingUp, Clock, Calendar, Users, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface KeyResult {
  id: string;
  description: string;
  target: number;
  current: number;
  unit: string;
}

interface OKR {
  id: string;
  title: string;
  description: string;
  objective: string;
  key_results: KeyResult[];
  quarter: string;
  progress_percentage: number;
  status: string;
  team_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const OKRManagement = () => {
  const { user } = useAuth();
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOkr, setEditingOkr] = useState<OKR | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [objective, setObjective] = useState("");
  const [quarter, setQuarter] = useState("");
  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    { id: "1", description: "", target: 0, current: 0, unit: "%" }
  ]);

  useEffect(() => {
    fetchOKRs();
  }, [user]);

  const fetchOKRs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('okrs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedOkrs: OKR[] = data?.map(item => ({
        ...item,
        key_results: Array.isArray(item.key_results) ? item.key_results as KeyResult[] : []
      })) || [];
      
      setOkrs(transformedOkrs);
    } catch (error) {
      console.error('Error fetching OKRs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const okrData = {
        title,
        description,
        objective,
        quarter,
        key_results: keyResults as any, // Type assertion for JSON storage
        progress_percentage: calculateOverallProgress(),
        status: 'active',
        user_id: user.id
      };

      if (editingOkr) {
        const { error } = await supabase
          .from('okrs')
          .update(okrData)
          .eq('id', editingOkr.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('okrs')
          .insert([okrData]);
        
        if (error) throw error;
      }

      resetForm();
      setIsDialogOpen(false);
      fetchOKRs();
    } catch (error) {
      console.error('Error saving OKR:', error);
    }
  };

  const calculateOverallProgress = () => {
    if (keyResults.length === 0) return 0;
    const totalProgress = keyResults.reduce((sum, kr) => {
      return sum + (kr.current / kr.target) * 100;
    }, 0);
    return Math.min(totalProgress / keyResults.length, 100);
  };

  const addKeyResult = () => {
    setKeyResults([
      ...keyResults,
      { id: Date.now().toString(), description: "", target: 0, current: 0, unit: "%" }
    ]);
  };

  const updateKeyResult = (id: string, field: keyof KeyResult, value: string | number) => {
    setKeyResults(keyResults.map(kr => 
      kr.id === id ? { ...kr, [field]: value } : kr
    ));
  };

  const removeKeyResult = (id: string) => {
    setKeyResults(keyResults.filter(kr => kr.id !== id));
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setObjective("");
    setQuarter("");
    setKeyResults([{ id: "1", description: "", target: 0, current: 0, unit: "%" }]);
    setEditingOkr(null);
  };

  const editOkr = (okr: OKR) => {
    setTitle(okr.title);
    setDescription(okr.description);
    setObjective(okr.objective);
    setQuarter(okr.quarter);
    setKeyResults(okr.key_results);
    setEditingOkr(okr);
    setIsDialogOpen(true);
  };

  const deleteOkr = async (id: string) => {
    try {
      const { error } = await supabase
        .from('okrs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      fetchOKRs();
    } catch (error) {
      console.error('Error deleting OKR:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "completed": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "delayed": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "cancelled": return "bg-red-500/20 text-red-300 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading OKRs...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Objectives & Key Results</h2>
          <p className="text-white/70">Track and manage your quarterly goals</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={resetForm}
              className="bg-[#6F2DBD] hover:bg-[#A663CC] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New OKR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingOkr ? 'Edit OKR' : 'Create New OKR'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Define objectives and measurable key results
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="OKR Title"
                    required
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Quarter</label>
                  <Select value={quarter} onValueChange={setQuarter} required>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder="Select quarter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-Q1">2024 Q1</SelectItem>
                      <SelectItem value="2024-Q2">2024 Q2</SelectItem>
                      <SelectItem value="2024-Q3">2024 Q3</SelectItem>
                      <SelectItem value="2024-Q4">2024 Q4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Objective</label>
                <Textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="What do you want to achieve?"
                  required
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional context..."
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-white text-sm font-medium">Key Results</label>
                  <Button type="button" onClick={addKeyResult} size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Key Result
                  </Button>
                </div>
                
                {keyResults.map((kr, index) => (
                  <div key={kr.id} className="grid grid-cols-12 gap-2 mb-3 items-end">
                    <div className="col-span-5">
                      <Input
                        placeholder="Key result description"
                        value={kr.description}
                        onChange={(e) => updateKeyResult(kr.id, 'description', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Target"
                        value={kr.target}
                        onChange={(e) => updateKeyResult(kr.id, 'target', Number(e.target.value))}
                        className="bg-gray-800 border-gray-600 text-white text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="Current"
                        value={kr.current}
                        onChange={(e) => updateKeyResult(kr.id, 'current', Number(e.target.value))}
                        className="bg-gray-800 border-gray-600 text-white text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        placeholder="Unit"
                        value={kr.unit}
                        onChange={(e) => updateKeyResult(kr.id, 'unit', e.target.value)}
                        className="bg-gray-800 border-gray-600 text-white text-sm"
                      />
                    </div>
                    <div className="col-span-1">
                      {keyResults.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removeKeyResult(kr.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-[#6F2DBD] hover:bg-[#A663CC] text-white"
                >
                  {editingOkr ? 'Update OKR' : 'Create OKR'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* OKRs List */}
      <div className="grid gap-6">
        {okrs.length === 0 ? (
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Target className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-white text-lg font-medium mb-2">No OKRs Yet</h3>
              <p className="text-white/60">Create your first OKR to start tracking your objectives</p>
            </CardContent>
          </Card>
        ) : (
          okrs.map((okr, index) => (
            <motion.div
              key={okr.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-white">{okr.title}</CardTitle>
                        <Badge className={getStatusColor(okr.status)}>
                          {okr.status}
                        </Badge>
                        <Badge variant="outline" className="text-white/70 border-white/20">
                          {okr.quarter}
                        </Badge>
                      </div>
                      <CardDescription className="text-white/70">
                        {okr.objective}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => editOkr(okr)}
                        className="text-white/70 hover:text-white hover:bg-white/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteOkr(okr.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Overall Progress */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70 text-sm">Overall Progress</span>
                        <span className="text-white font-medium">{Math.round(okr.progress_percentage)}%</span>
                      </div>
                      <Progress value={okr.progress_percentage} className="h-2" />
                    </div>
                    
                    {/* Key Results */}
                    <div>
                      <h4 className="text-white font-medium mb-3">Key Results</h4>
                      <div className="space-y-3">
                        {okr.key_results.map((kr, krIndex) => {
                          const progress = kr.target > 0 ? (kr.current / kr.target) * 100 : 0;
                          return (
                            <div key={krIndex} className="bg-white/5 rounded-lg p-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-white/90 text-sm">{kr.description}</span>
                                <span className="text-white/70 text-sm">
                                  {kr.current} / {kr.target} {kr.unit}
                                </span>
                              </div>
                              <Progress value={Math.min(progress, 100)} className="h-1" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
