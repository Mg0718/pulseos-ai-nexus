
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings2, Users, Calendar, MessageSquare, Globe, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UserRole {
  id: string;
  role_name: string;
  permissions: any;
}

interface LeavePolicy {
  id: string;
  country_code: string;
  region: string | null;
  leave_type: string;
  annual_allocation: number;
  max_carryover: number;
}

const Settings = () => {
  const { user } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [leavePolicies, setLeavePolicies] = useState<LeavePolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    feedback_visibility: 'team',
    leave_approval_required: true,
    morale_tracking_enabled: true,
    slack_integration: false,
    email_notifications: true,
    weekly_reports: true,
  });

  useEffect(() => {
    fetchSettingsData();
  }, [user]);

  const fetchSettingsData = async () => {
    if (!user) return;

    try {
      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) console.error('Error fetching roles:', rolesError);

      // Fetch leave policies
      const { data: policiesData, error: policiesError } = await supabase
        .from('leave_policies')
        .select('*')
        .order('country_code', { ascending: true });

      if (policiesError) console.error('Error fetching policies:', policiesError);

      setUserRoles(rolesData || []);
      setLeavePolicies(policiesData || []);
    } catch (error) {
      console.error('Error fetching settings data:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (setting: string, value: any) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    // In a real app, you'd save this to the database
    toast.success('Setting updated');
  };

  const addUserRole = () => {
    // Implementation for adding user roles
    toast.info('Role management coming soon');
  };

  const updateLeavePolicy = () => {
    // Implementation for updating leave policies
    toast.info('Policy updates coming soon');
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-white">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Settings2 className="w-8 h-8 text-[#6F2DBD]" />
            <h1 className="text-3xl font-bold text-white">People & TeamOps Settings</h1>
          </div>
          <p className="text-white/70">Configure roles, permissions, and policies for your organization.</p>
        </motion.div>

        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full bg-white/10 border border-white/20">
            <TabsTrigger value="roles" className="data-[state=active]:bg-[#6F2DBD]">
              <Shield className="w-4 h-4 mr-2" />
              Roles
            </TabsTrigger>
            <TabsTrigger value="leave" className="data-[state=active]:bg-[#6F2DBD]">
              <Calendar className="w-4 h-4 mr-2" />
              Leave Policies
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-[#6F2DBD]">
              <MessageSquare className="w-4 h-4 mr-2" />
              Feedback
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-[#6F2DBD]">
              <Globe className="w-4 h-4 mr-2" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="general" className="data-[state=active]:bg-[#6F2DBD]">
              <Settings2 className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
          </TabsList>

          {/* Roles & Permissions */}
          <TabsContent value="roles">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">User Roles & Permissions</CardTitle>
                    <Button onClick={addUserRole} className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                      Add Role
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['admin', 'manager', 'hr', 'employee'].map((role) => (
                      <div key={role} className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                        <div>
                          <h4 className="text-white font-medium capitalize">{role}</h4>
                          <p className="text-white/60 text-sm">
                            {role === 'admin' && 'Full system access and configuration'}
                            {role === 'manager' && 'Team management and approval permissions'}
                            {role === 'hr' && 'HR operations and people management'}
                            {role === 'employee' && 'Standard employee access'}
                          </p>
                        </div>
                        <Badge className="bg-[#6F2DBD]/20 text-purple-300">
                          {userRoles.filter(ur => ur.role_name === role).length} users
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Leave Policies */}
          <TabsContent value="leave">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-white">Leave Policies by Country</CardTitle>
                    <Button onClick={updateLeavePolicy} className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                      Add Policy
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leavePolicies.map((policy) => (
                      <div key={policy.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge className="bg-blue-500/20 text-blue-300">
                              {policy.country_code}
                            </Badge>
                            <span className="text-white font-medium capitalize">
                              {policy.leave_type.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-white">{policy.annual_allocation} days</p>
                            <p className="text-white/60 text-sm">
                              {policy.max_carryover} carryover
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Feedback Settings */}
          <TabsContent value="feedback">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Feedback Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Default Feedback Visibility</Label>
                      <p className="text-white/60 text-sm">Who can see feedback by default</p>
                    </div>
                    <Select
                      value={settings.feedback_visibility}
                      onValueChange={(value) => handleSettingChange('feedback_visibility', value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Everyone</SelectItem>
                        <SelectItem value="team">Team Members</SelectItem>
                        <SelectItem value="manager">Managers Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Enable Anonymous Feedback</Label>
                      <p className="text-white/60 text-sm">Allow anonymous feedback submissions</p>
                    </div>
                    <Switch checked={true} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">AI Sentiment Analysis</Label>
                      <p className="text-white/60 text-sm">Automatically analyze feedback sentiment</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Third-party Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Slack Integration</Label>
                      <p className="text-white/60 text-sm">Send notifications to Slack</p>
                    </div>
                    <Switch
                      checked={settings.slack_integration}
                      onCheckedChange={(checked) => handleSettingChange('slack_integration', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Google Calendar Sync</Label>
                      <p className="text-white/60 text-sm">Sync leave requests with Google Calendar</p>
                    </div>
                    <Switch checked={false} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Outlook Integration</Label>
                      <p className="text-white/60 text-sm">Sync with Microsoft Outlook</p>
                    </div>
                    <Switch checked={false} />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-white">HRIS System</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select HRIS system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bamboohr">BambooHR</SelectItem>
                        <SelectItem value="workday">Workday</SelectItem>
                        <SelectItem value="adp">ADP</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* General Settings */}
          <TabsContent value="general">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Require Leave Approval</Label>
                      <p className="text-white/60 text-sm">Managers must approve leave requests</p>
                    </div>
                    <Switch
                      checked={settings.leave_approval_required}
                      onCheckedChange={(checked) => handleSettingChange('leave_approval_required', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Morale Tracking</Label>
                      <p className="text-white/60 text-sm">Enable team morale monitoring</p>
                    </div>
                    <Switch
                      checked={settings.morale_tracking_enabled}
                      onCheckedChange={(checked) => handleSettingChange('morale_tracking_enabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Email Notifications</Label>
                      <p className="text-white/60 text-sm">Send email updates for important events</p>
                    </div>
                    <Switch
                      checked={settings.email_notifications}
                      onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Weekly Reports</Label>
                      <p className="text-white/60 text-sm">Generate weekly team reports</p>
                    </div>
                    <Switch
                      checked={settings.weekly_reports}
                      onCheckedChange={(checked) => handleSettingChange('weekly_reports', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
