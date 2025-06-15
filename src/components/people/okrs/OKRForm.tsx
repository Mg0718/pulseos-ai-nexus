
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { KeyResult, OKR } from "./types";

interface OKRFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingOkr: OKR | null;
}

export const OKRForm = ({ isOpen, onClose, onSubmit, editingOkr }: OKRFormProps) => {
  const [title, setTitle] = useState(editingOkr?.title || "");
  const [description, setDescription] = useState(editingOkr?.description || "");
  const [objective, setObjective] = useState(editingOkr?.objective || "");
  const [quarter, setQuarter] = useState(editingOkr?.quarter || "");
  const [keyResults, setKeyResults] = useState<KeyResult[]>(
    editingOkr?.key_results || [{ id: "1", description: "", target: 0, current: 0, unit: "%" }]
  );

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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const okrData = {
      title,
      description,
      objective,
      quarter,
      key_results: keyResults,
      progress_percentage: calculateOverallProgress(),
      status: 'active'
    };

    onSubmit(okrData);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
              onClick={handleClose}
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
  );
};
