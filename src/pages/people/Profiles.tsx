
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Clock, Calendar, Edit3, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  employee_id: string | null;
  job_title: string | null;
  department: string | null;
  hire_date: string | null;
  employment_status: string | null;
  workspace_type: string | null;
  location: string | null;
  timezone: string | null;
  bio: string | null;
  skills: string[] | null;
  phone: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  created_at: string;
}

const Profiles = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});

  const isOwnProfile = !id || id === user?.id;
  const profileId = id || user?.id;

  useEffect(() => {
    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  const fetchProfile = async () => {
    if (!profileId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (error) throw error;
      setProfile(data);
      setEditedProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(editedProfile)
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, ...editedProfile });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
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
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl">
                      {profile.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {profile.full_name || 'Unknown User'}
                    </h1>
                    <p className="text-xl text-white/70 mb-2">{profile.job_title}</p>
                    <p className="text-white/60">{profile.department}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge className="bg-green-500/20 text-green-400">
                        {profile.employment_status || 'Active'}
                      </Badge>
                      {profile.workspace_type && (
                        <Badge className="bg-blue-500/20 text-blue-400">
                          {profile.workspace_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                {isOwnProfile && (
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <Button
                          onClick={handleSave}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="border-gray-600"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80"
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white/10 border-white/20">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contact">Contact Info</TabsTrigger>
              <TabsTrigger value="employment">Employment</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={editedProfile.bio || ''}
                        onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    ) : (
                      <p className="text-white/80">
                        {profile.bio || 'No bio available'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <div>
                        <Label>Skills (comma-separated)</Label>
                        <Input
                          value={editedProfile.skills?.join(', ') || ''}
                          onChange={(e) => setEditedProfile(prev => ({ 
                            ...prev, 
                            skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                          }))}
                          placeholder="React, TypeScript, Design..."
                        />
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profile.skills && profile.skills.length > 0 ? (
                          profile.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              className="bg-[#6F2DBD]/20 text-purple-300"
                            >
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-white/60">No skills listed</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contact">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.phone || ''}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Phone number"
                        />
                      ) : (
                        <p className="text-white/80">{profile.phone || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.location || ''}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="City, Country"
                        />
                      ) : (
                        <p className="text-white/80">{profile.location || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Timezone
                      </Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.timezone || ''}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, timezone: e.target.value }))}
                          placeholder="UTC+0"
                        />
                      ) : (
                        <p className="text-white/80">{profile.timezone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 mt-6">
                    <h3 className="text-white font-medium mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Name</Label>
                        {isEditing ? (
                          <Input
                            value={editedProfile.emergency_contact_name || ''}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                            placeholder="Emergency contact name"
                          />
                        ) : (
                          <p className="text-white/80">{profile.emergency_contact_name || 'Not provided'}</p>
                        )}
                      </div>
                      <div>
                        <Label>Phone</Label>
                        {isEditing ? (
                          <Input
                            value={editedProfile.emergency_contact_phone || ''}
                            onChange={(e) => setEditedProfile(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                            placeholder="Emergency contact phone"
                          />
                        ) : (
                          <p className="text-white/80">{profile.emergency_contact_phone || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employment">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Employment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Employee ID</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.employee_id || ''}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, employee_id: e.target.value }))}
                          placeholder="Employee ID"
                        />
                      ) : (
                        <p className="text-white/80">{profile.employee_id || 'Not assigned'}</p>
                      )}
                    </div>
                    <div>
                      <Label>Job Title</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.job_title || ''}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, job_title: e.target.value }))}
                          placeholder="Job title"
                        />
                      ) : (
                        <p className="text-white/80">{profile.job_title || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <Label>Department</Label>
                      {isEditing ? (
                        <Input
                          value={editedProfile.department || ''}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, department: e.target.value }))}
                          placeholder="Department"
                        />
                      ) : (
                        <p className="text-white/80">{profile.department || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Hire Date
                      </Label>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editedProfile.hire_date || ''}
                          onChange={(e) => setEditedProfile(prev => ({ ...prev, hire_date: e.target.value }))}
                        />
                      ) : (
                        <p className="text-white/80">
                          {profile.hire_date ? format(new Date(profile.hire_date), 'MMM dd, yyyy') : 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profiles;
