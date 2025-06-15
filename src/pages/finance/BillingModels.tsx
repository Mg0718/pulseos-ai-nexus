
import { motion } from "framer-motion";
import { CreditCard, Plus, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BillingModels = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Billing Models</h1>
          <p className="text-white/70 text-lg">Configure pricing plans and billing strategies</p>
        </motion.div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Pricing Plans
            </CardTitle>
            <Button className="bg-gradient-to-r from-[#6F2DBD] to-[#A663CC] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 mx-auto text-white/30 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Billing Plans Yet</h3>
              <p className="text-white/60">Create your first pricing plan to get started with billing.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingModels;
