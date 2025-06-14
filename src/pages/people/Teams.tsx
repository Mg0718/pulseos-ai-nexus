
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  job_title: string;
  department: string;
  location: string;
  workspace_type: string;
  avatar_url?: string;
  phone?: string;
  manager_id?: string;
}

const Teams = () => {
  const { user } = useAuth();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('employment_status', 'active');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOrgChart = () => {
    const managers = teamMembers.filter(member => 
      !member.manager_id || !teamMembers.find(m => m.id === member.manager_id)
    );
    
    const getTeamForManager = (managerId: string) => {
      return teamMembers.filter(member => member.manager_id === managerId);
    };

    return { managers, getTeamForManager };
  };

  const { managers, getTeamForManager } = getOrgChart();

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Teams & Organization</h1>
              <p className="text-white/70">Manage your organization structure and team members.</p>
            </div>
            <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Total Members</p>
                  <p className="text-2xl font-bold text-white">{teamMembers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Departments</p>
                  <p className="text-2xl font-bold text-white">
                    {new Set(teamMembers.map(m => m.department).filter(Boolean)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Remote Workers</p>
                  <p className="text-2xl font-bold text-white">
                    {teamMembers.filter(m => m.workspace_type === 'remote').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Managers</p>
                  <p className="text-2xl font-bold text-white">{managers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organization Chart */}
        <div className="space-y-6">
          {managers.map((manager) => {
            const team = getTeamForManager(manager.id);
            return (
              <motion.div
                key={manager.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Manager Card */}
                <Card className="bg-white/10 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={manager.avatar_url} />
                        <AvatarFallback className="bg-[#6F2DBD] text-white text-lg">
                          {manager.full_name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-white">{manager.full_name}</h3>
                          <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                            Manager
                          </Badge>
                        </div>
                        <p className="text-white/70 mb-2">{manager.job_title}</p>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {manager.email}
                          </div>
                          {manager.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {manager.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {manager.location || 'Not specified'}
                          </div>
                          <Badge variant="secondary">
                            {manager.workspace_type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {/* Team Members */}
                {team.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-8">
                    {team.map((member) => (
                      <Card key={member.id} className="bg-white/5 backdrop-blur-xl border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={member.avatar_url} />
                              <AvatarFallback className="bg-[#6F2DBD] text-white">
                                {member.full_name?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{member.full_name}</h4>
                              <p className="text-sm text-white/70">{member.job_title}</p>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm text-white/60">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {member.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {member.location || 'Not specified'}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {member.workspace_type}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Members without managers */}
          {teamMembers.filter(m => m.manager_id && !teamMembers.find(tm => tm.id === m.manager_id)).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-bold text-white">Independent Contributors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers
                  .filter(m => m.manager_id && !teamMembers.find(tm => tm.id === m.manager_id))
                  .map((member) => (
                    <Card key={member.id} className="bg-white/5 backdrop-blur-xl border-white/10">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar_url} />
                            <AvatarFallback className="bg-[#6F2DBD] text-white">
                              {member.full_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{member.full_name}</h4>
                            <p className="text-sm text-white/70">{member.job_title}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-white/60">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {member.email}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {member.location || 'Not specified'}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {member.workspace_type}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Teams;
