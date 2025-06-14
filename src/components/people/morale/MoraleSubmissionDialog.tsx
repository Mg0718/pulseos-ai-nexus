
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface MoraleSubmissionDialogProps {
  onMoraleSubmitted: () => void;
}

export const MoraleSubmissionDialog = ({ onMoraleSubmitted }: MoraleSubmissionDialogProps) => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMorale, setNewMorale] = useState({
    morale_score: [7],
    feedback_text: "",
  });

  const getMoraleColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const handleSubmitMorale = async () => {
    if (!user) return;

    try {
      const sentiment = newMorale.morale_score[0] >= 8 ? 'very_positive' :
                      newMorale.morale_score[0] >= 6 ? 'positive' :
                      newMorale.morale_score[0] >= 4 ? 'neutral' :
                      newMorale.morale_score[0] >= 2 ? 'negative' : 'very_negative';

      const { error } = await supabase
        .from('morale_entries')
        .insert({
          user_id: user.id,
          morale_score: newMorale.morale_score[0],
          sentiment,
          feedback_text: newMorale.feedback_text || null,
        });

      if (error) throw error;

      toast.success('Morale feedback submitted successfully!');
      setIsDialogOpen(false);
      setNewMorale({
        morale_score: [7],
        feedback_text: "",
      });
      onMoraleSubmitted();
    } catch (error) {
      console.error('Error submitting morale:', error);
      toast.error('Failed to submit morale feedback');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
          <Plus className="w-4 h-4 mr-2" />
          Log Morale
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>How are you feeling today?</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label>Morale Score (1-10)</Label>
            <div className="mt-4 mb-2">
              <Slider
                value={newMorale.morale_score}
                onValueChange={(value) => setNewMorale(prev => ({ ...prev, morale_score: value }))}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-sm text-white/60">
              <span>Very Low</span>
              <span className={`font-semibold ${getMoraleColor(newMorale.morale_score[0])}`}>
                {newMorale.morale_score[0]}/10
              </span>
              <span>Excellent</span>
            </div>
          </div>

          <div>
            <Label htmlFor="feedback">What's affecting your mood? (Optional)</Label>
            <Textarea
              id="feedback"
              value={newMorale.feedback_text}
              onChange={(e) => setNewMorale(prev => ({ ...prev, feedback_text: e.target.value }))}
              placeholder="Share what's on your mind..."
              rows={3}
              className="mt-2"
            />
          </div>

          <Button
            onClick={handleSubmitMorale}
            className="w-full bg-[#6F2DBD] hover:bg-[#6F2DBD]/80"
          >
            Submit Morale Check
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
