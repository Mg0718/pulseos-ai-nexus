
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const OverviewCard = () => {
  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
      <CardHeader>
        <CardTitle className="text-white">🚀 Phase 2: Smart Contract Automation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-semibold mb-2">Automated Payroll System ✅</h4>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Smart contract-based recurring payments</li>
              <li>• Performance-based bonus releases</li>
              <li>• Automated tax calculation & withholding</li>
              <li>• Multi-frequency payment schedules</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-2">Invoice Automation ✅</h4>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Smart contract invoice processing</li>
              <li>• Automated approval workflows</li>
              <li>• Configurable approval rules</li>
              <li>• Real-time payment execution</li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-2">Tax Integration & Compliance ✅</h4>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Multi-jurisdiction tax calculation • Cross-border payment optimization • Real-time compliance monitoring • Automated regulatory reporting</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/80 text-sm">
            <strong>Smart Contract Automation:</strong> Phase 2 delivers comprehensive automation 
            with intelligent payroll processing, streamlined invoice workflows, and advanced tax compliance. 
            Investment attractiveness: <strong className="text-green-400">10/10</strong> - 
            Revolutionary automation capabilities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
