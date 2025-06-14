
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, Shield, Users, Calendar, Globe, Zap } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "PulseOS Inc.",
    timezone: "UTC",
    workWeek: "monday-friday",
    defaultLeavePolicy: "flexible",
  });

  const [roleSettings, setRoleSettings] = useState({
    adminCanEditAll: true,
    managerCanViewTeam: true,
    employeeCanRequestLeave: true,
    hrCanAccessAll: true,
  });

  const [leaveSettings, setLeaveSettings] = useState({
    defaultVacationDays: 20,
    defaultSickDays: 10,
    carryOverLimit: 5,
    requireApproval: true,
  });

  const [feedbackSettings, setFeedbackSettings] = useState({
    allowAnonymous: true,
    requirePeerReview: false,
    autoReminders: true,
    sentimentAnalysis: true,
  });

  const handleSaveGeneral = () => {
    // Here you would typically save to database
    toast.success('General settings saved successfully!');
  };

  const handleSaveRoles = () => {
    // Here you would typically save to database
    toast.success('Role permissions saved successfully!');
  };

  const handleSaveLeave = () => {
    // Here you would typically save to database
    toast.success('Leave policies saved successfully!');
  };

  const handleSaveFeedback = () => {
    // Here you would typically save to database
    toast.success('Feedback settings saved successfully!');
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon className="w-8 h-8 text-[#6F2DBD]" />
            <h1 className="text-3xl font-bold text-white">People Settings</h1>
          </div>
          <p className="text-white/70">Configure roles, policies, and system preferences.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="bg-white/10 border-white/20">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                General
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Roles & Permissions
              </TabsTrigger>
              <TabsTrigger value="leave" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Leave Policies
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Feedback
              </TabsTrigger>
              <TabsTrigger value="integrations" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Integrations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        value={generalSettings.companyName}
                        onChange={(e) => setGeneralSettings(prev => ({ ...prev, companyName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Default Timezone</Label>
                      <Select
                        value={generalSettings.timezone}
                        onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, timezone: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="EST">Eastern Time</SelectItem>
                          <SelectItem value="PST">Pacific Time</SelectItem>
                          <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="workWeek">Work Week</Label>
                      <Select
                        value={generalSettings.workWeek}
                        onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, workWeek: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday-friday">Monday - Friday</SelectItem>
                          <SelectItem value="sunday-thursday">Sunday - Thursday</SelectItem>
                          <SelectItem value="custom">Custom Schedule</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="leavePolicy">Default Leave Policy</Label>
                      <Select
                        value={generalSettings.defaultLeavePolicy}
                        onValueChange={(value) => setGeneralSettings(prev => ({ ...prev, defaultLeavePolicy: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="flexible">Flexible</SelectItem>
                          <SelectItem value="accrual">Accrual Based</SelectItem>
                          <SelectItem value="unlimited">Unlimited</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={handleSaveGeneral} className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                    Save General Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="roles">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Roles & Permissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Admin can edit all profiles</Label>
                        <p className="text-sm text-white/60">Allow administrators to modify any user profile</p>
                      </div>
                      <Switch
                        checked={roleSettings.adminCanEditAll}
                        onCheckedChange={(checked) => setRoleSettings(prev => ({ ...prev, adminCanEditAll: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Manager can view team data</Label>
                        <p className="text-sm text-white/60">Allow managers to access their team members' information</p>
                      </div>
                      <Switch
                        checked={roleSettings.managerCanViewTeam}
                        onCheckedChange={(checked) => setRoleSettings(prev => ({ ...prev, managerCanViewTeam: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Employee can request leave</Label>
                        <p className="text-sm text-white/60">Allow employees to submit leave requests</p>
                      </div>
                      <Switch
                        checked={roleSettings.employeeCanRequestLeave}
                        onCheckedChange={(checked) => setRoleSettings(prev => ({ ...prev, employeeCanRequestLeave: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>HR can access all data</Label>
                        <p className="text-sm text-white/60">Grant HR full access to all employee data</p>
                      </div>
                      <Switch
                        checked={roleSettings.hrCanAccessAll}
                        onCheckedChange={(checked) => setRoleSettings(prev => ({ ...prev, hrCanAccessAll: checked }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveRoles} className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                    Save Role Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leave">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Leave Policies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="vacationDays">Default Vacation Days</Label>
                      <Input
                        id="vacationDays"
                        type="number"
                        value={leaveSettings.defaultVacationDays}
                        onChange={(e) => setLeaveSettings(prev => ({ ...prev, defaultVacationDays: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sickDays">Default Sick Days</Label>
                      <Input
                        id="sickDays"
                        type="number"
                        value={leaveSettings.defaultSickDays}
                        onChange={(e) => setLeaveSettings(prev => ({ ...prev, defaultSickDays: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="carryOver">Carry-over Limit</Label>
                      <Input
                        id="carryOver"
                        type="number"
                        value={leaveSettings.carryOverLimit}
                        onChange={(e) => setLeaveSettings(prev => ({ ...prev, carryOverLimit: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require manager approval</Label>
                      <p className="text-sm text-white/60">All leave requests must be approved by a manager</p>
                    </div>
                    <Switch
                      checked={leaveSettings.requireApproval}
                      onCheckedChange={(checked) => setLeaveSettings(prev => ({ ...prev, requireApproval: checked }))}
                    />
                  </div>
                  <Button onClick={handleSaveLeave} className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                    Save Leave Policies
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Feedback Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow anonymous feedback</Label>
                        <p className="text-sm text-white/60">Enable users to submit feedback anonymously</p>
                      </div>
                      <Switch
                        checked={feedbackSettings.allowAnonymous}
                        onCheckedChange={(checked) => setFeedbackSettings(prev => ({ ...prev, allowAnonymous: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Require peer reviews</Label>
                        <p className="text-sm text-white/60">Mandate regular peer feedback sessions</p>
                      </div>
                      <Switch
                        checked={feedbackSettings.requirePeerReview}
                        onCheckedChange={(checked) => setFeedbackSettings(prev => ({ ...prev, requirePeerReview: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Automatic reminders</Label>
                        <p className="text-sm text-white/60">Send reminders for pending feedback requests</p>
                      </div>
                      <Switch
                        checked={feedbackSettings.autoReminders}
                        onCheckedChange={(checked) => setFeedbackSettings(prev => ({ ...prev, autoReminders: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>AI sentiment analysis</Label>
                        <p className="text-sm text-white/60">Enable AI-powered sentiment detection</p>
                      </div>
                      <Switch
                        checked={feedbackSettings.sentimentAnalysis}
                        onCheckedChange={(checked) => setFeedbackSettings(prev => ({ ...prev, sentimentAnalysis: checked }))}
                      />
                    </div>
                  </div>
                  <Button onClick={handleSaveFeedback} className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                    Save Feedback Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Slack Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/70">Connect Slack for leave notifications and team updates.</p>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Connect Slack
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Google Calendar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/70">Sync leave requests with Google Calendar.</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Connect Google
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">HRIS Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/70">Import employee data from your HRIS system.</p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Configure HRIS
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Email Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-white/70">Set up automated email notifications.</p>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Configure Email
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
