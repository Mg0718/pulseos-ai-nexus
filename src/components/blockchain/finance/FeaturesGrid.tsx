
import { Shield, Brain, Users, FileText, Calculator, Lock } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: Shield,
    title: "Multi-Signature Security",
    description: "Multi-party approval workflows for high-value transactions",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Brain,
    title: "ML Risk Analytics",
    description: "AI-powered fraud detection and real-time monitoring",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Users,
    title: "Automated Payroll",
    description: "Smart contract-based payroll with performance bonuses",
    color: "from-purple-500 to-violet-500"
  },
  {
    icon: FileText,
    title: "Invoice Automation",
    description: "Smart contract invoice processing with auto-approvals",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Calculator,
    title: "Tax Integration",
    description: "Automated tax calculation and regulatory compliance",
    color: "from-pink-500 to-purple-500"
  },
  {
    icon: Lock,
    title: "Immutable Logging",
    description: "All transactions cryptographically secured on blockchain",
    color: "from-cyan-500 to-blue-500"
  }
];

export const FeaturesGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {features.map((feature, index) => (
        <FeatureCard
          key={feature.title}
          {...feature}
          index={index}
        />
      ))}
    </div>
  );
};
