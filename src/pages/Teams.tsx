
import { useState } from "react";
import { motion } from "framer-motion";
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
  ArrowLeft
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const teams = [
  {
    id: 1,
    name: "Engineering",
    description: "Building the future of PulseOS",
    members: 12,
    lead: "Sarah Chen",
    avatar: "https://github.com/shadcn.png",
    color: "bg-blue-500",
    status: "Active"
  },
  {
    id: 2,
    name: "Product",
    description: "Defining user experiences",
    members: 8,
    lead: "Mike Johnson",
    avatar: "https://github.com/shadcn.png",
    color: "bg-purple-500",
    status: "Active"
  },
  {
    id: 3,
    name: "Design",
    description: "Creating beautiful interfaces",
    members: 6,
    lead: "Emma Wilson",
    avatar: "https://github.com/shadcn.png",
    color: "bg-pink-500",
    status: "Active"
  },
  {
    id: 4,
    name: "Marketing",
    description: "Growing our reach",
    members: 5,
    lead: "David Brown",
    avatar: "https://github.com/shadcn.png",
    color: "bg-green-500",
    status: "Active"
  }
];

const teamMembers = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Engineering Lead",
    email: "sarah@pulseos.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    avatar: "https://github.com/shadcn.png",
    status: "Online",
    joinDate: "2023-01-15"
  },
  {
    id: 2,
    name: "Mike Johnson",
    role: "Senior Developer",
    email: "mike@pulseos.com",
    phone: "+1 (555) 234-5678",
    location: "Austin, TX",
    avatar: "https://github.com/shadcn.png",
    status: "Away",
    joinDate: "2023-02-20"
  },
  {
    id: 3,
    name: "Emma Wilson",
    role: "UX Designer",
    email: "emma@pulseos.com",
    phone: "+1 (555) 345-6789",
    location: "New York, NY",
    avatar: "https://github.com/shadcn.png",
    status: "Online",
    joinDate: "2023-03-10"
  },
  {
    id: 4,
    name: "David Brown",
    role: "Product Manager",
    email: "david@pulseos.com",
    phone: "+1 (555) 456-7890",
    location: "Seattle, WA",
    avatar: "https://github.com/shadcn.png",
    status: "Offline",
    joinDate: "2023-01-08"
  }
];

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState<"teams" | "members">("teams");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">People & TeamOps</h1>
                  <p className="text-blue-300 text-sm">Smart onboarding & team management</p>
                </div>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-6 py-8">
        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <div className="flex gap-2">
              <Button 
                variant={selectedView === "teams" ? "default" : "outline"}
                onClick={() => setSelectedView("teams")}
                className="text-white border-white/20"
              >
                Teams
              </Button>
              <Button 
                variant={selectedView === "members" ? "default" : "outline"}
                onClick={() => setSelectedView("members")}
                className="text-white border-white/20"
              >
                All Members
              </Button>
            </div>
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
        </motion.div>

        {/* Teams View */}
        {selectedView === "teams" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {teams.map((team, index) => (
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
                      <div className={`w-12 h-12 ${team.color} rounded-xl flex items-center justify-center`}>
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-white">{team.name}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {team.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={team.avatar} />
                          <AvatarFallback>{team.lead.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-300">{team.lead}</span>
                      </div>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {team.members} members
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
        )}

        {/* Members View */}
        {selectedView === "members" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {teamMembers.map((member, index) => (
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
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${
                          member.status === 'Online' ? 'bg-green-500' : 
                          member.status === 'Away' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}></div>
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg">{member.name}</CardTitle>
                    <CardDescription className="text-gray-300">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Phone className="w-4 h-4" />
                      {member.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <MapPin className="w-4 h-4" />
                      {member.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(member.joinDate).toLocaleDateString()}
                    </div>
                    <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

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
                Team Analytics
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
                  <div className="text-2xl font-bold text-blue-400 mb-1">2</div>
                  <div className="text-sm text-gray-300">Online Now</div>
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
