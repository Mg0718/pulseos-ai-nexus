
import { BenefitsManagement } from "@/components/people/benefits/BenefitsManagement";

const Benefits = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Benefits & Perks</h1>
          <p className="text-white/70">Manage your employee benefits and enrollments.</p>
        </div>
        <BenefitsManagement />
      </div>
    </div>
  );
};

export default Benefits;
