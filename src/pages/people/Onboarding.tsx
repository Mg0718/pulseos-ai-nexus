
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, ArrowLeft, User, Briefcase, MapPin, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OnboardingData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
  };
  jobInfo: {
    jobTitle: string;
    department: string;
    employeeId: string;
    hireDate: string;
    workspaceType: string;
  };
  locationInfo: {
    location: string;
    timezone: string;
  };
  teamInfo: {
    managerId?: string;
    bio: string;
    skills: string[];
  };
}

const steps = [
  { id: 1, title: "Personal Information", icon: User, description: "Basic personal details" },
  { id: 2, title: "Job Details", icon: Briefcase, description: "Role and employment info" },
  { id: 3, title: "Location & Timezone", icon: MapPin, description: "Where you work" },
  { id: 4, title: "Team & Skills", icon: Users, description: "Your team and expertise" },
];

const Onboarding = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    personalInfo: {
      fullName: user?.user_metadata?.full_name || "",
      email: user?.email || "",
      phone: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
    },
    jobInfo: {
      jobTitle: "",
      department: "",
      employeeId: "",
      hireDate: "",
      workspaceType: "office",
    },
    locationInfo: {
      location: "",
      timezone: "UTC",
    },
    teamInfo: {
      bio: "",
      skills: [],
    },
  });

  const progress = (currentStep / steps.length) * 100;

  const updateData = (section: keyof OnboardingData, field: string, value: any) => {
    setData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const addSkill = (skill: string) => {
    if (skill && !data.teamInfo.skills.includes(skill)) {
      setData(prev => ({
        ...prev,
        teamInfo: {
          ...prev.teamInfo,
          skills: [...prev.teamInfo.skills, skill],
        },
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setData(prev => ({
      ...prev,
      teamInfo: {
        ...prev.teamInfo,
        skills: prev.teamInfo.skills.filter(s => s !== skill),
      },
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.personalInfo.fullName,
          phone: data.personalInfo.phone,
          emergency_contact_name: data.personalInfo.emergencyContactName,
          emergency_contact_phone: data.personalInfo.emergencyContactPhone,
          job_title: data.jobInfo.jobTitle,
          department: data.jobInfo.department,
          employee_id: data.jobInfo.employeeId,
          hire_date: data.jobInfo.hireDate,
          workspace_type: data.jobInfo.workspaceType as any,
          location: data.locationInfo.location,
          timezone: data.locationInfo.timezone,
          bio: data.teamInfo.bio,
          skills: data.teamInfo.skills,
          employment_status: 'active',
          onboarding_completed: true,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success("Onboarding completed successfully!");
      // Redirect to teams page
      window.location.href = "/people/teams";
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Failed to complete onboarding");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={data.personalInfo.fullName}
                  onChange={(e) => updateData('personalInfo', 'fullName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={data.personalInfo.email}
                  disabled
                />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={data.personalInfo.phone}
                onChange={(e) => updateData('personalInfo', 'phone', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyName">Emergency Contact Name</Label>
                <Input
                  id="emergencyName"
                  value={data.personalInfo.emergencyContactName}
                  onChange={(e) => updateData('personalInfo', 'emergencyContactName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  value={data.personalInfo.emergencyContactPhone}
                  onChange={(e) => updateData('personalInfo', 'emergencyContactPhone', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={data.jobInfo.jobTitle}
                  onChange={(e) => updateData('jobInfo', 'jobTitle', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={data.jobInfo.department}
                  onChange={(e) => updateData('jobInfo', 'department', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={data.jobInfo.employeeId}
                  onChange={(e) => updateData('jobInfo', 'employeeId', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="hireDate">Hire Date</Label>
                <Input
                  id="hireDate"
                  type="date"
                  value={data.jobInfo.hireDate}
                  onChange={(e) => updateData('jobInfo', 'hireDate', e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="workspaceType">Workspace Type</Label>
              <Select
                value={data.jobInfo.workspaceType}
                onValueChange={(value) => updateData('jobInfo', 'workspaceType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., New York, NY, USA"
                value={data.locationInfo.location}
                onChange={(e) => updateData('locationInfo', 'location', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={data.locationInfo.timezone}
                onValueChange={(value) => updateData('locationInfo', 'timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                  <SelectItem value="Europe/Paris">Paris</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  <SelectItem value="Australia/Sydney">Sydney</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={data.teamInfo.bio}
                onChange={(e) => updateData('teamInfo', 'bio', e.target.value)}
              />
            </div>
            <div>
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {data.teamInfo.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill} ×
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Add a skill and press Enter"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addSkill(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to PulseOS!</h1>
          <p className="text-white/70">Let's get you set up with a quick onboarding process.</p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 ${
                  step.id <= currentStep ? "text-white" : "text-white/40"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.id < currentStep
                      ? "bg-green-500"
                      : step.id === currentStep
                      ? "bg-[#6F2DBD]"
                      : "bg-white/20"
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-4 h-4" />
                  )}
                </div>
                <div className="hidden md:block">
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm opacity-70">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Form */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white">
              {steps[currentStep - 1]?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < steps.length ? (
                <Button
                  onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                  className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Completing..." : "Complete Onboarding"}
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
