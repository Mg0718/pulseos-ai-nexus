
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  full_name: string | null;
  job_title: string | null;
}

interface FeedbackFormProps {
  profiles: Profile[];
  userId: string | undefined;
  onFeedbackSubmitted: () => void;
}

export const FeedbackForm = ({ profiles, userId, onFeedbackSubmitted }: FeedbackFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    to_user_id: "",
    feedback_type: "peer",
    visibility: "open",
    title: "",
    content: "",
    is_anonymous: false,
  });

  const handleSubmitFeedback = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('feedback_entries')
        .insert({
          from_user_id: userId,
          ...newFeedback,
        });

      if (error) throw error;

      toast.success('Feedback submitted successfully!');
      setIsDialogOpen(false);
      setNewFeedback({
        to_user_id: "",
        feedback_type: "peer",
        visibility: "open",
        title: "",
        content: "",
        is_anonymous: false,
      });
      onFeedbackSubmitted();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
          <Plus className="w-4 h-4 mr-2" />
          Give Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Give Feedback</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="recipient">To</Label>
            <Select
              value={newFeedback.to_user_id}
              onValueChange={(value) => setNewFeedback(prev => ({ ...prev, to_user_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.full_name} {profile.job_title && `- ${profile.job_title}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">Feedback Type</Label>
            <Select
              value={newFeedback.feedback_type}
              onValueChange={(value) => setNewFeedback(prev => ({ ...prev, feedback_type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="peer">Peer Feedback</SelectItem>
                <SelectItem value="manager">Manager Feedback</SelectItem>
                <SelectItem value="self">Self Assessment</SelectItem>
                <SelectItem value="360">360 Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="visibility">Visibility</Label>
            <Select
              value={newFeedback.visibility}
              onValueChange={(value) => setNewFeedback(prev => ({ ...prev, visibility: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="anonymous">Anonymous</SelectItem>
                <SelectItem value="manager_only">Manager Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newFeedback.title}
              onChange={(e) => setNewFeedback(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief feedback title"
            />
          </div>

          <div>
            <Label htmlFor="content">Feedback</Label>
            <Textarea
              id="content"
              value={newFeedback.content}
              onChange={(e) => setNewFeedback(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Share your constructive feedback..."
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="anonymous"
              checked={newFeedback.is_anonymous}
              onCheckedChange={(checked) => setNewFeedback(prev => ({ ...prev, is_anonymous: checked }))}
            />
            <Label htmlFor="anonymous">Submit anonymously</Label>
          </div>

          <Button
            onClick={handleSubmitFeedback}
            disabled={!newFeedback.to_user_id || !newFeedback.title || !newFeedback.content}
            className="w-full bg-[#6F2DBD] hover:bg-[#6F2DBD]/80"
          >
            Submit Feedback
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
