
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: "default" | "ghost";
  className?: string;
}

export const ActionButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = "default",
  className = ""
}: ActionButtonProps) => {
  const baseClass = variant === "default" 
    ? "bg-[#6F2DBD] hover:bg-[#6F2DBD]/80 text-white"
    : "text-white border border-white/20 hover:bg-white/10";

  return (
    <Button 
      onClick={onClick}
      variant={variant}
      className={`${baseClass} ${className}`}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
};
