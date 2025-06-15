
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Shield, DollarSign, Gift, Plus, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Benefit {
  id: string;
  name: string;
  description: string | null;
  category: string;
  provider: string | null;
  cost: number | null;
  employer_contribution_percent: number | null;
  is_active: boolean;
}

interface UserBenefit {
  id: string;
  benefit_id: string;
  enrollment_date: string;
  status: string;
  employee_contribution: number;
  benefits: Benefit;
}

const categoryIcons = {
  health: Heart,
  dental: Shield,
  vision: Shield,
  retirement: DollarSign,
  stipend: Gift,
  insurance: Shield,
  perk: Gift,
};

const categoryColors = {
  health: "bg-red-500",
  dental: "bg-blue-500",
  vision: "bg-green-500",
  retirement: "bg-purple-500",
  stipend: "bg-yellow-500",
  insurance: "bg-indigo-500",
  perk: "bg-pink-500",
};

export const BenefitsManagement = () => {
  const { user } = useAuth();
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [userBenefits, setUserBenefits] = useState<UserBenefit[]>([]);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [employeeContribution, setEmployeeContribution] = useState("");

  useEffect(() => {
    if (user) {
      fetchBenefits();
      fetchUserBenefits();
    }
  }, [user]);

  const fetchBenefits = async () => {
    const { data, error } = await supabase
      .from('benefits')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching benefits:', error);
      return;
    }

    setBenefits(data || []);
  };

  const fetchUserBenefits = async () => {
    const { data, error } = await supabase
      .from('user_benefits')
      .select(`
        *,
        benefits (*)
      `)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching user benefits:', error);
      return;
    }

    setUserBenefits(data || []);
  };

  const handleEnrollBenefit = async () => {
    if (!selectedBenefit || !user) return;

    const { error } = await supabase
      .from('user_benefits')
      .insert({
        user_id: user.id,
        benefit_id: selectedBenefit.id,
        employee_contribution: parseFloat(employeeContribution) || 0,
        status: 'active'
      });

    if (error) {
      toast.error('Failed to enroll in benefit');
      return;
    }

    toast.success(`Successfully enrolled in ${selectedBenefit.name}`);
    setEnrollDialogOpen(false);
    setSelectedBenefit(null);
    setEmployeeContribution("");
    fetchUserBenefits();
  };

  const isEnrolled = (benefitId: string) => {
    return userBenefits.some(ub => ub.benefit_id === benefitId);
  };

  const getTotalMonthlyCost = () => {
    return userBenefits.reduce((total, ub) => total + ub.employee_contribution, 0);
  };

  const groupedBenefits = benefits.reduce((acc, benefit) => {
    if (!acc[benefit.category]) {
      acc[benefit.category] = [];
    }
    acc[benefit.category].push(benefit);
    return acc;
  }, {} as Record<string, Benefit[]>);

  return (
    <div className="space-y-6">
      {/* Benefits Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Active Benefits</p>
                <p className="text-2xl font-bold text-white">{userBenefits.length}</p>
              </div>
              <Check className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Monthly Cost</p>
                <p className="text-2xl font-bold text-white">${getTotalMonthlyCost().toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm">Available Benefits</p>
                <p className="text-2xl font-bold text-white">{benefits.length}</p>
              </div>
              <Gift className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Benefits by Category */}
      {Object.entries(groupedBenefits).map(([category, categoryBenefits]) => {
        const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Gift;
        const colorClass = categoryColors[category as keyof typeof categoryColors] || "bg-gray-500";

        return (
          <Card key={category} className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 capitalize">
                <div className={`w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                {category} Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryBenefits.map((benefit) => (
                  <div 
                    key={benefit.id}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-white font-medium">{benefit.name}</h3>
                        {benefit.provider && (
                          <p className="text-white/60 text-sm">by {benefit.provider}</p>
                        )}
                      </div>
                      {isEnrolled(benefit.id) ? (
                        <Badge className="bg-green-500 text-white">Enrolled</Badge>
                      ) : (
                        <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80"
                              onClick={() => setSelectedBenefit(benefit)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Enroll
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-white/20">
                            <DialogHeader>
                              <DialogTitle className="text-white">
                                Enroll in {selectedBenefit?.name}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {selectedBenefit?.description && (
                                <p className="text-white/70">{selectedBenefit.description}</p>
                              )}
                              
                              <div className="space-y-2">
                                <Label className="text-white">Employee Monthly Contribution</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={employeeContribution}
                                  onChange={(e) => setEmployeeContribution(e.target.value)}
                                  className="bg-white/10 border-white/20 text-white"
                                  placeholder="0.00"
                                />
                              </div>

                              {selectedBenefit?.cost && (
                                <div className="text-white/70 text-sm">
                                  Total monthly cost: ${selectedBenefit.cost}
                                  {selectedBenefit.employer_contribution_percent && (
                                    <> (Employer covers {selectedBenefit.employer_contribution_percent}%)</>
                                  )}
                                </div>
                              )}

                              <Button 
                                onClick={handleEnrollBenefit}
                                className="w-full bg-[#6F2DBD] hover:bg-[#6F2DBD]/80"
                              >
                                Confirm Enrollment
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    
                    {benefit.description && (
                      <p className="text-white/70 text-sm">{benefit.description}</p>
                    )}
                    
                    {benefit.cost && (
                      <div className="text-white/60 text-sm">
                        Monthly cost: ${benefit.cost}
                        {benefit.employer_contribution_percent && (
                          <span className="text-green-400">
                            {" "}(You pay {100 - benefit.employer_contribution_percent}%)
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
