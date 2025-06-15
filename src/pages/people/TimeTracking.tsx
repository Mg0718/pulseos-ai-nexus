
import { TimeTrackingDashboard } from "@/components/people/time/TimeTrackingDashboard";

const TimeTracking = () => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Time Tracking</h1>
          <p className="text-white/70">Manage your work hours and track productivity.</p>
        </div>
        <TimeTrackingDashboard />
      </div>
    </div>
  );
};

export default TimeTracking;
