
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  MapPin,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Edit,
  UserPlus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";

interface Team {
  id: string;
  name: string;
  description: string;
  created_at: string;
  member_count: number;
  lead_name?: string;
}

interface TeamMember {
  id: string;
  full_name: string;
  email: string;
  job_title: string;
  department: string;
  location: string;
  workspace_type: string;
  avatar_url: string;
  hire_date: string;
  employment_status: string;
}

const Teams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState<"teams" | "members">("teams");
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchTeamsData();
  }, [user]);

  const fetchTeamsData = async () => {
    if (!user) return;

    try {
      // Fetch teams
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (teamsError) throw teamsError;

      // Fetch profiles for team members
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('employment_status', 'active');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Use mock data if profiles fetch fails
        const mockMembers: TeamMember[] = [
          {
            id: "1",
            full_name: "Sarah Chen",
            email: "sarah@pulseos.com",
            job_title: "Engineering Lead",
            department: "Engineering",
            location: "San Francisco, CA",
            workspace_type: "hybrid",
            avatar_url: "",
            hire_date: "2023-01-15",
            employment_status: "active",
          },
          {
            id: "2",
            full_name: "Mike Johnson",
            email: "mike@pulseos.com",
            job_title: "Senior Developer",
            department: "Engineering",
            location: "Austin, TX",
            workspace_type: "remote",
            avatar_url: "",
            hire_date: "2023-02-20",
            employment_status: "active",
          },
          {
            id: "3",
            full_name: "Emma Wilson",
            email: "emma@pulseos.com",
            job_title: "UX Designer",
            department: "Design",
            location: "New York, NY",
            workspace_type: "office",
            avatar_url: "",
            hire_date: "2023-03-10",
            employment_status: "active",
          },
        ];
        setTeamMembers(mockMembers);
      } else {
        const transformedMembers: TeamMember[] = profilesData.map(profile => ({
          id: profile.id,
          full_name: profile.full_name || "Unknown",
          email: user?.email || "unknown@email.com",
          job_title: profile.job_title || "No title",
          department: profile.department || "No department",
          location: profile.location || "Unknown location",
          workspace_type: profile.workspace_type || "office",
          avatar_url: profile.avatar_url || "",
          hire_date: profile.hire_date || new Date().toISOString().split('T')[0],
          employment_status: profile.employment_status || "active",
        }));
        setTeamMembers(transformedMembers);
      }

      // Transform teams data
      const transformedTeams: Team[] = (teamsData || []).map(team => ({
        id: team.id,
        name: team.name,
        description: team.description || "",
        created_at: team.created_at,
        member_count: Math.floor(Math.random() * 10) + 3, // Mock member count
        lead_name: "Sarah Chen", // Mock lead name
      }));

      setTeams(transformedTeams);
    } catch (error) {
      console.error('Error fetching teams data:', error);
      toast.error('Failed to load teams data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async () => {
    if (!user || !newTeam.name) {
      toast.error('Please provide a team name');
      return;
    }

    try {
      const { error } = await supabase
        .from('teams')
        .insert({
          name: newTeam.name,
          description: newTeam.description,
          created_by: user.id,
        });

      if (error) throw error;

      toast.success('Team created successfully!');
      setIsCreateTeamOpen(false);
      setNewTeam({ name: "", description: "" });
      fetchTeamsData();
    } catch (error) {
      console.error('Error creating team:', error);
      toast.error('Failed to create team');
    }
  };

  const filteredMembers = teamMembers.filter(member =>
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-white">Loading teams...</div>
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
              <p className="text-white/70">Manage your team structure and members.</p>
            </div>
            <div className="flex gap-3">
              <Dialog open={isCreateTeamOpen} onOpenChange={setIsCreateTeamOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#6F2DBD] hover:bg-[#6F2DBD]/80">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Team
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle>Create New Team</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="team_name">Team Name</Label>
                      <Input
                        id="team_name"
                        value={newTeam.name}
                        onChange={(e) => setNewTeam(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter team name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="team_description">Description</Label>
                      <Textarea
                        id="team_description"
                        value={newTeam.description}
                        onChange={(e) => setNewTeam(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Brief description of the team"
                        rows={3}
                      />
                    </div>
                    <Button
                      onClick={handleCreateTeam}
                      disabled={!newTeam.name}
                      className="w-full bg-[#6F2DBD] hover:bg-[#6F2DBD]/80"
                    >
                      Create Team
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as "teams" | "members")}>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
              <TabsList className="bg-white/10 border border-white/20">
                <TabsTrigger value="teams" className="data-[state=active]:bg-[#6F2DBD]">
                  Teams
                </TabsTrigger>
                <TabsTrigger value="members" className="data-[state=active]:bg-[#6F2DBD]">
                  All Members
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search teams or members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <Button variant="outline" size="icon" className="border-white/20 text-white hover:bg-white/10">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Teams View */}
            <TabsContent value="teams">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              >
                {filteredTeams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 bg-[#6F2DBD] rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                        <CardTitle className="text-white">{team.name}</CardTitle>
                        <p className="text-gray-300 text-sm">{team.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback>{team.lead_name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-300">{team.lead_name}</span>
                          </div>
                          <Badge variant="secondary" className="bg-white/20 text-white">
                            {team.member_count} members
                          </Badge>
                        </div>
                        <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                          View Team Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* Members View */}
            <TabsContent value="members">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                      <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                          <div className="relative">
                            <Avatar className="w-20 h-20">
                              <AvatarImage src={member.avatar_url} />
                              <AvatarFallback className="bg-[#6F2DBD] text-white">
                                {member.full_name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white bg-green-500"></div>
                          </div>
                        </div>
                        <CardTitle className="text-white text-lg">{member.full_name}</CardTitle>
                        <p className="text-gray-300">{member.job_title}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Mail className="w-4 h-4" />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <MapPin className="w-4 h-4" />
                          {member.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Calendar className="w-4 h-4" />
                          Joined {format(new Date(member.hire_date), 'MMM yyyy')}
                        </div>
                        <Badge className={`${member.workspace_type === 'remote' ? 'bg-blue-500/20 text-blue-400' : 
                          member.workspace_type === 'hybrid' ? 'bg-purple-500/20 text-purple-400' : 
                          'bg-green-500/20 text-green-400'}`}>
                          {member.workspace_type}
                        </Badge>
                        <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                          View Profile
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Organization Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{teamMembers.length}</div>
                  <div className="text-sm text-gray-300">Total Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">{teams.length}</div>
                  <div className="text-sm text-gray-300">Active Teams</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {teamMembers.filter(m => m.workspace_type === 'remote').length}
                  </div>
                  <div className="text-sm text-gray-300">Remote Workers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">94%</div>
                  <div className="text-sm text-gray-300">Engagement Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Teams;
