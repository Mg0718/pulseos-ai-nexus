
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { OKRForm } from "./OKRForm";
import { OKRCard } from "./OKRCard";
import { EmptyOKRState } from "./EmptyOKRState";
import { useOKRs } from "./useOKRs";
import { OKR } from "./types";

export const OKRManagement = () => {
  const { okrs, loading, saveOKR, deleteOKR } = useOKRs();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOkr, setEditingOkr] = useState<OKR | null>(null);

  const handleSubmit = async (okrData: any) => {
    await saveOKR(okrData, editingOkr);
    setEditingOkr(null);
    setIsDialogOpen(false);
  };

  const editOkr = (okr: OKR) => {
    setEditingOkr(okr);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingOkr(null);
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
          <OKRForm
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onSubmit={handleSubmit}
            editingOkr={editingOkr}
          />
        </Dialog>
      </div>

      {/* OKRs List */}
      <div className="grid gap-6">
        {okrs.length === 0 ? (
          <EmptyOKRState />
        ) : (
          okrs.map((okr, index) => (
            <OKRCard
              key={okr.id}
              okr={okr}
              index={index}
              onEdit={editOkr}
              onDelete={deleteOKR}
            />
          ))
        )}
      </div>
    </div>
  );
};
