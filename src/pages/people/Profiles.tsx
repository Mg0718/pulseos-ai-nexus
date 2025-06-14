
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Edit, MapPin, Clock, Briefcase, Mail, Phone, Calendar, Activity, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  employee_id: string;
  job_title: string;
  department: string;
  hire_date: string;
  employment_status: string;
  workspace_type: string;
  location: string;
  timezone: string;
  bio: string;
  skills: string[];
  phone: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
}

interface ActivityLog {
  id: string;
  type: string;
  description: string;
  created_at: string;
}

const Profiles = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    if (!user) return;

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Mock activity log for now
      const mockActivityLog: ActivityLog[] = [
        {
          id: '1',
          type: 'profile_update',
          description: 'Updated bio and skills',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          type: 'leave_request',
          description: 'Submitted vacation request for Dec 25-29',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          type: 'feedback_given',
          description: 'Gave feedback to John Doe',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setProfile(profileData);
      setEditedProfile(profileData);
      setActivityLog(mockActivityLog);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !editedProfile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(editedProfile)
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
      fetchProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const addSkill = () => {
    if (newSkill && editedProfile.skills && !editedProfile.skills.includes(newSkill)) {
      setEditedProfile(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditedProfile(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || [],
    }));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'profile_update':
        return <User className="w-4 h-4" />;
      case 'leave_request':
        return <Calendar className="w-4 h-4" />;
      case 'feedback_given':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'profile_update':
        return 'bg-blue-500/20 text-blue-400';
      case 'leave_request':
        return 'bg-green-500/20 text-green-400';
      case 'feedback_given':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-white">Profile not found</div>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">User Profile</h1>
              <p className="text-white/70">Manage your personal information and preferences.</p>
            </div>
            <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
              <DialogTrigger asChild>
                <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={editedProfile.full_name || ""}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, full_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input
                      id="job_title"
                      value={editedProfile.job_title || ""}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, job_title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={editedProfile.department || ""}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, department: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editedProfile.location || ""}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editedProfile.phone || ""}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={editedProfile.timezone || ""}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, timezone: e.target.value }))}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editedProfile.bio || ""}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Skills</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {editedProfile.skills?.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="cursor-pointer bg-[#6F2DBD]/20 text-purple-300"
                          onClick={() => removeSkill(skill)}
                        >
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a skill"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                      />
                      <Button onClick={addSkill} size="sm">Add</Button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsEditingProfile(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="bg-[#6F2DBD] text-white text-2xl">
                        {profile.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold text-white">{profile.full_name}</h2>
                    <p className="text-white/70">{profile.job_title}</p>
                    <Badge className="mt-2 bg-green-500/20 text-green-400">
                      {profile.employment_status}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white/80">
                      <Briefcase className="w-4 h-4" />
                      <span>{profile.department}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Clock className="w-4 h-4" />
                      <span>{profile.timezone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {profile.hire_date ? format(new Date(profile.hire_date), 'MMM yyyy') : 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid grid-cols-3 w-full bg-white/10 border border-white/20">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-[#6F2DBD]">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="data-[state=active]:bg-[#6F2DBD]">
                    Activity
                  </TabsTrigger>
                  <TabsTrigger value="permissions" className="data-[state=active]:bg-[#6F2DBD]">
                    Permissions
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="space-y-6">
                    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white">About</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-white/80">
                          {profile.bio || 'No bio provided yet.'}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white">Skills & Expertise</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills?.length > 0 ? (
                            profile.skills.map((skill) => (
                              <Badge key={skill} className="bg-[#6F2DBD]/20 text-purple-300">
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-white/60">No skills added yet.</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white">Emergency Contact</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-white/80">
                            <strong>Name:</strong> {profile.emergency_contact_name || 'Not provided'}
                          </p>
                          <p className="text-white/80">
                            <strong>Phone:</strong> {profile.emergency_contact_phone || 'Not provided'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="activity">
                  <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activityLog.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start gap-4 p-4 rounded-lg bg-white/5 border border-white/10"
                          >
                            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                              <p className="text-white">{activity.description}</p>
                              <p className="text-white/60 text-sm">
                                {format(new Date(activity.created_at), 'MMM dd, yyyy at h:mm a')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="permissions">
                  <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Permissions & Access</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                          <div>
                            <p className="text-white font-medium">People Module Access</p>
                            <p className="text-white/60 text-sm">View and manage team information</p>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400">Granted</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                          <div>
                            <p className="text-white font-medium">Leave Management</p>
                            <p className="text-white/60 text-sm">Submit and manage leave requests</p>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400">Granted</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                          <div>
                            <p className="text-white font-medium">Feedback System</p>
                            <p className="text-white/60 text-sm">Give and receive feedback</p>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400">Granted</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                          <div>
                            <p className="text-white font-medium">Admin Settings</p>
                            <p className="text-white/60 text-sm">Configure system settings</p>
                          </div>
                          <Badge className="bg-red-500/20 text-red-400">Denied</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profiles;
