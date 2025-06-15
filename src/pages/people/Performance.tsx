
import { PerformanceReviews } from "@/components/people/performance/PerformanceReviews";

const Performance = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Performance Reviews</h1>
          <p className="text-white/70">Track performance and development goals.</p>
        </div>
        <PerformanceReviews />
      </div>
    </div>
  );
};

export default Performance;
