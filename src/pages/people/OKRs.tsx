
import { OKRManagement } from "@/components/people/okrs/OKRManagement";

const OKRs = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">OKRs</h1>
          <p className="text-white/70">Objectives and Key Results management.</p>
        </div>
        <OKRManagement />
      </div>
    </div>
  );
};

export default OKRs;
