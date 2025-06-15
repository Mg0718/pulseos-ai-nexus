
import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { OKR } from "./types";

interface OKRCardProps {
  okr: OKR;
  index: number;
  onEdit: (okr: OKR) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-green-500/20 text-green-300 border-green-500/30";
    case "completed": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "delayed": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
    case "cancelled": return "bg-red-500/20 text-red-300 border-red-500/30";
    default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
  }
};

export const OKRCard = ({ okr, index, onEdit, onDelete }: OKRCardProps) => {
  return (
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
                onClick={() => onEdit(okr)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(okr.id)}
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
  );
};
