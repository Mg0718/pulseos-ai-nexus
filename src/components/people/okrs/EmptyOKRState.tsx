
import { Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const EmptyOKRState = () => {
  return (
    <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
      <CardContent className="p-8 text-center">
        <Target className="w-12 h-12 text-white/40 mx-auto mb-4" />
        <h3 className="text-white text-lg font-medium mb-2">No OKRs Yet</h3>
        <p className="text-white/60">Create your first OKR to start tracking your objectives</p>
      </CardContent>
    </Card>
  );
};
